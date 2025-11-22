import * as Y from "yjs";
import { EditorElement } from "@/types/global.type";
import { CustomYjsProvider } from "@/lib/yjs/yjs-provider";

export const sanitizeElements = (
  elements: EditorElement[],
): EditorElement[] => {
  const sanitize = (el: EditorElement): EditorElement => {
    const sanitized = { ...el };
    if (sanitized.settings === null || sanitized.settings === undefined) {
      sanitized.settings = {};
    }
    if (sanitized.styles === null || sanitized.styles === undefined) {
      sanitized.styles = {};
    }
    if ("elements" in sanitized && Array.isArray(sanitized.elements)) {
      sanitized.elements = sanitized.elements.map(sanitize);
    }
    return sanitized;
  };
  return elements.map(sanitize);
};

export const computeHash = (elements: EditorElement[]): string => {
  try {
    return elements
      .map((el) => {
        const styleStr = JSON.stringify(el.styles || {});
        const settingsStr = JSON.stringify(el.settings || {});
        return `${el.id}:${el.type}:${styleStr}:${settingsStr}`;
      })
      .join("|");
  } catch {
    return "";
  }
};

export const createElementsObserver = (
  latestHandlers: {
    handleSync: (elements: EditorElement[]) => void;
    handleUpdate: (elements: EditorElement[]) => void;
  },
  internalStateRef: { current: { isUpdatingFromElementStore: boolean } },
) => {
  return (event: Y.YEvent<Y.Text>, transaction: Y.Transaction) => {
    try {
      if (internalStateRef.current.isUpdatingFromElementStore) {
        return;
      }
      const elementsJson = event.target.toString();
      const parsed = elementsJson ? JSON.parse(elementsJson) : [];
      const isRemoteUpdate =
        transaction && transaction.origin === "remote-update";
      if (isRemoteUpdate) {
        latestHandlers.handleUpdate(parsed);
      } else {
        latestHandlers.handleSync(parsed);
      }
    } catch (err) {
      console.warn("[useYjsCollab] Elements parse failed:", err);
    }
  };
};

export const createSyncAwarenessToStore = (
  provider: CustomYjsProvider,
  mouseStore: any,
  internalStateRef: { current: { lastAwarenessHash: string } },
) => {
  return () => {
    if (!provider.awareness) return;
    try {
      const allStates = provider.awareness.getStates();
      if (!allStates) return;
      const stateKeys: string[] = [];
      allStates.forEach((state: any, clientId: number) => {
        if (state?.cursor || state?.remoteUsers) {
          const cursorStr = state.cursor
            ? `${state.cursor.x},${state.cursor.y}`
            : "";
          const remoteUsersStr = state.remoteUsers
            ? JSON.stringify(state.remoteUsers)
            : "";
          stateKeys.push(`${clientId}:${cursorStr}:${remoteUsersStr}`);
        }
      });
      const currentHash = stateKeys.sort().join("|");
      if (currentHash === internalStateRef.current.lastAwarenessHash) {
        return;
      }
      internalStateRef.current.lastAwarenessHash = currentHash;
      const remoteUsers: Record<string, { x: number; y: number }> = {};
      const selectedByUser: Record<string, string> = {};
      let users: Record<string, any> = {};
      const localClientId = provider.awareness?.clientID?.toString();
      let usersMapFound = false;
      allStates.forEach((state: any, clientId: number) => {
        if (!state) return;
        const clientIdStr = clientId.toString();
        if (clientIdStr === localClientId) {
          if (
            state.users &&
            typeof state.users === "object" &&
            Object.keys(state.users).length > 0
          ) {
            users = { ...state.users };
            usersMapFound = true;
          }
          if (state.remoteUsers && typeof state.remoteUsers === "object") {
            Object.entries(state.remoteUsers).forEach(([userId, pos]) => {
              if (
                pos &&
                typeof pos === "object" &&
                "x" in pos &&
                "y" in pos &&
                typeof pos.x === "number" &&
                typeof pos.y === "number"
              ) {
                remoteUsers[userId] = { x: pos.x, y: pos.y };
              }
            });
          }
          if (
            state.selectedByUser &&
            typeof state.selectedByUser === "object"
          ) {
            Object.assign(selectedByUser, state.selectedByUser);
          }
          return;
        }
        if (state.cursor && typeof state.cursor === "object") {
          const x = state.cursor.x;
          const y = state.cursor.y;
          if (typeof x === "number" && typeof y === "number") {
            remoteUsers[clientIdStr] = { x, y };
          }
        }
        if (state.selectedElement) {
          selectedByUser[clientIdStr] = state.selectedElement;
        }
        if (!usersMapFound && state.user && typeof state.user === "object") {
          users[clientIdStr] = state.user;
        }
      });
      mouseStore.setRemoteUsers(remoteUsers);
      mouseStore.setSelectedByUser(selectedByUser as any);
      mouseStore.setUsers(users as any);
    } catch (err) {
      console.error("[useYjsCollab] Error syncing awareness to store:", err);
    }
  };
};

export const createAwarenessChangeObserver = (
  syncAwarenessToStore: () => void,
) => {
  return ({
    added,
    updated,
    removed,
  }: {
    added: number[];
    updated: number[];
    removed: number[];
  }) => {
    syncAwarenessToStore();
  };
};
