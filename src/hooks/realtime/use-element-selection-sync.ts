"use client";

import { useEffect, useRef } from "react";
import { useSelectionStore } from "@/globalstore/selectionstore";

interface UseElementSelectionSyncOptions {
  updateSelection: (elementId: string | null) => void;
  userId: string;
  enabled?: boolean;
}

/**
 * Hook to sync element selection changes to other clients via Yjs
 * Updates Yjs document when the user selects a different element
 */
export function useElementSelectionSync({
  updateSelection,
  userId,
  enabled = true,
}: UseElementSelectionSyncOptions): void {
  const { selectedElement } = useSelectionStore();
  const lastSentElementIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    const currentElementId = selectedElement?.id;

    if (currentElementId === lastSentElementIdRef.current) {
      return;
    }

    // Only send if we have a selected element (don't send deselection)
    if (!currentElementId) {
      console.log(
        "[ElementSelectionSync] Element deselected, clearing last sent",
        { userId: userId.slice(0, 8) },
      );
      lastSentElementIdRef.current = undefined;
      return;
    }

    lastSentElementIdRef.current = currentElementId;

    console.log("[ElementSelectionSync] Updating selection in Yjs", {
      userId: userId.slice(0, 8),
      elementId: currentElementId.slice(0, 8),
      elementType: selectedElement?.type,
    });

    updateSelection(currentElementId);
  }, [selectedElement?.id, updateSelection, userId, enabled]);
}
