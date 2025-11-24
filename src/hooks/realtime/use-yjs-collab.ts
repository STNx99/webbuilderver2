"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useElementStore, ElementStore } from "@/globalstore/elementstore";
import { useMouseStore } from "@/globalstore/mousestore";
import { EditorElement } from "@/types/global.type";
import * as Y from "yjs";
import { CustomYjsProvider } from "@/lib/yjs/yjs-provider";
import { IndexeddbPersistence } from "y-indexeddb";
import {
  createSyncAwarenessToStore,
  createAwarenessChangeObserver,
} from "@/lib/utils/use-yjs-collab-utils";
import { useYjsElements } from "./use-yjs-elements";

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
    lastAwarenessHash: "",
    pendingElementUpdate: null as EditorElement[] | null,
  });

  const { userId, getToken, isLoaded } = useAuth();
  const { elements, loadElements } = useElementStore();
  const mouseStore = useMouseStore();

  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<CustomYjsProvider | null>(null);
  const persistenceRef = useRef<IndexeddbPersistence | null>(null);

  const getProvider = () => providerRef.current;
  const getYdoc = () => ydocRef.current;

  const handleSyncCallback = () => {
    setState((prev) => ({
      ...prev,
      isSynced: true,
    }));
    onSync?.();
  };

  const {
    handleSync,
    handleUpdate,
    setupElementsObserver,
    setupElementsCallback,
  } = useYjsElements({
    ydoc: ydocRef.current,
    provider: providerRef.current,
    loadElements,
    onSync: handleSyncCallback,
    getProvider,
    getYdoc,
  });

  const clearRemoteTimeout = () => {
    if (internalStateRef.current.remoteUpdateTimeout) {
      clearTimeout(internalStateRef.current.remoteUpdateTimeout);
      internalStateRef.current.remoteUpdateTimeout = null;
    }
  };

  const latestHandlers = useRef({
    handleSync,
    handleUpdate,
    mouseStore,
    onSync,
    getToken,
  });

  useEffect(() => {
    latestHandlers.current = {
      handleSync,
      handleUpdate,
      mouseStore,
      onSync,
      getToken,
    };
  }, [handleSync, handleUpdate, mouseStore, onSync, getToken]);

  useEffect(() => {
    if (ydocRef.current) {
      ydocRef.current = ydocRef.current;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !isLoaded || !userId) {
      return;
    }
    if (!roomId || roomId === "undefined" || roomId === "") {
      setState((p) => ({ ...p, roomState: "error", error: "Invalid room ID" }));
      return;
    }
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const persistence = new IndexeddbPersistence(roomId, ydoc);
    persistenceRef.current = persistence;
    persistence.whenSynced.then(() => {});
    const provider = new CustomYjsProvider({
      url: wsUrl,
      roomId,
      userId,
      projectId,
      getToken: () => latestHandlers.current.getToken(),
      doc: ydoc,
      onSyncUsers: (users) => {
        mouseStore.setUsers(users);
      },
    });
    providerRef.current = provider;
    provider.on("status", ({ status }) => {
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
      if (synced) {
        setState((p) => ({ ...p, isSynced: synced }));
        latestHandlers.current.onSync?.();
      }
    });
    const yElementsText = ydoc.getText("elementsJson");
    const elementsObserver = setupElementsObserver(
      yElementsText,
      internalStateRef,
    );
    const syncAwarenessToStore = createSyncAwarenessToStore(
      provider,
      mouseStore,
      internalStateRef,
    );
    const awarenessChangeObserver =
      createAwarenessChangeObserver(syncAwarenessToStore);
    yElementsText.observe(elementsObserver);
    try {
      const initialElementsJson = yElementsText.toString();
      const initialElements = initialElementsJson
        ? JSON.parse(initialElementsJson)
        : [];
      latestHandlers.current.handleSync(initialElements);
    } catch (err) {
      console.warn("[useYjsCollab] Initial elements parse failed:", err);
      latestHandlers.current.handleSync([]);
    }
    if (provider.awareness) {
      provider.awareness.on("change", awarenessChangeObserver);
      syncAwarenessToStore();
      const awarenessPollingInterval = setInterval(() => {
        if (!provider || !provider.awareness) {
          clearInterval(awarenessPollingInterval);
          return;
        }
        syncAwarenessToStore();
      }, 150);
      internalStateRef.current.remoteUpdateTimeout =
        awarenessPollingInterval as NodeJS.Timeout;
    }
    setupElementsCallback(internalStateRef, ElementStore, getProvider, getYdoc);
    return () => {
      if (internalStateRef.current.remoteUpdateTimeout) {
        clearInterval(
          internalStateRef.current.remoteUpdateTimeout as NodeJS.Timeout,
        );
        internalStateRef.current.remoteUpdateTimeout = null;
      }
      ElementStore.getState().setYjsUpdateCallback(null);
      yElementsText.unobserve(elementsObserver);
      if (provider.awareness) {
        try {
          provider.awareness.off("change", awarenessChangeObserver);
        } catch (err) {}
      }
      provider.destroy();
      persistence.destroy();
      ydoc.destroy();
      ydocRef.current = null;
      providerRef.current = null;
      persistenceRef.current = null;
    };
  }, [enabled, isLoaded, userId, roomId, wsUrl, projectId]);

  useEffect(() => {
    return () => {
      clearRemoteTimeout();
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
