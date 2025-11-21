"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useElementStore, ElementStore } from "@/globalstore/elementstore";
import { useMouseStore } from "@/globalstore/mousestore";
import { EditorElement } from "@/types/global.type";
import * as Y from "yjs";
import { CustomYjsProvider } from "@/lib/yjs/yjs-provider";
import { IndexeddbPersistence } from "y-indexeddb";
import { debounce } from "lodash";
import type { DebouncedFunc } from "lodash";
import {
  safeValidateElementTree,
  validateContainerElementTree,
} from "@/lib/utils/element/containerElementValidator";
import { attachYjsDebugger } from "@/lib/yjs/yjs-debug-utils";

// Track document mouse moves for local cursor position
let documentMouseTrackingAttached = false;
let lastDocumentMousePosition = { x: 0, y: 0 };
let documentMouseMoveHandler: ((e: MouseEvent) => void) | null = null;

type RoomState = "idle" | "connecting" | "connected" | "error";

interface CollabState {
  roomState: RoomState;
  error: string | null;
  isSynced: boolean;
  pendingUpdates: number;
}

export interface UseYjsCollabOptions {
  roomId: string;
  projectId?: string;
  wsUrl?: string;
  enabled?: boolean;
  onSync?: () => void;
  onError?: (error: Error) => void;
  debounceMs?: number;
  throttleMs?: number;
  enableDebug?: boolean;
}

export interface UseYjsCollabReturn {
  isConnected: boolean;
  roomState: RoomState;
  error: string | null;
  isSynced: boolean;
  pendingUpdates: number;
  ydoc: Y.Doc | null;
  provider: CustomYjsProvider | null;
}

