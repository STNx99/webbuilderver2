"use client";

import { useRef, useCallback } from "react";
import { EditorElement } from "@/types/global.type";
import * as Y from "yjs";
import {
  safeValidateElementTree,
  validateContainerElementTree,
} from "@/lib/utils/element/containerElementValidator";
import {
  sanitizeElements,
  computeHash,
} from "@/lib/utils/use-yjs-collab-utils";

interface UseYjsElementsOptions {
  ydoc: Y.Doc | null;
  provider: any;
  loadElements: (elements: EditorElement[], replace: boolean) => void;
  onSync?: () => void;
  getProvider?: () => any;
  getYdoc?: () => Y.Doc | null;
}

interface UseYjsElementsReturn {
  handleSync: (elements: EditorElement[]) => void;
  handleUpdate: (elements: EditorElement[]) => void;
  setupElementsObserver: (
    yElementsText: Y.Text,
    internalStateRef: any,
  ) => (event: Y.YEvent<Y.Text>, transaction: Y.Transaction) => void;
  setupElementsCallback: (
    internalStateRef: any,
    ElementStore: any,
    getProvider: () => any,
    getYdoc: () => Y.Doc | null,
  ) => void;
}

export function useYjsElements({
  ydoc,
  provider,
  loadElements,
  onSync,
  getProvider,
  getYdoc,
}: UseYjsElementsOptions): UseYjsElementsReturn {
  const internalStateRef = useRef({
    lastLocalHash: "",
    lastSentHash: "",
    isUpdatingFromElementStore: false,
    lastCallbackTime: 0,
  });

  const handleSync = useCallback(
    (elements: EditorElement[]) => {
      const sanitizedElements = sanitizeElements(elements);
      const validationResult = safeValidateElementTree(sanitizedElements);
      if (!validationResult.success) {
        return;
      }
      const normalizedElements = validationResult.data || sanitizedElements;
      const validation = validateContainerElementTree(normalizedElements);
      if (!validation.valid) {
      }
      const hash = computeHash(normalizedElements);
      internalStateRef.current.lastLocalHash = hash;
      internalStateRef.current.lastSentHash = hash;
      loadElements(normalizedElements, true);
      setTimeout(() => {
        onSync?.();
      }, 100);
    },
    [loadElements, onSync],
  );

  const handleUpdate = useCallback(
    (elements: EditorElement[]) => {
      const sanitizedElements = sanitizeElements(elements);
      const validationResult = safeValidateElementTree(sanitizedElements);
      if (!validationResult.success) {
        return;
      }
      const normalizedElements = validationResult.data || sanitizedElements;
      const validation = validateContainerElementTree(normalizedElements);
      if (!validation.valid) {
      }
      const hash = computeHash(normalizedElements);
      if (hash !== internalStateRef.current.lastLocalHash) {
        internalStateRef.current.lastLocalHash = hash;
        loadElements(normalizedElements, true);
      }
    },
    [loadElements],
  );

  const setupElementsObserver = useCallback(
    (yElementsText: Y.Text, internalStateRef: any) => {
      return (event: Y.YEvent<Y.Text>, transaction: Y.Transaction) => {
        try {
          if (internalStateRef.current.isUpdatingFromElementStore) {
            return;
          }
          const elementsJson = yElementsText.toString();
          const parsed = elementsJson ? JSON.parse(elementsJson) : [];
          const isRemoteUpdate =
            transaction && transaction.origin === "remote-update";
          if (isRemoteUpdate) {
            handleUpdate(parsed);
          } else {
            handleSync(parsed);
          }
        } catch (err) {
          console.warn("[useYjsElements] Elements parse failed:", err);
        }
      };
    },
    [handleSync, handleUpdate],
  );

  const setupElementsCallback = useCallback(
    (
      internalStateRef: any,
      ElementStore: any,
      getProvider: () => any,
      getYdoc: () => Y.Doc | null,
    ) => {
      const elementStoreCallback = (elements: EditorElement[]) => {
        const currentProvider = getProvider?.();
        if (!currentProvider?.synched) {
          return;
        }

        if (!elements || elements.length === 0) {
          return;
        }

        try {
          internalStateRef.current.isUpdatingFromElementStore = true;

          const currentYdoc = getYdoc();
          if (currentYdoc) {
            Y.transact(currentYdoc, () => {
              const yElementsText = currentYdoc.getText("elementsJson");
              yElementsText.delete(0, yElementsText.length);
              yElementsText.insert(0, JSON.stringify(elements));
            });
          }

          currentProvider.sendUpdate(elements);

          setTimeout(() => {
            internalStateRef.current.isUpdatingFromElementStore = false;
          }, 50);
        } catch (err) {
          console.error("[useYjsElements] Error updating elements:", err);
          internalStateRef.current.isUpdatingFromElementStore = false;
        }
      };

      ElementStore.getState().setYjsUpdateCallback(elementStoreCallback);
    },
    [],
  );

  return {
    handleSync,
    handleUpdate,
    setupElementsObserver,
    setupElementsCallback,
  };
}
