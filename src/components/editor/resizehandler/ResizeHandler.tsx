"use client";

import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementHandler } from "@/hooks/useElementHandler";
import { useResizeHandler } from "@/hooks/useResizeHandler";
import { cn } from "@/lib/utils";
import type { EditorElement } from "@/types/global.type";
import type React from "react";
import { type ReactNode, useRef } from "react";
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

function ResizeHandle({
  direction,
  onResizeStart,
  element,
  isResizing,
  currentResizeDirection,
}: {
  direction: ResizeDirection;
  onResizeStart: (direction: ResizeDirection, e: React.MouseEvent) => void;
  element: EditorElement;
  isResizing: boolean;
  currentResizeDirection: ResizeDirection | null;
}) {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();

      onResizeStart(direction, e);
    }
  };

  const isMarginHandle = direction.startsWith("margin-");
  const isGapHandle = direction === "gap";

  const baseClasses = cn(
    "absolute rounded-full w-3 h-3 border-2 z-10 active:scale-125",
    isGapHandle
      ? "bg-green-500 border-white hover:bg-green-600 active:bg-green-700"
      : isMarginHandle
        ? "bg-orange-500 border-white hover:bg-orange-600 active:bg-orange-700"
        : "bg-blue-500 border-white hover:bg-blue-600 active:bg-blue-700",
  );

  return (
    <ResizeTooltip
      direction={direction}
      element={element}
      isResizing={isResizing}
      currentResizeDirection={currentResizeDirection}
    >
      <div
        className={cn(baseClasses, directionalClasses[direction])}
        onMouseDown={handleMouseDown}
      />
    </ResizeTooltip>
  );
}

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

  // Get resize handles, excluding the gap handle
  const resizeHandles: ResizeDirection[] = getResizeHandles(
    element.styles,
  ).filter((dir) => dir !== "gap");

  // Use imported hasGap to determine if gap handles should be rendered
  const showGapHandles = hasGap(element.styles);

  // Helper for rendering gap handle in the center
  function GapHandle({
    onResizeStart,
    isResizing,
    currentResizeDirection,
  }: {
    onResizeStart: (direction: ResizeDirection, e: React.MouseEvent) => void;
    isResizing: boolean;
    currentResizeDirection: ResizeDirection | null;
  }) {
    const baseClasses = cn(
      "absolute rounded-full w-3 h-3 border-2 z-10 active:scale-125 bg-green-500 border-white hover:bg-green-600 active:bg-green-700",
      "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
    );
    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 0) {
        e.preventDefault();
        e.stopPropagation();

        onResizeStart("gap", e);
      }
    };
    return (
      <ResizeTooltip
        direction="gap"
        element={element}
        isResizing={isResizing}
        currentResizeDirection={currentResizeDirection}
      >
        <div className={baseClasses} onMouseDown={handleMouseDown} />
      </ResizeTooltip>
    );
  }

  return (
    <div
      ref={targetRef}
      className="relative"
      style={{
        width: element.styles?.width || "auto",
        height: element.styles?.height || "auto",
        position: "relative",
      }}
      id={element.id}
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => {
        e.stopPropagation();
        handleDoubleClick(e, element);
      }}
    >
      {selectedElement?.id === element.id && (
        <div
          className="absolute top-0 left-0 z-30 text-blue-500 text-xs px-1 py-0.5 pointer-events-none select-none"
          style={{
            transform: "translateY(-20px)",
            maxWidth: "80%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {element.type} {element.id}
        </div>
      )}
      {children}
      {selectedElement?.id === element.id && (
        <>
          {resizeHandles.map((dir) => (
            <ResizeHandle
              key={dir}
              direction={dir}
              onResizeStart={handleResizeStart}
              element={selectedElement}
              isResizing={isResizing}
              currentResizeDirection={currentResizeDirection}
            />
          ))}
          {showGapHandles && (
            <GapHandle
              onResizeStart={handleResizeStart}
              isResizing={isResizing}
              currentResizeDirection={currentResizeDirection}
            />
          )}
          <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none" />
        </>
      )}
      {hoveredElement?.id === element.id &&
        !(draggedOverElement?.id === element.id) &&
        !(selectedElement?.id === element.id) && (
          <div className="pointer-events-none absolute inset-0 border border-black z-20" />
        )}
      {draggedOverElement?.id === element.id &&
        !(selectedElement?.id === element.id) && (
          <div className="pointer-events-none absolute border-dashed inset-0 border-2 border-green-600 z-20" />
        )}
    </div>
  );
}
