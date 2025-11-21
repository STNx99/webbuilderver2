import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import {
  WebSocketMessage,
  SendMessagePayload,
} from "@/interfaces/realtime.interface";
import { EditorElement } from "@/types/global.type";

export interface YjsProviderOptions {
  url: string;
  roomId: string;
  userId: string;
  projectId?: string;
  getToken?: () => Promise<string | null>;
  doc: Y.Doc;
  onSyncUsers?: (users: Record<string, any>) => void;
}

/**
 * Custom Yjs provider for online-only operation via WebSocket.
 * Handles real-time collaboration with mouse tracking and element selection sync.
 */
export class CustomYjsProvider {
  public doc: Y.Doc;
  public awareness: any;
  public ws: WebSocket | null = null;
  public connected = false;
  public synched = false;

  private url: string;
  private roomId: string;
  private userId: string;
  private projectId?: string;
  private getToken?: () => Promise<string | null>;
  private messageQueue: SendMessagePayload[] = [];
  private onSyncUsers?: (users: Record<string, any>) => void;

  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectInterval = 3000;

  private statusListeners: Set<(status: string) => void> = new Set();
  private syncedListeners: Set<(synced: boolean) => void> = new Set();

  private docUpdateHandler: ((update: Uint8Array, origin: any) => void) | null =
    null;
  private awarenessChangeHandler: ((changes: any) => void) | null = null;

  private tokenRefreshInterval: NodeJS.Timeout | null = null;
  private lastTokenRefreshTime = 0;
  private tokenRefreshIntervalMs = 4 * 60 * 1000;

  private initialSyncReceived = false;
  private isDestroying = false;
  private syncTimeoutId: NodeJS.Timeout | null = null;

  constructor({
    url,
    roomId,
    userId,
    projectId,
    getToken,
    doc,
    onSyncUsers,
  }: YjsProviderOptions) {
    this.url = url;
    this.roomId = roomId;
    this.userId = userId;
    this.projectId = projectId;
    this.getToken = getToken;
    this.doc = doc;
    this.onSyncUsers = onSyncUsers;

    // Get or create awareness instance
    this.awareness = (doc as any).awareness;
    if (!this.awareness) {
      console.log("[YjsProvider] Creating new Awareness instance");
      this.awareness = new Awareness(doc);
      (doc as any).awareness = this.awareness;
    }

    this.docUpdateHandler = this.handleDocUpdate.bind(this);
    this.awarenessChangeHandler = this.handleAwarenessChange.bind(this);

    this.doc.on("update", this.docUpdateHandler);

    if (this.awareness) {
      try {
        this.awareness.setLocalState({
          user: { name: userId, color: this.getUserColor(userId) },
          cursor: { x: 0, y: 0 },
          selectedElement: null,
          remoteUsers: {},
          selectedByUser: {},
          users: {},
        });
      } catch (err) {
        console.warn(
          "[YjsProvider] Failed to initialize awareness state:",
          err,
        );
      }
      this.awareness.on("change", this.awarenessChangeHandler);
    }

    this.connect();
  }

  private async connect() {
    if (this.isDestroying || this.connected) return;

    try {
      if (!this.roomId || this.roomId === "undefined" || this.roomId === "") {
        console.error("[YjsProvider] Invalid roomId for WebSocket connection.");
        this.emitStatus("error");
        return;
      }

      const token = await this.getToken?.();
      if (!token) {
        console.error(
          "[YjsProvider] No token available for WebSocket connection",
        );
        this.emitStatus("error");
        this.scheduleReconnect(3000);
        return;
      }

      const wsUrl = `${this.url}/ws/${this.roomId}?token=${encodeURIComponent(token)}${
        this.projectId ? `&projectId=${encodeURIComponent(this.projectId)}` : ""
      }`;

      console.log("[YjsProvider] Attempting connection to:", this.url);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        if (this.isDestroying) {
          this.ws?.close();
          return;
        }

        console.log("[YjsProvider] ✅ WebSocket opened.");
        this.connected = true;
        this.lastTokenRefreshTime = Date.now();
        this.initialSyncReceived = false;
        this.emitStatus("connected");

        if (this.syncTimeoutId) clearTimeout(this.syncTimeoutId);
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

        this.syncTimeoutId = setTimeout(() => {
          if (!this.initialSyncReceived && !this.isDestroying) {
            console.warn(
              "[YjsProvider] ⚠️ Initial sync timeout. Server did not respond with data.",
            );
            this.initialSyncReceived = true;
            this.synched = true;
            this.emitSynced(true);
          }
        }, 2000);

        this.setupTokenRefresh();

        // Request initial sync from server
        console.log("[YjsProvider] Requesting initial sync from server...");
        this.send({ type: "sync", elements: [] });

        // Send queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (message) this.send(message);
        }

        console.log(
          "[YjsProvider] ✅ WebSocket connection established successfully",
        );
      };