export function useYjsCollab({
  roomId,
  projectId,
  wsUrl = "ws://localhost:8082",
  enabled = true,
  onSync,
  onError,
  debounceMs = 300,
  throttleMs = 500,
  enableDebug = false,
}: UseYjsCollabOptions): UseYjsCollabReturn {
  const [state, setState] = useState<CollabState>({
    roomState: "idle",
    error: null,
    isSynced: false,
    pendingUpdates: 0,
  });

  const internalStateRef = useRef({
    isUpdatingFromRemote: false,
    isUpdatingFromElementStore: false,
    lastLocalHash: "",
    lastSentHash: "",
    lastSendTime: 0,
    updateCount: 0,
    remoteUpdateTimeout: null as NodeJS.Timeout | null,
  });

  const { userId, getToken, isLoaded } = useAuth();
  const { elements, loadElements } = useElementStore();

  // We access the store here, but we will NOT add it to the connection useEffect dependency array
  const mouseStore = useMouseStore();
  const { syncFromAwareness } = useMouseStore();

  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<CustomYjsProvider | null>(null);
  const persistenceRef = useRef<IndexeddbPersistence | null>(null);

  // Utility functions
  const sanitizeElements = (elements: EditorElement[]): EditorElement[] => {
    const sanitize = (el: EditorElement): EditorElement => {
      const sanitized = { ...el };
      if (sanitized.settings === null || sanitized.settings === undefined) {
        (sanitized as any).settings = {};
      }
      if (sanitized.styles === null || sanitized.styles === undefined) {
        (sanitized as any).styles = {};
      }
      if (Array.isArray((sanitized as any).elements)) {
        (sanitized as any).elements = (sanitized as any).elements.map(sanitize);
      }
      return sanitized;
    };
    return elements.map(sanitize);
  };

  const computeHash = (elements: EditorElement[]): string => {
    try {
      return JSON.stringify(elements);
    } catch {
      return "[]";
    }
  };

  const clearRemoteTimeout = () => {
    if (internalStateRef.current.remoteUpdateTimeout) {
      clearTimeout(internalStateRef.current.remoteUpdateTimeout);
      internalStateRef.current.remoteUpdateTimeout = null;
    }
  };

  // Handler: Process sync message
  const handleSync = useCallback(
    (elements: EditorElement[]) => {
      console.log(
        "[useYjsCollab] handleSync received",
        elements.length,
        "elements",
      );

      internalStateRef.current.isUpdatingFromRemote = true;
      clearRemoteTimeout();

      internalStateRef.current.remoteUpdateTimeout = setTimeout(() => {
        internalStateRef.current.isUpdatingFromRemote = false;
      }, 2000);

      const sanitizedElements = sanitizeElements(elements);

      const validationResult = safeValidateElementTree(sanitizedElements);
      if (!validationResult.success) {
        console.error(
          "[useYjsCollab] Failed to validate elements during sync:",
          validationResult.error,
        );
        return;
      }

      const normalizedElements = validationResult.data || sanitizedElements;
      const validation = validateContainerElementTree(normalizedElements);
      if (!validation.valid) {
        console.warn(
          "[useYjsCollab] Container validation issues:",
          validation.issues,
        );
      }

      const hash = computeHash(normalizedElements);
      internalStateRef.current.lastLocalHash = hash;
      internalStateRef.current.lastSentHash = hash;

      console.log(
        "[useYjsCollab] handleSync: loading",
        normalizedElements.length,
        "sanitized elements",
      );
      loadElements(normalizedElements, true);

      setTimeout(() => {
        internalStateRef.current.isUpdatingFromRemote = false;
        clearRemoteTimeout();

        setState((prev) => ({
          ...prev,
          isSynced: true,
        }));

        onSync?.();
      }, 100);
    },
    [loadElements, onSync],
  );

  // Handler: Process update message
  const handleUpdate = useCallback(
    (elements: EditorElement[]) => {
      console.log(
        "[useYjsCollab] handleUpdate received",
        elements.length,
        "elements",
      );

      if (internalStateRef.current.isUpdatingFromRemote) {
        return;
      }

      // Sanitize elements to convert null settings/styles to empty objects
      const sanitizedElements = sanitizeElements(elements);

      const validationResult = safeValidateElementTree(sanitizedElements);
      if (!validationResult.success) {
        console.error(
          "[useYjsCollab] Failed to validate elements during update:",
          validationResult.error,
        );
        return;
      }

      const normalizedElements = validationResult.data || sanitizedElements;
      const validation = validateContainerElementTree(normalizedElements);
      if (!validation.valid) {
        console.warn(
          "[useYjsCollab] Container validation issues:",
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
        console.log(
          "[useYjsCollab] handleUpdate: loading",
          normalizedElements.length,
          "sanitized elements",
        );
        loadElements(normalizedElements, true);

        setTimeout(() => {
          internalStateRef.current.isUpdatingFromRemote = false;
          clearRemoteTimeout();
        }, 100);
      }
    },
    [loadElements],
  );

  // ---------------------------------------------------------------------------
  // REF PATTERN FIX:
  // Keep a reference to the latest versions of callbacks and stores.
  // This allows the connection effect to use them without needing them as dependencies.
  // ---------------------------------------------------------------------------
  const latestHandlers = useRef({
    handleSync,
    handleUpdate,
    mouseStore,
    syncFromAwareness,
    onSync,
    getToken,
  });

  useEffect(() => {
    latestHandlers.current = {
      handleSync,
      handleUpdate,
      mouseStore,
      syncFromAwareness,
      onSync,
      getToken,
    };
  }, [
    handleSync,
    handleUpdate,
    mouseStore,
    syncFromAwareness,
    onSync,
    getToken,
  ]);

  // ---------------------------------------------------------------------------
  // CONNECTION EFFECT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!enabled || !isLoaded || !userId) {
      return;
    }

    if (!roomId || roomId === "undefined" || roomId === "") {
      console.error("[useYjsCollab] Invalid roomId:", roomId);
      setState((p) => ({ ...p, roomState: "error", error: "Invalid room ID" }));
      return;
    }

    console.log("[useYjsCollab] Initializing for room:", roomId);

    // 2. Create Y.Doc
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // 3. Set up IndexedDB persistence
    const persistence = new IndexeddbPersistence(roomId, ydoc);
    persistenceRef.current = persistence;

    persistence.whenSynced.then(() => {
      console.log("[useYjsCollab] IndexedDB synced");
    });

    // 4. Create Provider
    const provider = new CustomYjsProvider({
      url: wsUrl,
      roomId,
      userId,
      projectId,
      // Use the Ref to get the token so we don't need 'getToken' in deps
      getToken: () => latestHandlers.current.getToken(),
      doc: ydoc,
      onSyncUsers: (users) => {
        console.log(
          "[useYjsCollab] Provider syncing users:",
          Object.keys(users).length,
          "users",
        );
        // Sync users directly to store immediately
        mouseStore.setUsers(users);
      },
    });
    providerRef.current = provider;

    // 4b. Attach debugger if enabled
    if (enableDebug) {
      console.log("[useYjsCollab] 🔍 Debug mode enabled");
      attachYjsDebugger(ydoc, provider, "yjsDebug");
    }

    // 5. Listeners
    provider.on("status", ({ status }) => {
      console.log("[useYjsCollab] Provider status:", status);
      setState((p) => ({
        ...p,
        roomState:
          status === "connected"
            ? "connected"
            : status === "error"
              ? "error"
              : "connecting",
        error: status === "error" ? "Connection failed" : null,
      }));
    });

    provider.on("synced", (synced) => {
      console.log("[useYjsCollab] Provider synced:", synced);
      if (synced) {
        setState((p) => ({ ...p, isSynced: synced }));
        // Use Ref
        latestHandlers.current.onSync?.();
      }
    });

    // 6. Data Observers
    const yElementsText = ydoc.getText("elementsJson");
    const yMousePositions = ydoc.getMap("mousePositions");
    const ySelections = ydoc.getMap("selections");

    const elementsObserver = () => {
      try {
        // Skip observer if we just updated from ElementStore
        // The callback already handles sending the update
        if (internalStateRef.current.isUpdatingFromElementStore) {
          console.log(
            "[useYjsCollab] Skipping observer - update came from ElementStore",
          );
          return;
        }

        const elementsJson = yElementsText.toString();
        const parsed = elementsJson ? JSON.parse(elementsJson) : [];

        if (internalStateRef.current.isUpdatingFromRemote) {
          // Use Ref
          latestHandlers.current.handleUpdate(parsed);
        } else {
          // Use Ref
          latestHandlers.current.handleSync(parsed);
        }
      } catch (err) {
        console.warn("[useYjsCollab] Elements parse failed:", err);
      }
    };

    const mouseObserver = () => {
      const positions = yMousePositions.toJSON();
      const converted: Record<string, { x: number; y: number }> = {};
      Object.entries(positions).forEach(([uid, pos]: [string, any]) => {
        converted[uid] = { x: pos.x || pos.X, y: pos.y || pos.Y };
      });
      // Use Ref
      latestHandlers.current.mouseStore.setMousePositions(converted);
    };

    const selectionsObserver = () => {
      const selections = ySelections.toJSON();
      // Use Ref
      latestHandlers.current.mouseStore.setSelectedElements(selections);
    };

    // 6b. Awareness change observer - sync ALL remote awareness states to mousestore
    const syncAwarenessToStore = () => {
      if (!provider.awareness) return;

      try {
        // Get all awareness states (local + remote)
        const allStates = provider.awareness.getStates();
        if (!allStates) return;

        // Aggregate remote users (everyone except ourselves)
        const remoteUsers: Record<string, any> = {};
        const selectedByUser: Record<string, any> = {};
        let users: Record<string, any> = {};

        const localClientId = provider.awareness?.clientID?.toString();
        let usersMapFound = false;

        allStates.forEach((state: any, clientId: any) => {
          if (!state) return;

          const clientIdStr = clientId.toString();

          // Get the users map from OUR local state (set by currentState message)
          // This is a map of ALL online users, not per-client
          if (clientIdStr === localClientId) {
            if (
              state.users &&
              typeof state.users === "object" &&
              Object.keys(state.users).length > 0
            ) {
              users = { ...state.users };
              usersMapFound = true;
              console.log(
                "[useYjsCollab] Got users map from local state:",
                Object.keys(users).length,
                "users",
                "clientId:",
                clientIdStr,
              );
            }
            // Extract remoteUsers from local state (populated by handleMouseMoveMessage)
            if (state.remoteUsers && typeof state.remoteUsers === "object") {
              Object.assign(remoteUsers, state.remoteUsers);
              console.log(
                "[useYjsCollab] Got remoteUsers from local state:",
                Object.keys(state.remoteUsers).length,
                "remote users",
                "data:",
                JSON.stringify(state.remoteUsers, null, 2),
              );
            }
            // Extract selectedByUser from local state
            if (
              state.selectedByUser &&
              typeof state.selectedByUser === "object"
            ) {
              Object.assign(selectedByUser, state.selectedByUser);
              console.log(
                "[useYjsCollab] Got selectedByUser from local state:",
                Object.keys(state.selectedByUser).length,
                "selections",
              );
            }
            // Skip processing local user's cursor for remoteUsers (don't include self)
            return; // Skip rest of local state processing
          }

          // Collect remote user cursors
          if (state.cursor && typeof state.cursor === "object") {
            remoteUsers[clientIdStr] = {
              x: state.cursor.x || 0,
              y: state.cursor.y || 0,
              cursor: { x: state.cursor.x || 0, y: state.cursor.y || 0 },
            };
          }

          // Collect selected elements by user
          if (state.selectedElement) {
            selectedByUser[clientIdStr] = state.selectedElement;
          }

          // Collect user info (individual user's own info) - only if we haven't found the users map
          if (!usersMapFound && state.user && typeof state.user === "object") {
            users[clientIdStr] = state.user;
          }
        });

        console.log(
          "[useYjsCollab] Awareness sync: found",
          Object.keys(remoteUsers).length,
          "remote users with cursors,",
          Object.keys(users).length,
          "total users",
          "usersMapFound:",
          usersMapFound,
        );

        // Sync all aggregated state to mousestore
        console.log(
          "[useYjsCollab] Setting remoteUsers to store:",
          JSON.stringify(remoteUsers, null, 2),
        );
        latestHandlers.current.mouseStore.setRemoteUsers(remoteUsers);
        latestHandlers.current.mouseStore.setSelectedByUser(selectedByUser);
        latestHandlers.current.mouseStore.setUsers(users);
      } catch (err) {
        console.error("[useYjsCollab] Error syncing awareness to store:", err);
      }
    };

    const awarenessChangeObserver = ({ added, updated, removed }: any) => {
      // Call sync function when awareness changes
      syncAwarenessToStore();
    };

    // Attach observers
    yElementsText.observe(elementsObserver);
    yMousePositions.observe(mouseObserver);
    ySelections.observe(selectionsObserver);

    // Attach awareness observer for remote user tracking
    if (provider.awareness) {
      provider.awareness.on("change", awarenessChangeObserver);

      // Also trigger initial awareness state sync
      console.log("[useYjsCollab] Triggering initial awareness state check");
      syncAwarenessToStore();

      // Set up continuous polling for smooth mouse movement tracking
      // This ensures mouse updates are synced on every awareness update
      let pollCount = 0;
      const awarenessPollingInterval = setInterval(() => {
        if (!provider || !provider.awareness) {
          clearInterval(awarenessPollingInterval);
          return;
        }
        pollCount++;
        if (pollCount % 20 === 0) {
          // Log every 1 second (20 polls * 50ms)
          const allStates = provider.awareness.getStates();
          console.log(
            "[useYjsCollab] Polling awareness - total states:",
            allStates?.size,
          );
          allStates?.forEach((state: any, clientId: any) => {
            if (state && state.cursor) {
              console.log(
                "[useYjsCollab] Client",
                clientId.toString().slice(0, 8),
                "cursor:",
                state.cursor,
              );
            }
          });
        }
        syncAwarenessToStore();
      }, 50); // Poll every 50ms for smooth cursor tracking

      // Store interval ID for cleanup
      internalStateRef.current.remoteUpdateTimeout =
        awarenessPollingInterval as any;
      console.log("[useYjsCollab] Started awareness polling interval");
    }

    // 6c. Track document-level mouse moves to update local cursor awareness
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (!provider.awareness) return;

      const x = e.clientX;
      const y = e.clientY;

      // Only send if position changed significantly (> 5px)
      if (
        lastDocumentMousePosition.x !== 0 &&
        Math.abs(lastDocumentMousePosition.x - x) < 5 &&
        Math.abs(lastDocumentMousePosition.y - y) < 5
      ) {
        return;
      }

      lastDocumentMousePosition = { x, y };

      try {
        provider.awareness.setLocalStateField("cursor", { x, y });
      } catch (err) {
        console.warn("[useYjsCollab] Error updating awareness cursor:", err);
      }
    };

    if (!documentMouseTrackingAttached) {
      console.log("[useYjsCollab] Attaching document-level mouse tracking");
      document.addEventListener("mousemove", handleDocumentMouseMove, {
        passive: true,
      });
      documentMouseTrackingAttached = true;
      documentMouseMoveHandler = handleDocumentMouseMove;
    }

    // 7. Connect ElementStore to Yjs - THIS IS THE CRITICAL FIX
    // When elements change in the store (via user actions), update Yjs doc AND notify provider
    console.log("[useYjsCollab] Setting up ElementStore -> Yjs callback");
    ElementStore.getState().setYjsUpdateCallback(
      (elements: EditorElement[]) => {
        if (!provider.synched) {
          console.log(
            "[useYjsCollab] Skipping element update - not synced yet",
          );
          return;
        }

        if (internalStateRef.current.isUpdatingFromRemote) {
          console.log(
            "[useYjsCollab] Skipping element update - remote update in progress",
          );
          return;
        }

        if (!elements || elements.length === 0) {
          console.log(
            "[useYjsCollab] Skipping element update - empty elements",
          );
          return;
        }

        console.log(
          "[useYjsCollab] ElementStore callback: updating Yjs doc with",
          elements.length,
          "elements",
        );

        try {
          // Mark that we're updating from ElementStore to prevent observer re-triggering
          internalStateRef.current.isUpdatingFromElementStore = true;

          Y.transact(
            ydoc,
            () => {
              const yElementsText = ydoc.getText("elementsJson");
              yElementsText.delete(0, yElementsText.length);
              yElementsText.insert(0, JSON.stringify(elements));
            },
            "elementStore",
          );

          console.log(
            "[useYjsCollab] Y.Doc updated, now explicitly sending update to provider",
          );

          // After updating Y.Doc, explicitly notify the provider to send the update
          // This ensures the update reaches the server even if the Y.Doc observer
          // encounters any race conditions or timing issues
          provider.sendUpdate(elements);

          // Clear flag after a short delay to allow observer to run if needed
          setTimeout(() => {
            internalStateRef.current.isUpdatingFromElementStore = false;
          }, 50);
        } catch (err) {
          console.error(
            "[useYjsCollab] Error updating Yjs doc from ElementStore:",
            err,
          );
          internalStateRef.current.isUpdatingFromElementStore = false;
        }
      },
    );

    // 8. Cleanup
    return () => {
      console.log("[useYjsCollab] Cleaning up");

      // Clear polling interval
      if (internalStateRef.current.remoteUpdateTimeout) {
        clearInterval(internalStateRef.current.remoteUpdateTimeout as any);
        internalStateRef.current.remoteUpdateTimeout = null;
      }

      // Disconnect ElementStore callback
      ElementStore.getState().setYjsUpdateCallback(null);

      // Unobserve all listeners
      yElementsText.unobserve(elementsObserver);
      yMousePositions.unobserve(mouseObserver);
      ySelections.unobserve(selectionsObserver);

      // Unobserve awareness changes
      if (provider.awareness) {
        try {
          provider.awareness.off("change", awarenessChangeObserver);
        } catch (err) {
          console.warn(
            "[useYjsCollab] Error removing awareness observer:",
            err,
          );
        }
      }

      provider.destroy();
      persistence.destroy();
      ydoc.destroy();

      ydocRef.current = null;
      providerRef.current = null;
      persistenceRef.current = null;
    };
  }, [
    // 8. MINIMAL DEPENDENCIES to prevent loop
    enabled,
    isLoaded,
    userId,
    roomId,
    wsUrl,
    projectId,
    // IMPORTANT: do NOT add mouseStore, handleSync, handleUpdate, or onSync here
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRemoteTimeout();

      // Remove document mouse tracking listener
      if (documentMouseTrackingAttached && documentMouseMoveHandler) {
        try {
          document.removeEventListener("mousemove", documentMouseMoveHandler);
          documentMouseTrackingAttached = false;
          documentMouseMoveHandler = null;
          console.log("[useYjsCollab] Removed document mouse tracking");
        } catch (err) {
          console.warn("[useYjsCollab] Error removing mouse tracking:", err);
        }
      }
    };
  }, []);

  return {
    isConnected: state.roomState === "connected",
    roomState: state.roomState,
    error: state.error,
    isSynced: state.isSynced,
    pendingUpdates: state.pendingUpdates,
    ydoc: ydocRef.current,
    provider: providerRef.current,
  };
}
