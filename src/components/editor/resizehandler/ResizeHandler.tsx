"use client";

import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementHandler } from "@/hooks/useElementHandler";
import { useResizeHandler } from "@/hooks/useResizeHandler";
import { cn } from "@/lib/utils";
import type { EditorElement } from "@/types/global.type";
import type React from "react";
import { type ReactNode, useRef, useMemo, memo } from "react";
import {
  type ResizeDirection,
  directionalClasses,
  getResizeHandles,
  hasGap,
} from "@/constants/direciton";
import ResizeTooltip from "./ResizeTooltip";

interface ResizeHandlerProps {
  element: EditorElement;
  children: ReactNode;
}

interface ResizeHandleProps {
  direction: ResizeDirection;
  onResizeStart: (direction: ResizeDirection, e: React.MouseEvent) => void;
  element: EditorElement;
  isResizing: boolean;
  currentResizeDirection: ResizeDirection | null;
}

const ResizeHandle = memo(function ResizeHandle({
  direction,
  onResizeStart,
  element,
  isResizing,
  currentResizeDirection,
}: ResizeHandleProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only handle left mouse button
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    onResizeStart(direction, e);
  };

  const isMarginHandle = direction.startsWith("margin-");
  const isPaddingHandle = direction.startsWith("padding-");
  const isGapHandle = direction === "gap";

  // Determine handle color based on type
  const handleColorClasses = useMemo(() => {
    if (isGapHandle) {
      return "bg-green-500 border-white hover:bg-green-600 active:bg-green-700";
    }
    if (isMarginHandle) {
      return "bg-orange-500 border-white hover:bg-orange-600 active:bg-orange-700";
    }
    if (isPaddingHandle) {
      return "bg-yellow-500 border-white hover:bg-yellow-600 active:bg-yellow-700";
    }
    return "bg-blue-500 border-white hover:bg-blue-600 active:bg-blue-700";
  }, [isGapHandle, isMarginHandle, isPaddingHandle]);

  const baseClasses = cn(
    "absolute rounded-full w-3 h-3 border-2 z-10 transition-transform duration-75",
    "hover:scale-110 active:scale-125",
    handleColorClasses,
    directionalClasses[direction],
  );

  return (
    <ResizeTooltip
      direction={direction}
      element={element}
      isResizing={isResizing}
      currentResizeDirection={currentResizeDirection}
    >
      <div
        className={baseClasses}
        onMouseDown={handleMouseDown}
        onPointerDown={(e) => e.stopPropagation()}
        role="button"
        aria-label={`Resize ${direction}`}
        tabIndex={-1}
      />
    </ResizeTooltip>
  );
});

/**
 * Gap handle component (centered)
 * Memoized to prevent unnecessary re-renders
 */
const GapHandle = memo(function GapHandle({
  onResizeStart,
  element,
  isResizing,
  currentResizeDirection,
}: {
  onResizeStart: (direction: ResizeDirection, e: React.MouseEvent) => void;
  element: EditorElement;
  isResizing: boolean;
  currentResizeDirection: ResizeDirection | null;
}) {
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only handle left mouse button
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    onResizeStart("gap", e);
  };

  const baseClasses = cn(
    "absolute rounded-full w-3 h-3 border-2 z-10 transition-transform duration-75",
    "bg-green-500 border-white hover:bg-green-600 active:bg-green-700",
    "hover:scale-110 active:scale-125",
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
  );

  return (
    <ResizeTooltip
      direction="gap"
      element={element}
      isResizing={isResizing}
      currentResizeDirection={currentResizeDirection}
    >
      <div
        className={baseClasses}
        onMouseDown={handleMouseDown}
        onPointerDown={(e) => e.stopPropagation()}
        role="button"
        aria-label="Resize gap"
        tabIndex={-1}
      />
    </ResizeTooltip>
  );
});

/**
 * Element label showing type and ID
 * Memoized to prevent unnecessary re-renders
 */
const ElementLabel = memo(function ElementLabel({
  element,
}: {
  element: EditorElement;
}) {
  return (
    <div
      className="absolute top-0 left-0 z-30 text-blue-500 text-xs px-1 py-0.5 pointer-events-none select-none bg-white/80 rounded"
      style={{
        transform: "translateY(-22px)",
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {element.type}
      <span className="opacity-60 ml-1 text-[10px]">
        #{element.id.slice(0, 8)}
      </span>
    </div>
  );
});

/**
 * Main ResizeHandler component
 * Wraps an element with resize handles and selection visualization
 */
export default function ResizeHandler({
  element,
  children,
}: ResizeHandlerProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { updateElement } = useElementStore();
  const { draggedOverElement, selectedElement, hoveredElement } =
    useSelectionStore();
  const { handleDoubleClick } = useElementHandler();
  const { handleResizeStart, isResizing, currentResizeDirection } =
    useResizeHandler({
      element,
      updateElement,
      targetRef,
    });

  // Determine selection states
  const isSelected = selectedElement?.id === element.id;
  const isHovered =
    hoveredElement?.id === element.id &&
    draggedOverElement?.id !== element.id &&
    !isSelected;
  const isDraggedOver = draggedOverElement?.id === element.id && !isSelected;

  // Get resize handles (excluding gap)
  const resizeHandles = useMemo(() => {
    return getResizeHandles(element.styles?.default).filter(
      (dir) => dir !== "gap",
    );
  }, [element.styles?.default]);

  // Check if gap handles should be shown
  const showGapHandles = useMemo(() => {
    return hasGap(element.styles?.default);
  }, [element.styles?.default]);

  // Handle double click
  const handleElementDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDoubleClick(e, element);
  };

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={targetRef}
      className="relative"
      style={{
        width: element.styles?.default?.width || "auto",
        height: element.styles?.default?.height || "auto",
        position: "relative",
      }}
      id={element.id}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleElementDoubleClick}
    >
      {/* Element label (shown when selected) */}
      {isSelected && <ElementLabel element={element} />}

      {/* Children content */}
      {children}

      {/* Resize handles (shown when selected) */}
      {isSelected && (
        <>
          {resizeHandles.map((dir) => (
            <ResizeHandle
              key={dir}
              direction={dir}
              onResizeStart={handleResizeStart}
              element={element}
              isResizing={isResizing}
              currentResizeDirection={currentResizeDirection}
            />
          ))}

          {/* Gap handle (if element supports gap) */}
          {showGapHandles && (
            <GapHandle
              onResizeStart={handleResizeStart}
              element={element}
              isResizing={isResizing}
              currentResizeDirection={currentResizeDirection}
            />
          )}

          {/* Selection border */}
          <div
            className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none rounded-sm"
            style={{
              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.1)",
            }}
          />
        </>
      )}

      {/* Hover border (shown when hovered but not selected) */}
      {isHovered && (
        <div className="pointer-events-none absolute inset-0 border border-blue-400 z-20 rounded-sm transition-colors duration-100" />
      )}

      {/* Drag over border (shown when dragging over) */}
      {isDraggedOver && (
        <div
          className="pointer-events-none absolute inset-0 border-2 border-dashed border-green-600 z-20 rounded-sm"
          style={{
            boxShadow: "0 0 0 1px rgba(22, 163, 74, 0.1)",
          }}
        />
      )}
    </div>
  );
}
