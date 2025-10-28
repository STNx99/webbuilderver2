"use client";

import { useEffect, useRef, useCallback, useState } from "react";
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

export function useWebSocket({
  url,
  roomId,
  userId,
  getToken,
  autoConnect = true,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
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

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Disconnect function
  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true;
    shouldReconnectRef.current = false;
    clearReconnectTimeout();

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setConnectionState("disconnected");
    messageQueueRef.current = [];
  }, [clearReconnectTimeout]);

  // Connect function
  const connect = useCallback(async () => {
    // Prevent multiple connections
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    if (!shouldReconnectRef.current) {
      return;
    }

    isManualDisconnectRef.current = false;
    setConnectionState("connecting");
    setError(null);

    // Get Clerk token
    const token = await getToken?.();
    if (!token) {
      setError("AUTH_ERROR");
      setConnectionState("error");
      return;
    }

    const wsUrl = `${url}/ws/${roomId}?token=${encodeURIComponent(token)}`;

    try {
      const ws = new WebSocket(wsUrl);

      // Connection opened
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
          // Only set parse error for actual JSON parsing failures
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
        wsRef.current = null;
        setConnectionState("disconnected");

        // Only attempt reconnection if:
        // 1. Not a manual disconnect
        // 2. Not exceeded max attempts
        // 3. Reconnection is enabled
        if (
          !isManualDisconnectRef.current &&
          shouldReconnectRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;

          clearReconnectTimeout();
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          shouldReconnectRef.current = false;
          setError("SERVER_UNAVAILABLE");
          clearReconnectTimeout();
        }

        callbacksRef.current.onDisconnect?.();
      };

      wsRef.current = ws;
    } catch (err) {
      setConnectionState("error");
      setError("CONNECTION_FAILED");
    }
  }, [
    url,
    roomId,
    getToken,
    reconnectInterval,
    maxReconnectAttempts,
    clearReconnectTimeout,
  ]);

  // Send message function
  const sendMessage = useCallback((message: SendMessagePayload): boolean => {
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
  }, []);

  // Reconnect function (resets attempt counter)
  const reconnect = useCallback(() => {
    disconnect();
    shouldReconnectRef.current = true;
    reconnectAttemptsRef.current = 0;
    setTimeout(() => connect(), 100);
  }, [connect, disconnect]);

  // Initialize connection on mount
  useEffect(() => {
    if (autoConnect && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      shouldReconnectRef.current = true;
      connect();
    }

    // Cleanup on unmount
    return () => {
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
