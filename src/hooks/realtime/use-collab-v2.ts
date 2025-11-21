"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useElementStore } from "@/globalstore/elementstore";
import { useMouseStore } from "@/globalstore/mousestore";
import { EditorElement } from "@/types/global.type";
import { useWebSocket } from "./use-websocket";
import { debounce } from "lodash";
import type { DebouncedFunc } from "lodash";
import {
  WebSocketMessage,
  WebSocketError,
  SendMessagePayload,
  isSyncMessage,
  isUpdateMessage,
  isCurrentStateMessage,
  isMouseMoveMessage,
  isUserDisconnectMessage,
  isErrorMessage,
} from "@/interfaces/realtime.interface";
import {
  validateAndNormalizeElementTree,
  safeValidateElementTree,
  validateContainerElementTree,
} from "@/lib/utils/element/containerElementValidator";

type RoomState = "idle" | "connecting" | "connected" | "error";

interface CollabState {
  roomState: RoomState;
  error: WebSocketError | null;
  isSynced: boolean;
  pendingUpdates: number;
}

export interface UseCollabV2Options {
  roomId: string;
  projectId?: string;
  wsUrl?: string;
  enabled?: boolean;
  onSync?: () => void;
  onError?: (error: Error) => void;
  debounceMs?: number;
  throttleMs?: number;
}

export interface UseCollabV2Return {
  isConnected: boolean;
  roomState: RoomState;
  error: WebSocketError | null;
  isSynced: boolean;
  pendingUpdates: number;
  sendMessage: (message: SendMessagePayload) => boolean;
}

