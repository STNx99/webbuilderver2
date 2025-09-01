"use client";

import { useRef, useEffect } from "react";
import type { EditorElement } from "@/types/global.type";
import type { ResizeDirection } from "@/constants/direciton";
import { CSSStyles } from "@/interfaces/elements.interface";

/**
 * Improvements made:
 * - Use requestAnimationFrame to batch DOM/React updates.
 * - Use Pointer Events (with fallback touch/mouse handling) for broader device support.
 * - Support Shift-key aspect-ratio locking.
 * - Provide clearer cursor mapping for directions.
 * - Robust cleanup and cancelation of rAF.
 */

const MIN_SIZE = 20;
const MAX_PERCENT = 100;

interface UseResizeHandlerProps {
  element: EditorElement;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
}

const directionToCursor = (dir: ResizeDirection) => {
  // Map our directional tokens to standard cursors
  if (dir === "gap") return "ns-resize";
  if (dir.startsWith("padding-") || dir.startsWith("margin-")) return "pointer";
  const map: Record<string, string> = {
    n: "ns-resize",
    s: "ns-resize",
    e: "ew-resize",
    w: "ew-resize",
    ne: "nesw-resize",
    nw: "nwse-resize",
    se: "nwse-resize",
    sw: "nesw-resize",
  };
  // For compound directions like 'n-e' or 'ne', normalize by removing separators
  const key = dir.replace(/[-_]/g, "");
  return map[key] ?? `${dir}-resize`;
};

