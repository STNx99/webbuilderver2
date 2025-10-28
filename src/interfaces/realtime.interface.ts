import { EditorElement } from "@/types/global.type";

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export type WebSocketMessage =
  | { type: "sync"; elements: EditorElement[] }
  | { type: "update"; elements: EditorElement[] }
  | { type: "error"; error: string }
  | { type: "mouseMove"; userId: string; x: number; y: number }
  | {
      type: "currentState";
      mousePositions: Record<string, { X: number; Y: number }>;
      selectedElements: Record<string, string>;
    }
  | { type: "userDisconnect"; userId: string };

export type WebSocketError =
  | "CONNECTION_FAILED"
  | "SERVER_UNAVAILABLE"
  | "INVALID_MESSAGE"
  | "PARSE_ERROR"
  | "UNKNOWN_ERROR"
  | "AUTH_ERROR";

export interface UseWebSocketOptions {
  url: string;
  roomId: string;
  userId: string;
  getToken?: () => Promise<string | null>;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (data: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: WebSocketErrorEvent) => void;
}

export type SendMessagePayload =
  | { type: "update"; elements: EditorElement[] }
  | { type: "sync"; elements: EditorElement[] }
  | { type: "auth"; token: string }
  | { type: "mouseMove"; userId: string; x: number; y: number };

export interface WebSocketErrorEvent extends Event {
  code?: number;
  reason?: string;
  wasClean?: boolean;
}

export interface UseWebSocketReturn {
  connectionState: ConnectionState;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: SendMessagePayload) => boolean;
  reconnect: () => void;
  error: WebSocketError | null;
}

// Type Guards
export function isSyncMessage(
  message: WebSocketMessage,
): message is { type: "sync"; elements: EditorElement[] } {
  return message.type === "sync";
}

export function isUpdateMessage(
  message: WebSocketMessage,
): message is { type: "update"; elements: EditorElement[] } {
  return message.type === "update";
}

export function isErrorMessage(
  message: WebSocketMessage,
): message is { type: "error"; error: string } {
  return message.type === "error";
}

export function isMouseMoveMessage(
  message: WebSocketMessage,
): message is { type: "mouseMove"; userId: string; x: number; y: number } {
  return message.type === "mouseMove";
}

export function isCurrentStateMessage(message: WebSocketMessage): message is {
  type: "currentState";
  mousePositions: Record<string, { X: number; Y: number }>;
  selectedElements: Record<string, string>;
} {
  return message.type === "currentState";
}

export function isUserDisconnectMessage(
  message: WebSocketMessage,
): message is { type: "userDisconnect"; userId: string } {
  return message.type === "userDisconnect";
}

// Utility Types
export type WebSocketMessageType = WebSocketMessage["type"];
export type SyncMessage = Extract<WebSocketMessage, { type: "sync" }>;
export type UpdateMessage = Extract<WebSocketMessage, { type: "update" }>;
export type ErrorMessage = Extract<WebSocketMessage, { type: "error" }>;

export type MouseMoveMessage = Extract<WebSocketMessage, { type: "mouseMove" }>;
export type CurrentStateMessage = Extract<
  WebSocketMessage,
  { type: "currentState" }
>;
export type UserDisconnectMessage = Extract<
  WebSocketMessage,
  { type: "userDisconnect" }
>;