      this.ws.onmessage = (event) => {
        if (this.isDestroying) return;
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          this.handleMessage(data);
        } catch (err) {
          console.error("[YjsProvider] Failed to parse message:", err);
        }
      };

      this.ws.onclose = (event: CloseEvent) => {
        if (this.isDestroying) return;

        console.warn(
          `[YjsProvider] WebSocket closed (Code: ${event.code}, Clean: ${event.wasClean}).`,
        );

        this.connected = false;
        this.synched = false;
        this.emitStatus("disconnected");

        if (this.syncTimeoutId) clearTimeout(this.syncTimeoutId);
        if (this.tokenRefreshInterval) clearInterval(this.tokenRefreshInterval);

        this.scheduleReconnect(this.reconnectInterval);
      };

      this.ws.onerror = (error) => {
        if (this.isDestroying) return;

        const errorMsg =
          error instanceof Event ? "WebSocket connection error" : String(error);
        console.error("[YjsProvider] ❌ WebSocket error:", errorMsg);
        this.emitStatus("error");

        if (this.tokenRefreshInterval) clearInterval(this.tokenRefreshInterval);
      };
    } catch (err) {
      if (this.isDestroying) return;
      console.error("[YjsProvider] Connection attempt failed:", err);
      this.scheduleReconnect(this.reconnectInterval);
    }
  }

  private setupTokenRefresh() {
    if (this.tokenRefreshInterval) clearInterval(this.tokenRefreshInterval);

    this.tokenRefreshInterval = setInterval(() => {
      if (this.isDestroying || !this.connected) return;

      const timeSinceLastRefresh = Date.now() - this.lastTokenRefreshTime;
      if (timeSinceLastRefresh > this.tokenRefreshIntervalMs) {
        console.log("[YjsProvider] Token refresh needed, reconnecting...");
        this.disconnect(true);
        this.connect();
      }
    }, 25000);
  }

  private scheduleReconnect(delay: number) {
    if (this.isDestroying) return;

    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    console.log(`[YjsProvider] Scheduling reconnect in ${delay}ms`);

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isDestroying) {
        console.log(`[YjsProvider] Attempting reconnect...`);
        this.connect();
      }
    }, delay);
  }

  private handleMessage(message: WebSocketMessage) {
    console.log("[YjsProvider] Received message type:", message.type);

    if (message.type === "sync") {
      this.handleSyncMessage(message);
    } else if (message.type === "update") {
      this.handleUpdateMessage(message);
    } else if (message.type === "currentState") {
      console.log(JSON.stringify(message));
      this.handleCurrentStateMessage(message);
    } else if (message.type === "mouseMove") {
      this.handleMouseMoveMessage(message);
    }  else if (message.type === "userDisconnect") {
      this.handleUserDisconnectMessage(message);
    } else if (message.type === "error") {
      console.error(
        "[YjsProvider] ❌ Server error message:",
        (message as any).error,
      );
      this.emitStatus("error");
    } else {
      console.warn(
        "[YjsProvider] Unknown message type:",
        (message as any).type,
      );
    }
  }

  private handleSyncMessage(message: WebSocketMessage) {
    const syncMessage = message as any;
    console.log(
      "[YjsProvider] ✅ Received SYNC message with",
      syncMessage.elements?.length || 0,
      "elements",
    );

    // Only process the first sync message
    if (this.initialSyncReceived) {
      console.log(
        "[YjsProvider] ℹ️ Ignoring additional sync message (already synced)",
      );
      return;
    }

    if (this.syncTimeoutId) {
      clearTimeout(this.syncTimeoutId);
      this.syncTimeoutId = null;
    }

    if (
      "elements" in syncMessage &&
      syncMessage.elements &&
      syncMessage.elements.length > 0
    ) {
      try {
        console.log(
          "[YjsProvider] Applying",
          syncMessage.elements.length,
          "elements from sync",
        );
        Y.transact(
          this.doc,
          () => {
            const yElementsText = this.doc.getText("elementsJson");
            yElementsText.delete(0, yElementsText.length);
            yElementsText.insert(0, JSON.stringify(syncMessage.elements));
          },
          "sync",
        );
        console.log(
          "[YjsProvider] Successfully applied sync elements to Yjs document",
        );
      } catch (err) {
        console.error("[YjsProvider] Error applying sync elements:", err);
      }
    } else {
      console.warn("[YjsProvider] ⚠️ Sync message has no elements or empty");
    }

    this.initialSyncReceived = true;
    this.synched = true;
    this.emitSynced(true);
    console.log(
      "[YjsProvider] ✅ Initial sync completed and synced=true emitted",
    );
  }

  private handleUpdateMessage(message: WebSocketMessage) {
    console.log("[YjsProvider] 📥 Processing update from other client");

    if ("elements" in message && message.elements) {
      try {
        Y.transact(
          this.doc,
          () => {
            const yElementsText = this.doc.getText("elementsJson");
            yElementsText.delete(0, yElementsText.length);
            yElementsText.insert(0, JSON.stringify(message.elements));
          },
          "remote-update",
        );
        console.log(
          "[YjsProvider] ✅ Applied remote update with",
          message.elements.length,
          "elements",
        );
      } catch (err) {
        console.error("[YjsProvider] Error applying update elements:", err);
      }
    }
  }

  private handleCurrentStateMessage(message: WebSocketMessage) {
    console.log("[YjsProvider] 📡 Processing currentState message from server");

    if (!this.awareness) {
      console.warn(
        "[YjsProvider] ⚠️ Awareness not available, cannot update currentState"
      );
      console.warn(
        "[YjsProvider] Attempting to create awareness and sync users directly"
      );

      // Try to sync users directly even if awareness isn't available
      if (this.onSyncUsers && "users" in message && message.users) {
        console.log(
          "[YjsProvider] Syncing users via callback:",
          Object.keys(message.users).length,
          "users"
        );
        this.onSyncUsers(message.users);
      }
      return;
    }

    try {
      if (!this.awareness.getLocalState()) {
        this.awareness.setLocalState({
          user: { name: this.userId, color: this.getUserColor(this.userId) },
          cursor: { x: 0, y: 0 },
          selectedElement: null,
          remoteUsers: {},
          selectedByUser: {},
          users: {},
        });
      }

      // Update mouse positions from current state
      if ("mousePositions" in message && message.mousePositions) {
        console.log(
          "[YjsProvider] Updating mouse positions:",
          Object.keys(message.mousePositions).length,
          "users",
        );
        const remoteUsers: any = {};
        Object.entries(message.mousePositions).forEach(
          ([userId, pos]: [string, any]) => {
            if (userId !== this.userId) {
              remoteUsers[userId] = {
                x: pos.X,
                y: pos.Y,
                cursor: { x: pos.X, y: pos.Y },
              };
            }
          },
        );
        if (Object.keys(remoteUsers).length > 0) {
          this.awareness.setLocalStateField("remoteUsers", remoteUsers);
        }
      }

      // Update selected elements
      if ("selectedElements" in message && message.selectedElements) {
        console.log(
          "[YjsProvider] Updating selected elements:",
          Object.keys(message.selectedElements).length,
          "users",
        );
        const selectedByUser: any = {};
        Object.entries(message.selectedElements).forEach(
          ([userId, elementId]: [string, any]) => {
            if (userId !== this.userId) {
              selectedByUser[userId] = elementId;
            }
          },
        );
        if (Object.keys(selectedByUser).length > 0) {
          this.awareness.setLocalStateField("selectedByUser", selectedByUser);
        }
      }

      // Update users info
      if ("users" in message && message.users) {
        console.log(
          "[YjsProvider] Updating users info:",
          Object.keys(message.users).length,
          "users",
        );
        this.awareness.setLocalStateField("users", message.users);

        // Explicitly sync to mousestore after updating users
        // This is critical for ensuring the UI sees the updated users list
        if (this.onSyncUsers) {
          this.onSyncUsers(message.users);
        }
      }
    } catch (err) {
      console.error("[YjsProvider] Error updating currentState:", err);
    }
  }

  private handleMouseMoveMessage(message: WebSocketMessage) {
    console.log(
      "[YjsProvider] 🖱️ Processing mouseMove message from",
      (message as any).userId?.slice(0, 8),
    );

    if (!this.awareness) {
      console.warn(
        "[YjsProvider] ⚠️ Awareness not available, cannot update mouse position",
      );
      return;
    }

    try {
      const userId = (message as any).userId;
      const x = (message as any).x;
      const y = (message as any).y;

      if (
        userId &&
        userId !== this.userId &&
        typeof x === "number" &&
        typeof y === "number"
      ) {
        const currentState = this.awareness.getLocalState() || {};
        const remoteUsers = currentState.remoteUsers || {};

        remoteUsers[userId] = {
          x,
          y,
          cursor: { x, y },
        };

        this.awareness.setLocalStateField("remoteUsers", remoteUsers);
        console.log(
          "[YjsProvider] Updated remote user cursor:",
          userId.slice(0, 8),
          { x, y },
        );
      }
    } catch (err) {
      console.error("[YjsProvider] Error handling mouseMove message:", err);
    }
  }

  private handleElementSelectedMessage(message: WebSocketMessage) {
    console.log(
      "[YjsProvider] 📌 Processing elementSelected message from",
      (message as any).userId?.slice(0, 8),
    );

    if (!this.awareness) {
      console.warn(
        "[YjsProvider] ⚠️ Awareness not available, cannot update selection",
      );
      return;
    }

    try {
      const userId = (message as any).userId;
      const elementId = (message as any).elementId;

      if (userId && userId !== this.userId && elementId) {
        const currentState = this.awareness.getLocalState() || {};
        const selectedByUser = currentState.selectedByUser || {};

        selectedByUser[userId] = elementId;

        this.awareness.setLocalStateField("selectedByUser", selectedByUser);
        console.log(
          "[YjsProvider] Updated selected element for user:",
          userId.slice(0, 8),
          "element:",
          elementId.slice(0, 8),
        );
      }
    } catch (err) {
      console.error(
        "[YjsProvider] Error handling elementSelected message:",
        err,
      );
    }
  }

  private handleUserDisconnectMessage(message: WebSocketMessage) {
    console.log(
      "[YjsProvider] 👋 Processing userDisconnect message for",
      (message as any).userId?.slice(0, 8),
    );

    if (!this.awareness) {
      console.warn(
        "[YjsProvider] ⚠️ Awareness not available, cannot handle disconnect",
      );
      return;
    }

    try {
      const userId = (message as any).userId;

      if (userId && userId !== this.userId) {
        const currentState = this.awareness.getLocalState() || {};
        const remoteUsers = currentState.remoteUsers || {};
        const selectedByUser = currentState.selectedByUser || {};

        // Remove user's cursor position
        delete remoteUsers[userId];

        // Remove user's selection
        delete selectedByUser[userId];

        this.awareness.setLocalStateField("remoteUsers", remoteUsers);
        this.awareness.setLocalStateField("selectedByUser", selectedByUser);

        console.log(
          "[YjsProvider] Removed user from remote state:",
          userId.slice(0, 8),
        );
      }
    } catch (err) {
      console.error(
        "[YjsProvider] Error handling userDisconnect message:",
        err,
      );
    }
  }

  private handleDocUpdate(update: Uint8Array, origin: any) {
    // Skip updates that originated from remote sources (server sync/updates)
    if (origin === this || origin === "sync" || origin === "remote-update") {
      console.log(
        "[YjsProvider] Skipping update - originated from remote source:",
        origin === this ? "this provider" : origin,
      );
      return;
    }

    if (!this.synched) {
      console.warn(
        "[YjsProvider] ⚠️ Ignoring local update - waiting for initial sync from server",
      );
      return;
    }

    try {
      const yElementsText = this.doc.getText("elementsJson");
      const elementsJson = yElementsText.toString();
      const elements: EditorElement[] = elementsJson
        ? JSON.parse(elementsJson)
        : [];

      if (!elements || elements.length === 0) {
        console.log(
          "[YjsProvider] ⚠️ Skipping update with empty elements (length=0)",
        );
        return;
      }

      console.log(
        "[YjsProvider] 📤 Sending update with",
        elements.length,
        "elements to server (origin:",
        origin || "unknown",
        ")",
      );
      this.send({ type: "update", elements: elements });
    } catch (err) {
      console.error("[YjsProvider] Error sending doc update:", err);
    }
  }

  private handleAwarenessChange({ added, updated, removed }: any) {
    if (!this.awareness || this.isDestroying) return;

    try {
      const localState = this.awareness.getLocalState();
      if (!localState) return;

      if (localState.cursor) {
        console.log("[YjsProvider] Sending mouse position update");
        this.send({
          type: "mouseMove",
          userId: this.userId,
          x: localState.cursor.x,
          y: localState.cursor.y,
        });
      }

      
    } catch (err) {
      console.error("[YjsProvider] Error handling awareness change:", err);
    }
  }

  public send(message: SendMessagePayload) {
    if (this.isDestroying) return;

    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (err) {
        console.error("[YjsProvider] Error sending message:", err);
        this.messageQueue.push(message);
      }
    } else {
      this.messageQueue.push(message);
    }
  }

  public sendUpdate(elements: EditorElement[]) {
    if (!this.synched) {
      console.warn("[YjsProvider] Cannot send update - not synched yet");
      return;
    }

    if (!elements || elements.length === 0) {
      console.warn("[YjsProvider] Cannot send update - empty elements");
      return;
    }

    console.log(
      "[YjsProvider] 📤 Explicitly sending element update with",
      elements.length,
      "elements",
    );
    this.send({ type: "update", elements: elements });
  }

  private getUserColor(userId: string): string {
    const hue =
      userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }

  private emitStatus(status: string) {
    this.statusListeners.forEach((listener) => listener(status));
  }

  private emitSynced(synced: boolean) {
    this.syncedListeners.forEach((listener) => listener(synced));
  }

  public on(event: string, listener: (data: any) => void) {
    if (event === "status") {
      this.statusListeners.add(listener);
      listener({ status: this.connected ? "connected" : "disconnected" });
    } else if (event === "synced") {
      this.syncedListeners.add(listener);
      listener(this.synched);
    }
  }

  public off(event: string, listener: (data: any) => void) {
    if (event === "status") {
      this.statusListeners.delete(listener);
    } else if (event === "synced") {
      this.syncedListeners.delete(listener);
    }
  }

  public disconnect(preserveListeners = false) {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.tokenRefreshInterval) clearInterval(this.tokenRefreshInterval);
    if (this.syncTimeoutId) clearTimeout(this.syncTimeoutId);

    if (this.ws) {
      console.log("[YjsProvider] Closing WebSocket connection");
      this.ws.close();
      this.ws = null;
    }

    this.connected = false;
    this.synched = false;
    this.initialSyncReceived = false;
    console.log("[YjsProvider] Disconnected");
  }

  public destroy() {
    this.isDestroying = true;
    this.disconnect();

    if (this.docUpdateHandler) this.doc.off("update", this.docUpdateHandler);
    if (this.awareness && this.awarenessChangeHandler) {
      try {
        this.awareness.off("change", this.awarenessChangeHandler);
      } catch (err) {
        console.error("[YjsProvider] Error removing awareness listener:", err);
      }
    }

    this.statusListeners.clear();
    this.syncedListeners.clear();
    console.log("[YjsProvider] Destroyed");
  }
}
