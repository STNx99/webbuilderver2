"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useElementStore } from "@/globalstore/elementstore";
import { useMouseStore } from "@/globalstore/mousestore";
import { EditorElement } from "@/types/global.type";
import { useWebSocket } from "./use-websocket";
import { debounce } from "lodash";
import {
  WebSocketMessage,
  WebSocketErrorEvent,
  WebSocketError,
  SendMessagePayload,
  isSyncMessage,
  isUpdateMessage,
  isErrorMessage,
  isMouseMoveMessage,
  isCurrentStateMessage,
  isUserDisconnectMessage,
} from "@/interfaces/realtime.interface";

export interface UseCollabOptions {
  roomId: string;
  wsUrl?: string;
  enabled?: boolean;
  onSync?: () => void;
  onError?: (error: Error) => void;
  debounceMs?: number;
  throttleMs?: number;
  maxRapidUpdates?: number;
}

export interface UseCollabReturn {
  isConnected: boolean;
  connectionState: "connected" | "disconnected" | "connecting" | "error";
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: SendMessagePayload) => boolean;
  error: WebSocketError | null;
  isSynced: boolean;
  pendingUpdates: number;
}

export function useCollab({
  roomId,
  wsUrl = "ws://localhost:8082",
  enabled = true,
  onSync,
  onError,
  debounceMs = 300,
  throttleMs = 500,
  maxRapidUpdates = 10,
}: UseCollabOptions): UseCollabReturn {
  const [isSynced, setIsSynced] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState(0);

  const isUpdatingFromRemote = useRef(false);
  const lastLocalStateHash = useRef<string>("");
  const lastSentStateHash = useRef<string>("");
  const lastSendTime = useRef<number>(0);
  const updateCountRef = useRef<number>(0);
  const hasAttemptedConnect = useRef(false);
  const resetCounterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  const remoteUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { getToken, isLoaded, userId } = useAuth();
  const { elements, loadElements } = useElementStore();
  const mouseStore = useMouseStore();

  const computeElementsHash = useCallback(
    (elements: EditorElement[]): string => {
      try {
        return JSON.stringify(elements);
      } catch (err) {
        return "[]";
      }
    },
    [],
  );

  const initializeStateHashes = useCallback(() => {
    if (!isInitialized.current) {
      const currentHash = computeElementsHash(elements);
      lastLocalStateHash.current = currentHash;
      lastSentStateHash.current = currentHash;
      isInitialized.current = true;
    }
  }, [elements, computeElementsHash]);

  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case "sync": {
          console.log("[Collab] Received sync message");
          isUpdatingFromRemote.current = true;

          if (remoteUpdateTimeoutRef.current) {
            clearTimeout(remoteUpdateTimeoutRef.current);
          }

          remoteUpdateTimeoutRef.current = setTimeout(() => {
            if (isUpdatingFromRemote.current) {
              console.warn(
                "[Collab] Safety reset: isUpdatingFromRemote was stuck",
              );
              isUpdatingFromRemote.current = false;
            }
          }, 1000);

          const remoteHash = computeElementsHash(message.elements);
          lastLocalStateHash.current = remoteHash;
          lastSentStateHash.current = remoteHash;

          loadElements(message.elements, true);

          setTimeout(() => {
            isUpdatingFromRemote.current = false;
            if (remoteUpdateTimeoutRef.current) {
              clearTimeout(remoteUpdateTimeoutRef.current);
              remoteUpdateTimeoutRef.current = null;
            }
            setIsSynced(true);

            onSync?.();
          }, 50);
          break;
        }
        case "update": {
          console.log("[Collab] Received update message");
          const remoteHash = computeElementsHash(message.elements);

          if (remoteHash !== lastLocalStateHash.current) {
            isUpdatingFromRemote.current = true;

            if (remoteUpdateTimeoutRef.current) {
              clearTimeout(remoteUpdateTimeoutRef.current);
            }

            remoteUpdateTimeoutRef.current = setTimeout(() => {
              if (isUpdatingFromRemote.current) {
                console.warn(
                  "[Collab] Safety reset: isUpdatingFromRemote was stuck",
                );
                isUpdatingFromRemote.current = false;
              }
            }, 1000);

            lastLocalStateHash.current = remoteHash;

            loadElements(message.elements, true);

            setTimeout(() => {
              isUpdatingFromRemote.current = false;
              if (remoteUpdateTimeoutRef.current) {
                clearTimeout(remoteUpdateTimeoutRef.current);
                remoteUpdateTimeoutRef.current = null;
              }
            }, 50);
          }
          break;
        }
        case "error": {
          console.error("[Collab] Server error:", message.error);
          const error = new Error(message.error);
          onError?.(error);
          break;
        }
        case "mouseMove": {
          mouseStore.updateMousePosition(message.userId, {
            x: message.x,
            y: message.y,
          });
          break;
        }
        case "currentState": {
          const convertedPositions: Record<string, { x: number; y: number }> =
            {};
          Object.entries(message.mousePositions).forEach(([userId, pos]) => {
            convertedPositions[userId] = { x: pos.X, y: pos.Y };
          });
          mouseStore.setMousePositions(convertedPositions);
          mouseStore.setSelectedElements(message.selectedElements);
          mouseStore.setUsers(message.users);
          break;
        }
        case "userDisconnect": {
          mouseStore.removeMousePosition(message.userId);
          mouseStore.removeUser(message.userId);
          break;
        }
        default:
          break;
      }
    },
    [computeElementsHash, loadElements, onSync, onError, mouseStore],
  );

  const isWebSocketEnabled = enabled && isLoaded && !!userId;

  const {
    connectionState,
    isConnected,
    connect,
    disconnect,
    sendMessage,
    error,
  } = useWebSocket({
    url: wsUrl,
    roomId,
    userId: userId || "",
    getToken,
    autoConnect: false,
    reconnectInterval: 1000,
    maxReconnectAttempts: 2,
    onMessage: handleMessage,
    onConnect: () => {
      setIsSynced(true);
    },
    onDisconnect: () => {
      setIsSynced(false);
    },
    onError: (err: WebSocketErrorEvent) => {
      const error = new Error("WebSocket connection error");
      onError?.(error);
    },
  });

  useEffect(() => {
    if (
      isWebSocketEnabled &&
      connectionState === "disconnected" &&
      !hasAttemptedConnect.current
    ) {
      hasAttemptedConnect.current = true;
      connect();
    }

    if (connectionState === "disconnected" && !isWebSocketEnabled) {
      hasAttemptedConnect.current = false;
    }
  }, [isWebSocketEnabled, connectionState, connect]);

  const sendElementsUpdate = useCallback(
    (elements: EditorElement[], currentHash: string) => {
      const now = Date.now();
      const timeSinceLastSend = now - lastSendTime.current;

      if (
        timeSinceLastSend < throttleMs &&
        updateCountRef.current >= maxRapidUpdates
      ) {
        setPendingUpdates((prev) => prev + 1);
        return;
      }

      lastSentStateHash.current = currentHash;
      lastLocalStateHash.current = currentHash;
      lastSendTime.current = now;
      updateCountRef.current++;

      const success = sendMessage({
        type: "update",
        elements,
      });

      if (success) {
        setPendingUpdates(0);
      }

      if (resetCounterTimerRef.current) {
        clearTimeout(resetCounterTimerRef.current);
      }
      resetCounterTimerRef.current = setTimeout(() => {
        updateCountRef.current = 0;
      }, 1000);
    },
    [sendMessage, throttleMs, maxRapidUpdates],
  );

  const debouncedSendElementsUpdate = useRef(
    debounce(sendElementsUpdate, debounceMs),
  ).current;

  useEffect(() => {
    initializeStateHashes();
  }, [initializeStateHashes]);

  useEffect(() => {
    if (!enabled || !isConnected || !isSynced) {
      return;
    }

    if (isUpdatingFromRemote.current) {
      return;
    }

    const currentHash = computeElementsHash(elements);

    if (currentHash === lastLocalStateHash.current) {
      return;
    }

    if (currentHash === lastSentStateHash.current) {
      return;
    }

    lastLocalStateHash.current = currentHash;

    debouncedSendElementsUpdate(elements, currentHash);
  }, [
    elements,
    enabled,
    isConnected,
    isSynced,
    computeElementsHash,
    debouncedSendElementsUpdate,
  ]);

  useEffect(() => {
    return () => {
      debouncedSendElementsUpdate.cancel();
      if (resetCounterTimerRef.current) {
        clearTimeout(resetCounterTimerRef.current);
      }
      if (remoteUpdateTimeoutRef.current) {
        clearTimeout(remoteUpdateTimeoutRef.current);
      }
      isInitialized.current = false;
    };
  }, [debouncedSendElementsUpdate]);

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
    sendMessage,
    error,
    isSynced,
    pendingUpdates,
  };
}