export function useCollabV2({
  roomId,
  projectId,
  wsUrl = "ws://localhost:8082",
  enabled = true,
  onSync,
  onError,
  debounceMs = 300,
  throttleMs = 500,
}: UseCollabV2Options): UseCollabV2Return {
  // ============================================================================
  // STATE
  // ============================================================================

  const [state, setState] = useState<CollabState>({
    roomState: "idle",
    error: null,
    isSynced: false,
    pendingUpdates: 0,
  });

  // Internal state tracking (doesn't trigger re-renders)
  const internalStateRef = useRef({
    isUpdatingFromRemote: false,
    lastLocalHash: "",
    lastSentHash: "",
    lastSendTime: 0,
    updateCount: 0,
    remoteUpdateTimeout: null as NodeJS.Timeout | null,
  });

  const { getToken, isLoaded, userId } = useAuth();
  const { elements, loadElements } = useElementStore();
  const mouseStore = useMouseStore();

  // ============================================================================
  // WEBSOCKET CONNECTION
  // ============================================================================

  const {
    connectionState,
    isConnected: wsIsConnected,
    connect: wsConnect,
    disconnect: wsDisconnect,
    sendMessage: rawSendMessage,
    error: wsError,
  } = useWebSocket({
    url: wsUrl,
    roomId,
    userId: userId || "",
    projectId,
    getToken,
    autoConnect: false,
    reconnectInterval: 1000,
    maxReconnectAttempts: 3,
    onMessage: handleMessage,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onError: handleError,
  });

  // ============================================================================
  // MESSAGE HANDLERS
  // ============================================================================

  function handleMessage(message: WebSocketMessage) {
    if (isSyncMessage(message)) {
      handleSync(message);
    } else if (isUpdateMessage(message)) {
      handleUpdate(message);
    } else if (isCurrentStateMessage(message)) {
      handleCurrentState(message);
    } else if (isMouseMoveMessage(message)) {
      mouseStore.updateMousePosition(message.userId, {
        x: message.x,
        y: message.y,
      });
    } else if (isElementSelectedMessage(message)) {
      console.log("[Collab] Received elementSelected message", {
        userId: message.userId.slice(0, 8),
        elementId: message.elementId.slice(0, 8),
      });
      mouseStore.setSelectedElement(message.userId, message.elementId);
    } else if (isUserDisconnectMessage(message)) {
      mouseStore.removeMousePosition(message.userId);
      mouseStore.removeUser(message.userId);
    } else if (isErrorMessage(message)) {
      onError?.(new Error(message.error));
    }
  }


  function handleSync(msg: SyncMessageType) {
    internalStateRef.current.isUpdatingFromRemote = true;
    clearRemoteTimeout();

    internalStateRef.current.remoteUpdateTimeout = setTimeout(() => {
      internalStateRef.current.isUpdatingFromRemote = false;
    }, 2000);

    // Validate and normalize container elements using Zod
    const validationResult = safeValidateElementTree(msg.elements);
    if (!validationResult.success) {
      console.error(
        "[Collab] Failed to validate elements during sync:",
        validationResult.error,
      );
      return;
    }

    const normalizedElements = validationResult.data || [];
    const validation = validateContainerElementTree(normalizedElements);
    if (!validation.valid) {
      console.warn(
        "[Collab] Container element validation issues detected during sync",
        validation.issues,
      );
    }

    const hash = computeHash(normalizedElements);
    internalStateRef.current.lastLocalHash = hash;
    internalStateRef.current.lastSentHash = hash;

    loadElements(normalizedElements, true);

    if (msg.users) {
      mouseStore.setUsers(msg.users);
    }

    if (msg.mousePositions) {
      const converted: Record<string, { x: number; y: number }> = {};
      Object.entries(msg.mousePositions).forEach(([uid, pos]) => {
        converted[uid] = { x: pos.X, y: pos.Y };
      });
      mouseStore.setMousePositions(converted);
    }

    if (msg.selectedElements) {
      mouseStore.setSelectedElements(msg.selectedElements);
    }

    setTimeout(() => {
      internalStateRef.current.isUpdatingFromRemote = false;
      clearRemoteTimeout();

      setState((prev) => ({
        ...prev,
        isSynced: true,
      }));

      onSync?.();
    }, 100);
  }

  function handleUpdate(msg: UpdateMessageType) {
    if (internalStateRef.current.isUpdatingFromRemote) {
      return;
    }

    // Validate and normalize container elements using Zod
    const validationResult = safeValidateElementTree(msg.elements);
    if (!validationResult.success) {
      console.error(
        "[Collab] Failed to validate elements during update:",
        validationResult.error,
      );
      return;
    }

    const normalizedElements = validationResult.data || [];
    const validation = validateContainerElementTree(normalizedElements);
    if (!validation.valid) {
      console.warn(
        "[Collab] Container element validation issues detected during update",
        validation.issues,
      );
    }

    const hash = computeHash(normalizedElements);
    if (hash !== internalStateRef.current.lastLocalHash) {
      internalStateRef.current.isUpdatingFromRemote = true;
      clearRemoteTimeout();

      internalStateRef.current.remoteUpdateTimeout = setTimeout(() => {
        internalStateRef.current.isUpdatingFromRemote = false;
      }, 2000);

      internalStateRef.current.lastLocalHash = hash;
      loadElements(normalizedElements, true);

      setTimeout(() => {
        internalStateRef.current.isUpdatingFromRemote = false;
        clearRemoteTimeout();
      }, 100);
    }
  }

  function handleCurrentState(msg: CurrentStateMessageType) {
    const converted: Record<string, { x: number; y: number }> = {};
    Object.entries(msg.mousePositions).forEach(([uid, pos]) => {
      converted[uid] = { x: pos.X, y: pos.Y };
    });

    mouseStore.setMousePositions(converted);

    console.log("[Collab] Received currentState with selectedElements", {
      selectedElements: Object.entries(msg.selectedElements).map(([uid, eid]) => ({
        userId: uid.slice(0, 8),
        elementId: eid.slice(0, 8),
      })),
    });

    mouseStore.setSelectedElements(msg.selectedElements);

    if (Object.keys(msg.users).length > 0) {
      mouseStore.setUsers(msg.users);
    }
  }

  function handleConnect() {
    setState((prev) => ({
      ...prev,
      roomState: "connected",
      error: null,
      isSynced: false,
    }));
  }

  function handleDisconnect() {
    setState((prev) => ({
      ...prev,
      roomState: "idle",
      isSynced: false,
    }));
    mouseStore.clear();
  }

  function handleError(err: Event) {
    setState((prev) => ({
      ...prev,
      roomState: "error",
      error: wsError,
    }));
    onError?.(new Error("WebSocket connection error"));
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function computeHash(elements: EditorElement[]): string {
    try {
      return JSON.stringify(elements);
    } catch {
      return "[]";
    }
  }

  function clearRemoteTimeout() {
    if (internalStateRef.current.remoteUpdateTimeout) {
      clearTimeout(internalStateRef.current.remoteUpdateTimeout);
      internalStateRef.current.remoteUpdateTimeout = null;
    }
  }

  // ============================================================================
  // MESSAGE SENDING
  // ============================================================================

  const sendMessage = useCallback(
    (message: SendMessagePayload): boolean => {
      // Always allow mouse moves (they're queued if not connected)
      if (message.type === "mouseMove") {
        return rawSendMessage(message);
      }

      // For updates, only send if connected
      if (message.type === "update") {
        if (state.roomState !== "connected") {
          return false;
        }

        return rawSendMessage(message);
      }

      // For element selection, always allow (queued if not connected)
      if (message.type === "elementSelected") {
        return rawSendMessage(message);
      }

      // For other messages, send if connected
      return rawSendMessage(message);
    },
    [state.roomState, rawSendMessage],
  );

  // ============================================================================
  // ELEMENT UPDATES
  // ============================================================================

  const sendElementsUpdate = useCallback(
    (elementsToSend: EditorElement[]) => {
      // Skip if not connected or already updating from remote
      if (state.roomState !== "connected") {
        return;
      }

      if (internalStateRef.current.isUpdatingFromRemote) {
        return;
      }

      const now = Date.now();
      const timeSinceLastSend = now - internalStateRef.current.lastSendTime;

      // Throttle rapid updates
      if (
        timeSinceLastSend < throttleMs &&
        internalStateRef.current.updateCount >= 10
      ) {
        setState((prev) => ({
          ...prev,
          pendingUpdates: prev.pendingUpdates + 1,
        }));
        return;
      }

      const hash = computeHash(elementsToSend);

      // Skip if nothing changed
      if (hash === internalStateRef.current.lastLocalHash) {
        return;
      }

      // Skip if already sent
      if (hash === internalStateRef.current.lastSentHash) {
        return;
      }

      internalStateRef.current.lastLocalHash = hash;
      internalStateRef.current.lastSentHash = hash;
      internalStateRef.current.lastSendTime = now;
      internalStateRef.current.updateCount++;

      const success = sendMessage({
        type: "update",
        elements: elementsToSend,
      });

      if (success) {
        setState((prev) => ({
          ...prev,
          pendingUpdates: 0,
        }));
      }

      // Reset update counter after 1 second
      setTimeout(() => {
        internalStateRef.current.updateCount = 0;
      }, 1000);
    },
    [state.roomState, sendMessage, throttleMs],
  );

  // Recreate debounced function whenever sendElementsUpdate changes to avoid closure issues
  const debouncedSendElements = useRef<DebouncedFunc<
    (elements: EditorElement[]) => void
  > | null>(null);

  useEffect(() => {
    debouncedSendElements.current = debounce(sendElementsUpdate, debounceMs);
  }, [sendElementsUpdate, debounceMs]);

  // ============================================================================
  // CONNECTION LIFECYCLE
  // ============================================================================

  // Handle enable/disable
  useEffect(() => {
    const shouldConnect = enabled && isLoaded && !!userId;

    if (shouldConnect && state.roomState === "idle") {
      setState((prev) => ({
        ...prev,
        roomState: "connecting",
      }));
      wsConnect();
    } else if (!shouldConnect && state.roomState !== "idle") {
      wsDisconnect();
      setState((prev) => ({
        ...prev,
        roomState: "idle",
      }));
    }
  }, [
    enabled,
    isLoaded,
    userId,
    roomId,
    state.roomState,
    wsConnect,
    wsDisconnect,
  ]);

  // ============================================================================
  // ELEMENT CHANGE DETECTION
  // ============================================================================

  useEffect(() => {
    if (state.roomState !== "connected" || !state.isSynced) {
      return;
    }

    if (internalStateRef.current.isUpdatingFromRemote) {
      return;
    }

    debouncedSendElements.current?.(elements);
  }, [elements, state.roomState, state.isSynced, debounceMs]);

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    return () => {
      debouncedSendElements.current?.cancel();
      clearRemoteTimeout();
    };
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    isConnected: state.roomState === "connected",
    roomState: state.roomState,
    error: state.error,
    isSynced: state.isSynced,
    pendingUpdates: state.pendingUpdates,
    sendMessage,
  };
}
