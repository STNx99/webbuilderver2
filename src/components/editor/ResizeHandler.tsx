"use client";

import { useElementStore } from "@/globalstore/elementstore";
import { useElementHandler } from "@/hooks/useElementHandler";
import { cn } from "@/lib/utils";
import type { EditorElement } from "@/types/global.type";
import type React from "react";
import { type ReactNode, useRef, useEffect } from "react";

type ResizeDirection = "se" | "sw" | "ne" | "nw" | "n" | "s" | "e" | "w";

interface ResizeHandlerProps {
  element: EditorElement;
  children: ReactNode;
}

function ResizeHandle({
  direction,
  onResizeStart,
}: {
  direction: ResizeDirection;
  onResizeStart: (direction: ResizeDirection, e: React.MouseEvent) => void;
}) {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      onResizeStart(direction, e);
    }
  };

  const baseClasses =
    "absolute bg-blue-500 rounded-full w-3 h-3 border-2 border-white z-10 hover:bg-blue-600 active:bg-blue-700 active:scale-125";
  const directionalClasses = {
    n: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
    s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
    e: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-e-resize",
    w: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-w-resize",
    ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
    nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
    se: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-se-resize",
    sw: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
  };

  return (
    <div
      className={cn(baseClasses, directionalClasses[direction])}
      onMouseDown={handleMouseDown}
    />
  );
}

export default function ResizeHandler({
  element,
  children,
}: ResizeHandlerProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { updateElement } = useElementStore();
  const { handleDoubleClick } = useElementHandler();

  const resizeState = useRef<{
    direction: ResizeDirection;
    startRect: DOMRect;
    startPos: { x: number; y: number };
    parentElement: HTMLElement;
  } | null>(null);

  const handleResizeStart = (
    direction: ResizeDirection,
    e: React.MouseEvent,
  ) => {
    if (!targetRef.current) return;

    const parentElement =
      targetRef.current.parentElement ?? document.getElementById("canvas");
    if (!parentElement) return;

    resizeState.current = {
      direction,
      startRect: targetRef.current.getBoundingClientRect(),
      startPos: { x: e.clientX, y: e.clientY },
      parentElement,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleResizeEnd, { once: true });
    document.body.style.userSelect = "none";
    document.body.style.cursor = `${direction}-resize`;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizeState.current) return;

    const { direction, startRect, parentElement } = resizeState.current;
    const { clientX, clientY } = e;

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

    const minSize = 20;
    newWidth = Math.max(minSize, newWidth);
    newHeight = Math.max(minSize, newHeight);

    const parentRect = parentElement.getBoundingClientRect();
    const updatedStyles: Partial<React.CSSProperties> = {
      ...element.styles,
    };

    const parentContentWidth = parentElement.clientWidth;
    const parentContentHeight = parentElement.clientHeight;

    updatedStyles.width = `${Math.min((newWidth / parentContentWidth) * 100, 100).toFixed(2)}%`;
    updatedStyles.height = `${Math.min((newHeight / parentContentHeight) * 100, 100).toFixed(2)}%`;
    if (direction === "s" || direction === "n")
      updatedStyles.width = element.styles?.width;
    else if (direction === "e" || direction === "w")
      updatedStyles.height = element.styles?.height;

    if (element.styles?.position === "absolute") {
      updatedStyles.left = `${(((newLeft - parentRect.left) / parentContentWidth) * 100).toFixed(2)}%`;
      updatedStyles.top = `${(((newTop - parentRect.top) / parentContentHeight) * 100).toFixed(2)}%`;
    }

    updateElement(element.id, { styles: updatedStyles });
  };

  const handleResizeEnd = () => {
    resizeState.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  };

  useEffect(() => {
    return () => {
      if (resizeState.current) {
        handleResizeEnd();
      }
    };
  }, []);

  const resizeHandles: ResizeDirection[] = [
    "n",
    "s",
    "e",
    "w",
    "ne",
    "nw",
    "se",
    "sw",
  ];

  return (
    <div
      ref={targetRef}
      className="relative"
      style={{
        width: element.styles?.width || "auto",
        height: element.styles?.height || "auto",
      }}
      id={element.id}
      onDoubleClick={(e) => {
        e.stopPropagation();
        handleDoubleClick(e, element);
      }}
    >
      {children}
      {element.isSelected && (
        <>
          {resizeHandles.map((dir) => (
            <ResizeHandle
              key={dir}
              direction={dir}
              onResizeStart={handleResizeStart}
            />
          ))}
          <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none" />
        </>
      )}
      {element.isHovered && !element.isDraggedOver && !element.isSelected && (
        <div className="pointer-events-none absolute inset-0 border border-black z-20" />
      )}
      {element.isDraggedOver && !element.isSelected && (
        <div className="pointer-events-none absolute border-dashed inset-0 border-2 border-green-600 z-20" />
      )}
    </div>
  );
}
