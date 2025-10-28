"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
}

export interface UseCollabReturn {
  isConnected: boolean;
  connectionState: "connected" | "disconnected" | "connecting" | "error";
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: SendMessagePayload) => boolean;
  error: WebSocketError | null;
  isSynced: boolean;
}

export function useCollab({
  roomId,
  wsUrl = "ws://localhost:8082",
  enabled = true,
  onSync,
  onError,
}: UseCollabOptions): UseCollabReturn {
  const [isSynced, setIsSynced] = useState(false);
  const isUpdatingFromRemote = useRef(false);
  const lastLocalUpdate = useRef<string>("");
  const lastSendTime = useRef<number>(0);
  const updateCountRef = useRef<number>(0);

  const { getToken, isLoaded, userId } = useAuth();
  const { elements, loadElements } = useElementStore();
  const mouseStore = useMouseStore();

  const elementsJSON = useMemo(() => {
    try {
      return JSON.stringify(elements);
    } catch (err) {
      console.error("[useCollab] ❌ Failed to stringify elements:", err);
      return "[]";
    }
  }, [elements]);

  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      if (isSyncMessage(message)) {
        isUpdatingFromRemote.current = true;

        let remoteJSON: string;
        try {
          remoteJSON = JSON.stringify(message.elements);
        } catch (err) {
          console.error(
            "[useCollab] ❌ Failed to stringify remote elements:",
            err,
          );
          remoteJSON = "[]";
        }
        lastLocalUpdate.current = remoteJSON;

        loadElements(message.elements, true);

        setTimeout(() => {
          isUpdatingFromRemote.current = false;
          setIsSynced(true);

          onSync?.();
        }, 200);
      } else if (isUpdateMessage(message)) {
        let remoteJSON: string;
        try {
          remoteJSON = JSON.stringify(message.elements);
        } catch (err) {
          console.error(
            "[useCollab] ❌ Failed to stringify remote elements:",
            err,
          );
          remoteJSON = "[]";
        }
        if (remoteJSON !== lastLocalUpdate.current) {
          isUpdatingFromRemote.current = true;
          lastLocalUpdate.current = remoteJSON;

          loadElements(message.elements, true);

          setTimeout(() => {
            isUpdatingFromRemote.current = false;
          }, 200);
        }
      } else if (isErrorMessage(message)) {
        console.error("[useCollab] ❌ Server error:", message.error);
        const error = new Error(message.error);
        onError?.(error);
      } else if (isMouseMoveMessage(message)) {
        mouseStore.updateMousePosition(message.userId, {
          x: message.x,
          y: message.y,
        });
      } else if (isCurrentStateMessage(message)) {
        const convertedPositions: Record<string, { x: number; y: number }> = {};
        Object.entries(message.mousePositions).forEach(([userId, pos]) => {
          convertedPositions[userId] = { x: pos.X, y: pos.Y };
        });
        mouseStore.setMousePositions(convertedPositions);
        mouseStore.setSelectedElements(message.selectedElements);
      } else if (isUserDisconnectMessage(message)) {
        mouseStore.removeMousePosition(message.userId);
      }
    },
    [loadElements, onSync, onError, mouseStore],
  );

  const isWebSocketEnabled = enabled && isLoaded && !!userId;

  const {
    connectionState,
    isConnected,
    connect,
    disconnect,
    sendMessage,
    reconnect,
    error,
  } = useWebSocket({
    url: wsUrl,
    roomId,
    userId: userId!,
    getToken,
    autoConnect: isWebSocketEnabled,
    reconnectInterval: 1000,
    maxReconnectAttempts: 2,
    onMessage: handleMessage,
    onConnect: () => {},
    onDisconnect: () => {
      setIsSynced(false);
    },
    onError: (err: WebSocketErrorEvent) => {
      console.error("[useCollab] WebSocket error:", err);
      const error = new Error("WebSocket connection error");
      onError?.(error);
    },
  });

  console.log("[useCollab] Connection state:", {
    isConnected,
    connectionState,
    enabled,
    isLoaded,
    isWebSocketEnabled,
  });

  useEffect(() => {
    if (enabled && isLoaded && !isConnected) {
      reconnect();
    }
  }, [isLoaded, enabled, isConnected, reconnect]);

  const debouncedSend = useRef(
    debounce((elementsToSend: EditorElement[], currentJSON: string) => {
      const now = Date.now();
      const timeSinceLastSend = now - lastSendTime.current;

      if (timeSinceLastSend < 500 && updateCountRef.current > 10) {
        return;
      }

      lastLocalUpdate.current = currentJSON;
      lastSendTime.current = now;
      updateCountRef.current++;

      sendMessage({
        type: "update",
        elements: elementsToSend,
      });

      setTimeout(() => {
        updateCountRef.current = 0;
      }, 1000);
    }, 300),
  ).current;

  useEffect(() => {
    if (
      !enabled ||
      !isConnected ||
      !isSynced ||
      isUpdatingFromRemote.current ||
      elements.length === 0 ||
      elementsJSON === lastLocalUpdate.current
    ) {
      return;
    }

    debouncedSend(elements, elementsJSON);
  }, [
    elementsJSON,
    elements,
    enabled,
    isConnected,
    isSynced,
    sendMessage,
    debouncedSend,
  ]);

  useEffect(() => {
    return () => {
      debouncedSend.cancel();
    };
  }, [debouncedSend]);

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
    sendMessage,
    error,
    isSynced,
  };
}