export function useResizeHandler({
  element,
  updateElement,
  targetRef,
}: UseResizeHandlerProps) {
  const resizeState = useRef<{
    direction: ResizeDirection;
    startRect: DOMRect;
    startPos: { x: number; y: number };
    parentElement: HTMLElement;
    aspectRatio?: number;
  } | null>(null);

  // Pending style updates (batched via rAF)
  const pendingStylesRef = useRef<Partial<CSSStyles> | null>(null);
  const rafRef = useRef<number | null>(null);

  const scheduleFlush = () => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const styles = pendingStylesRef.current;
      if (styles) {
        updateElement(element.id, { styles });
        pendingStylesRef.current = null;
      }
    });
  };

  const cancelFlush = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingStylesRef.current = null;
  };

  function handleSpecialResize(
    direction: ResizeDirection,
    clientX: number,
    clientY: number,
    startPos: { x: number; y: number },
    element: EditorElement,
  ): Partial<CSSStyles> | null {
    let updatedStyles: Partial<CSSStyles> = {
      ...element.styles,
    };

    // Helper for padding/margin resize
    const handleSpacingResize = (
      type: "padding" | "margin",
      dir: string,
    ): boolean => {
      const propMap = {
        n: `${type}Top`,
        s: `${type}Bottom`,
        e: `${type}Right`,
        w: `${type}Left`,
      } as const;
      const prop = propMap[dir as keyof typeof propMap];
      if (!prop) return false;

      const initialValue = parseInt(
        element.styles?.[prop]?.toString() || "0",
        10,
      );
      let delta = 0;
      if (dir === "n") delta = clientY - startPos.y;
      if (dir === "s") delta = startPos.y - clientY;
      if (dir === "e") delta = startPos.x - clientX;
      if (dir === "w") delta = clientX - startPos.x;
      updatedStyles[prop] = `${Math.max(0, initialValue + delta)}px`;
      return true;
    };

    // Gap
    if (direction === "gap") {
      const delta = clientY - startPos.y;
      const initialGap = parseInt(element.styles?.gap?.toString() || "0", 10);
      updatedStyles.gap = `${Math.max(0, initialGap + delta)}px`;
      return updatedStyles;
    }

    // Padding
    if (direction.startsWith("padding-")) {
      const dir = direction.split("-")[1];
      if (handleSpacingResize("padding", dir)) return updatedStyles;
    }

    // Margin
    if (direction.startsWith("margin-")) {
      const dir = direction.split("-")[1];
      if (handleSpacingResize("margin", dir)) return updatedStyles;
    }

    return null;
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!resizeState.current) return;

    const { direction, startRect, startPos, parentElement, aspectRatio } =
      resizeState.current;

    const clientX = e.clientX;
    const clientY = e.clientY;

    // Special resize (gap, padding, margin)
    const specialResize = handleSpecialResize(
      direction,
      clientX,
      clientY,
      startPos,
      element,
    );
    if (specialResize) {
      pendingStylesRef.current = { ...element.styles, ...specialResize };
      scheduleFlush();
      return;
    }

    // Normal width/height resize
    let newWidth = startRect.width;
    let newHeight = startRect.height;
    let newTop = startRect.top;
    let newLeft = startRect.left;

    if (direction.includes("e")) newWidth = clientX - startRect.left;
    if (direction.includes("w")) {
      newWidth = startRect.right - clientX;
      newLeft = clientX;
    }
    if (direction.includes("s")) newHeight = clientY - startRect.top;
    if (direction.includes("n")) {
      newHeight = startRect.bottom - clientY;
      newTop = clientY;
    }

    // Aspect ratio locking when Shift is held (PointerEvent supports shiftKey)
    const aspectLock = Boolean(e.shiftKey) && typeof aspectRatio === "number";
    if (aspectLock && aspectRatio) {
      // Preserve ratio based on dominant delta
      const widthDelta = Math.abs(newWidth - startRect.width);
      const heightDelta = Math.abs(newHeight - startRect.height);
      if (widthDelta > heightDelta) {
        newHeight = Math.max(MIN_SIZE, newWidth / aspectRatio);
        // if resizing from north, adjust top according to newHeight
        if (direction.includes("n")) {
          newTop = startRect.bottom - newHeight;
        }
      } else {
        newWidth = Math.max(MIN_SIZE, newHeight * aspectRatio);
        if (direction.includes("w")) {
          newLeft = startRect.right - newWidth;
        }
      }
    }

    const minSize = MIN_SIZE;
    newWidth = Math.max(minSize, newWidth);
    newHeight = Math.max(minSize, newHeight);

    const parentRect = parentElement.getBoundingClientRect();
    const updatedStyles: Partial<CSSStyles> = {
      ...element.styles,
    };

    const parentContentWidth = parentElement.clientWidth || parentRect.width;
    const parentContentHeight = parentElement.clientHeight || parentRect.height;

    updatedStyles.width = `${Math.min(
      (newWidth / parentContentWidth) * MAX_PERCENT,
      MAX_PERCENT,
    ).toFixed(2)}%`;
    updatedStyles.height = `${Math.min(
      (newHeight / parentContentHeight) * MAX_PERCENT,
      MAX_PERCENT,
    ).toFixed(2)}%`;

    if (direction === "s" || direction === "n")
      updatedStyles.width = element.styles?.width;
    else if (direction === "e" || direction === "w")
      updatedStyles.height = element.styles?.height;

    if (element.styles?.position === "absolute") {
      updatedStyles.left = `${(
        ((newLeft - parentRect.left) / parentContentWidth) *
        MAX_PERCENT
      ).toFixed(2)}%`;
      updatedStyles.top = `${(
        ((newTop - parentRect.top) / parentContentHeight) *
        MAX_PERCENT
      ).toFixed(2)}%`;
    }

    // Batch updates
    pendingStylesRef.current = updatedStyles;
    scheduleFlush();
  };

  const onPointerUp = () => {
    // finalize
    resizeState.current = null;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    cancelFlush();
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  };

  const handleResizeStart = (
    direction: ResizeDirection,
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (!targetRef.current) return;

    // Prefer pointer events if available
    const parentElement =
      targetRef.current.parentElement ?? document.getElementById("canvas");
    if (!parentElement) return;

    // Extract clientX/Y from different event types
    const extractPos = (evt: any) => {
      if (evt.touches && evt.touches[0]) {
        return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
      }
      if (evt.clientX !== undefined) {
        return { x: evt.clientX, y: evt.clientY };
      }
      // fallback
      return { x: 0, y: 0 };
    };

    const pos = extractPos(e);

    const startRect = targetRef.current.getBoundingClientRect();
    resizeState.current = {
      direction,
      startRect,
      startPos: { x: pos.x, y: pos.y },
      parentElement,
      aspectRatio:
        startRect.height > 0 ? startRect.width / startRect.height : undefined,
    };

    // Add pointer listeners (works for mouse, pen, touch in modern browsers)
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp, { once: true });

    // Prevent selection while dragging
    document.body.style.userSelect = "none";

    // Set an appropriate cursor
    document.body.style.cursor = directionToCursor(direction);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      resizeState.current = null;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      cancelFlush();
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    // We deliberately do not include element/updateElement/targetRef in deps -
    // the returned handlers will work with the refs captured at call time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isResizing = resizeState.current !== null;
  const currentResizeDirection = resizeState.current?.direction || null;

  return {
    handleResizeStart,
    isResizing,
    currentResizeDirection,
  };
}
