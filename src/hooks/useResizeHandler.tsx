"use client";

import { useRef, useEffect } from "react";
import { get, merge, clamp } from "lodash";
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

  const cursorMap: Record<string, string> = {
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
  return get(cursorMap, key, `${dir}-resize`);
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
    ownerDocument?: Document | null;
    ownerWindow?: Window | null;
  } | null>(null);

  const pendingStylesRef = useRef<Partial<CSSStyles> | null>(null);
  const rafRef = useRef<number | null>(null);

  const lastOwnerDocRef = useRef<Document | null>(null);
  const lastOwnerWindowRef = useRef<Window | null>(null);

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
    const updatedStyles = { ...element.styles };

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

      const initialValue = parseInt(String(element.styles?.[prop] || "0"), 10);
      const deltaMap = {
        n: clientY - startPos.y,
        s: startPos.y - clientY,
        e: startPos.x - clientX,
        w: clientX - startPos.x,
      };

      const delta = deltaMap[dir as keyof typeof deltaMap] || 0;
      updatedStyles[prop] = `${clamp(initialValue + delta, 0, Infinity)}px`;
      return true;
    };

    // Gap resize
    if (direction === "gap") {
      const delta = clientY - startPos.y;
      const initialGap = parseInt(String(get(element.styles, "gap", "0")), 10);
      updatedStyles.gap = `${clamp(initialGap + delta, 0, Infinity)}px`;
      return updatedStyles;
    }

    // Padding resize
    if (direction.startsWith("padding-")) {
      const dir = direction.split("-")[1];
      if (handleSpacingResize("padding", dir)) return updatedStyles;
    }

    // Margin resize
    if (direction.startsWith("margin-")) {
      const dir = direction.split("-")[1];
      if (handleSpacingResize("margin", dir)) return updatedStyles;
    }

    return null;
  }

  const onMouseMove = (e: MouseEvent) => {
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

    // Calculate new dimensions based on direction
    const directionOps = {
      e: () => (newWidth = clientX - startRect.left),
      w: () => {
        newWidth = startRect.right - clientX;
        newLeft = clientX;
      },
      s: () => (newHeight = clientY - startRect.top),
      n: () => {
        newHeight = startRect.bottom - clientY;
        newTop = clientY;
      },
    };

    // Apply directional changes
    Object.keys(directionOps).forEach((dir) => {
      if (direction.includes(dir)) {
        directionOps[dir as keyof typeof directionOps]();
      }
    });

    // Aspect ratio locking when Shift is held
    const aspectLock = Boolean(e.shiftKey) && typeof aspectRatio === "number";
    if (aspectLock && aspectRatio) {
      // Preserve ratio based on dominant delta
      const widthDelta = Math.abs(newWidth - startRect.width);
      const heightDelta = Math.abs(newHeight - startRect.height);

      if (widthDelta > heightDelta) {
        newHeight = clamp(newWidth / aspectRatio, MIN_SIZE, Infinity);
        if (direction.includes("n")) {
          newTop = startRect.bottom - newHeight;
        }
      } else {
        newWidth = clamp(newHeight * aspectRatio, MIN_SIZE, Infinity);
        if (direction.includes("w")) {
          newLeft = startRect.right - newWidth;
        }
      }
    }

    // Apply minimum size constraints
    newWidth = clamp(newWidth, MIN_SIZE, Infinity);
    newHeight = clamp(newHeight, MIN_SIZE, Infinity);

    const parentRect = parentElement.getBoundingClientRect();
    const parentContentWidth = get(
      parentElement,
      "clientWidth",
      parentRect.width,
    );
    const parentContentHeight = get(
      parentElement,
      "clientHeight",
      parentRect.height,
    );

    const baseStyles = { ...element.styles };
    const updatedStyles = merge({}, baseStyles, {
      width: `${clamp((newWidth / parentContentWidth) * MAX_PERCENT, 0, MAX_PERCENT).toFixed(2)}%`,
      height: `${clamp((newHeight / parentContentHeight) * MAX_PERCENT, 0, MAX_PERCENT).toFixed(2)}%`,
    });

    // Preserve original dimensions for single-axis resizes
    if (direction === "s" || direction === "n") {
      updatedStyles.width = String(get(element.styles, "width", "auto"));
    } else if (direction === "e" || direction === "w") {
      updatedStyles.height = String(get(element.styles, "height", "auto"));
    }

    // Handle absolute positioning
    if (get(element.styles, "position") === "absolute") {
      merge(updatedStyles, {
        left: `${(((newLeft - parentRect.left) / parentContentWidth) * MAX_PERCENT).toFixed(2)}%`,
        top: `${(((newTop - parentRect.top) / parentContentHeight) * MAX_PERCENT).toFixed(2)}%`,
      });
    }

    // Batch updates
    pendingStylesRef.current = updatedStyles;
    scheduleFlush();
  };

  const onMouseUp = (e?: MouseEvent) => {
    // finalize
    resizeState.current = null;

    const lastDoc = lastOwnerDocRef.current || document;

    // remove listeners from the owner document (or fallback to global document)
    try {
      lastDoc.removeEventListener("mousemove", onMouseMove);
      lastDoc.removeEventListener("mouseup", onMouseUp as EventListener);
    } catch {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp as EventListener);
    }

    cancelFlush();

    // clear styles on the owner document's body if available
    try {
      if (lastDoc && lastDoc.body) {
        lastDoc.body.style.userSelect = "";
        lastDoc.body.style.cursor = "";
      } else {
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    } catch {
      // ignore cross-origin iframe failures
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    lastOwnerDocRef.current = null;
    lastOwnerWindowRef.current = null;
  };

  const handleResizeStart = (
    direction: ResizeDirection,
    e: React.MouseEvent,
  ) => {
    if (!targetRef.current) return;

    // Determine owner document/window (works when target lives inside an iframe)
    const ownerDoc = targetRef.current.ownerDocument ?? document;
    const ownerWin = (ownerDoc && ownerDoc.defaultView) ?? window;

    // store for cleanup/usability
    lastOwnerDocRef.current = ownerDoc;
    lastOwnerWindowRef.current = ownerWin;

    // Scope parent lookup to ownerDoc.
    const parentElement =
      targetRef.current.parentElement ??
      ownerDoc.getElementById("preview-iframe") ??
      document.getElementById("canvas");
    if (!parentElement) return;

    const extractPos = (evt: any) => {
      // React synthetic events may expose nativeEvent
      const native = evt?.nativeEvent ?? evt;
      if (native && native.clientX !== undefined) {
        return { x: native.clientX, y: native.clientY };
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
      ownerDocument: ownerDoc,
      ownerWindow: ownerWin,
    };

    // Add mouse listeners on the owner document so events are received even
    // while the mouse moves outside the iframe element but within its document.
    try {
      ownerDoc.addEventListener("mousemove", onMouseMove);
      ownerDoc.addEventListener("mouseup", onMouseUp as EventListener, {
        once: true,
      });
    } catch {
      // fallback to global document
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp as EventListener, {
        once: true,
      });
    }

    // Prevent selection while dragging on the correct document body
    try {
      if (ownerDoc && ownerDoc.body) ownerDoc.body.style.userSelect = "none";
      else document.body.style.userSelect = "none";
    } catch {
      // ignore cross-origin iframe body styling failures
      document.body.style.userSelect = "none";
    }

    // Set an appropriate cursor on owner document body
    try {
      const cur = directionToCursor(direction);
      if (ownerDoc && ownerDoc.body) ownerDoc.body.style.cursor = cur;
      else document.body.style.cursor = cur;
    } catch {
      document.body.style.cursor = directionToCursor(direction);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      resizeState.current = null;

      const lastDoc = lastOwnerDocRef.current || document;

      try {
        lastDoc.removeEventListener("mousemove", onMouseMove);
        lastDoc.removeEventListener("mouseup", onMouseUp as EventListener);
      } catch {
        // fallback to global
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp as EventListener);
      }

      cancelFlush();

      try {
        if (lastDoc && lastDoc.body) {
          lastDoc.body.style.userSelect = "";
          lastDoc.body.style.cursor = "";
        } else {
          document.body.style.userSelect = "";
          document.body.style.cursor = "";
        }
      } catch {
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }

      lastOwnerDocRef.current = null;
      lastOwnerWindowRef.current = null;
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
