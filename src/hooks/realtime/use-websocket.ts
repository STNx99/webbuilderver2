"use client";

import { useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  WebSocketMessage,
  UseWebSocketOptions,
  UseWebSocketReturn,
  SendMessagePayload,
  WebSocketError,
  WebSocketErrorEvent,
  isSyncMessage,
  isUpdateMessage,
  isErrorMessage,
  isMouseMoveMessage,
  isCurrentStateMessage,
  isUserDisconnectMessage,
} from "@/interfaces/realtime.interface";

// Track active connections to prevent duplicates
const activeConnections = new Map<string, boolean>();

// Calculate exponential backoff with jitter
const calculateBackoff = (attempt: number, baseDelay: number): number => {
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), 30000);
  const jitter = Math.random() * 1000;
  return exponentialDelay + jitter;
};

export function useWebSocket({
  url,
  roomId,
  userId,
  projectId,
  getToken,
  autoConnect = true,
  reconnectInterval = 1000,
  maxReconnectAttempts = 10,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [error, setError] = useState<WebSocketError | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isManualDisconnectRef = useRef(false);
  const messageQueueRef = useRef<any[]>([]);
  const hasInitializedRef = useRef(false);
  const shouldReconnectRef = useRef(true);
  const currentRoomRef = useRef<string>(roomId);

  const callbacksRef = useRef({
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  });

  useEffect(() => {
    callbacksRef.current = {
      onMessage,
      onConnect,
      onDisconnect,
      onError,
    };
  }, [onMessage, onConnect, onDisconnect, onError]);

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  // Disconnect function
  const disconnect = () => {
    const connectionKey = `${roomId}:${userId}`;
    activeConnections.delete(connectionKey);
    isManualDisconnectRef.current = true;
    shouldReconnectRef.current = false;
    clearReconnectTimeout();

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setConnectionState("disconnected");
    messageQueueRef.current = [];
  };

  // Connect function
  const connect = async () => {
    const connectionKey = `${roomId}:${userId}`;
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    // Check if another instance is already connecting
    if (activeConnections.get(connectionKey)) {
      return;
    }

    activeConnections.set(connectionKey, true);
    isManualDisconnectRef.current = false;
    setConnectionState("connecting");
    setError(null);

    // Get Clerk token
    const token = await getToken?.();
    if (!token) {
      setError("AUTH_ERROR");
      setConnectionState("error");
      activeConnections.delete(connectionKey);
      return;
    }

    const wsUrl = `${url}/ws/${roomId}?token=${encodeURIComponent(token)}${projectId ? `&projectId=${encodeURIComponent(projectId)}` : ""}`;
    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setConnectionState("connected");
        setError(null);
        reconnectAttemptsRef.current = 0;

        while (messageQueueRef.current.length > 0) {
          const message = messageQueueRef.current.shift();
          if (message && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
          }
        }
        callbacksRef.current.onConnect?.();
      };

      ws.onmessage = (event) => {
        if (typeof event.data !== "string") {
          return;
        }

        try {
          const data = JSON.parse(event.data) as WebSocketMessage;

          if (
            isSyncMessage(data) ||
            isUpdateMessage(data) ||
            isErrorMessage(data) ||
            isMouseMoveMessage(data) ||
            isCurrentStateMessage(data) ||
            isUserDisconnectMessage(data)
          ) {
            if (error === "PARSE_ERROR") {
              setError(null);
            }
            callbacksRef.current.onMessage?.(data);
          }
        } catch (err) {
          setError("PARSE_ERROR");
        }
      };

      // Connection error
      ws.onerror = (event: WebSocketErrorEvent) => {
        setConnectionState("error");
        setError("CONNECTION_FAILED");
        callbacksRef.current.onError?.(event);
      };

      // Connection closed
      ws.onclose = (event) => {
        const connectionKey = `${roomId}:${userId}`;
        activeConnections.delete(connectionKey);
        wsRef.current = null;
        setConnectionState("disconnected");

        // Only attempt reconnection if:
        // 1. Not a manual disconnect
        // 2. Not exceeded max attempts
        // 3. Reconnection is enabled
        // 4. Still in the same room (not switched projects)
        if (
          !isManualDisconnectRef.current &&
          shouldReconnectRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          currentRoomRef.current === roomId
        ) {
          const attempt = reconnectAttemptsRef.current;
          reconnectAttemptsRef.current++;

          // Use exponential backoff for reconnection
          const backoffDelay = calculateBackoff(attempt, reconnectInterval);

          clearReconnectTimeout();
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, backoffDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          shouldReconnectRef.current = false;
          setError("SERVER_UNAVAILABLE");
          clearReconnectTimeout();
        }

        callbacksRef.current.onDisconnect?.();
      };

      wsRef.current = ws;
    } catch (err) {
      const connectionKey = `${roomId}:${userId}`;
      activeConnections.delete(connectionKey);
      setConnectionState("error");
      setError("CONNECTION_FAILED");
    }
  };

  // Send message function
  const sendMessage = (message: SendMessagePayload): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        return true;
      } catch (err) {
        return false;
      }
    } else {
      messageQueueRef.current.push(message);
      return false;
    }
  };

  // Reconnect function (resets attempt counter)
  const reconnect = () => {
    disconnect();
    shouldReconnectRef.current = true;
    reconnectAttemptsRef.current = 0;
    setTimeout(() => connect(), 100);
  };

  // Handle room changes - disconnect from old room and prepare for reconnection
  useEffect(() => {
    const previousRoom = currentRoomRef.current;

    if (previousRoom !== roomId) {
      // Close existing connection if any
      if (wsRef.current) {
        const connectionKey = `${previousRoom}:${userId}`;
        activeConnections.delete(connectionKey);
        wsRef.current.close(1000, "Room changed");
        wsRef.current = null;
      }

      // Reset state for new room
      setConnectionState("disconnected");
      messageQueueRef.current = [];
      reconnectAttemptsRef.current = 0;
      shouldReconnectRef.current = true;
      hasInitializedRef.current = false;
      clearReconnectTimeout();

      // Update current room reference
      currentRoomRef.current = roomId;
    }
  }, [roomId, userId, clearReconnectTimeout]);

  // Initialize connection on mount
  useEffect(() => {
    if (autoConnect && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      shouldReconnectRef.current = true;
      currentRoomRef.current = roomId;
      connect();
    }

    // Cleanup on unmount
    return () => {
      const connectionKey = `${roomId}:${userId}`;
      activeConnections.delete(connectionKey);
      hasInitializedRef.current = false;
      isManualDisconnectRef.current = true;
      shouldReconnectRef.current = false;
      clearReconnectTimeout();

      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (connectionState === "disconnected" || connectionState === "error") {
        reconnectAttemptsRef.current = 0;
        shouldReconnectRef.current = true;
        connect();
      }
    };

    const handleOffline = () => {
      setError("CONNECTION_FAILED");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [connectionState, connect]);

  return {
    connectionState,
    isConnected: connectionState === "connected",
    connect,
    disconnect,
    sendMessage,
    reconnect,
    error,
  };
}
