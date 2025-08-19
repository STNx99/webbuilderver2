"use client";

import { useElementStore } from "@/globalstore/elementstore";
import { useElementHandler } from "@/hooks/useElementHandler";
import { cn } from "@/lib/utils";
import type { EditorElement } from "@/types/global.type";
import type React from "react";
import { type ReactNode, useRef, useState, useEffect } from "react";

type ResizeDirection = "se" | "sw" | "ne" | "nw" | "n" | "s" | "e" | "w";

interface ResizeHandlerProps {
    element: EditorElement;
    children: ReactNode;
}

interface ResizeHandleProps {
    direction: ResizeDirection;
    onResizeStart: (direction: ResizeDirection, e: React.MouseEvent) => void;
}

function ResizeHandle({ direction, onResizeStart }: ResizeHandleProps) {
    const handleMouseDown = (e: React.MouseEvent) => {
        // Only prevent default and stop propagation for left mouse button
        if (e.button === 0) {
            e.preventDefault();
            e.stopPropagation();
            onResizeStart(direction, e);
        }
    };

    const commonClasses =
        "absolute bg-blue-500 rounded-full w-3 h-3 border-2 border-white z-10";

    const directionalClasses = {
        n: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
        s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
        e: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-e-resize",
        w: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-w-resize",
        ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
        nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
        se: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-se-resize",
        sw: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
    }[direction];

    return (
        <div
            className={cn(
                commonClasses,
                directionalClasses,
                "hover:bg-blue-600 active:bg-blue-700 active:scale-125",
            )}
            onMouseDown={handleMouseDown}
        />
    );
}

// Helper function to parse CSS values
const parseCSSValue = (value: string | number | undefined): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
};

// Helper function to get computed margins
const getElementMargins = (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);
    return {
        top: parseCSSValue(computedStyle.marginTop),
        right: parseCSSValue(computedStyle.marginRight),
        bottom: parseCSSValue(computedStyle.marginBottom),
        left: parseCSSValue(computedStyle.marginLeft),
    };
};

// Helper function to get element's available space considering margins
const getAvailableSpace = (
    element: HTMLElement,
    parentElement: HTMLElement | null,
) => {
    if (!parentElement) {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    const margins = getElementMargins(element);
    const parentRect = parentElement.getBoundingClientRect();

    return {
        width: parentRect.width - margins.left - margins.right,
        height: parentRect.height - margins.top - margins.bottom,
    };
};

export default function ResizeHandler({
    element,
    children,
}: ResizeHandlerProps) {
    const [resizeDirection, setResizeDirection] =
        useState<ResizeDirection | null>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const startMousePos = useRef<{ x: number; y: number } | null>(null);
    const startDimensionsPx = useRef<{ width: number; height: number } | null>(
        null,
    );
    const startMargins = useRef<{
        top: number;
        right: number;
        bottom: number;
        left: number;
    } | null>(null);
    const availableSpace = useRef<{ width: number; height: number } | null>(
        null,
    );

    const { updateElement } = useElementStore();
    const { handleDoubleClick } = useElementHandler();
    const handleResizeStart = (
        direction: ResizeDirection,
        e: React.MouseEvent,
    ) => {
        setResizeDirection(direction);
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            const margins = getElementMargins(targetRef.current);

            // Get parent element for available space calculation
            const parentElement = element.parentId
                ? document.getElementById(element.parentId)
                : document.getElementById("canvas");

            const available = getAvailableSpace(
                targetRef.current,
                parentElement,
            );

            startDimensionsPx.current = {
                width: rect.width,
                height: rect.height,
            };
            startMargins.current = margins;
            availableSpace.current = available;
            startMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (
            !resizeDirection ||
            !startMousePos.current ||
            !startDimensionsPx.current ||
            !startMargins.current ||
            !availableSpace.current
        ) {
            return;
        }

        const { clientX, clientY } = e;
        const { x: startX, y: startY } = startMousePos.current;
        const { width: startWidth, height: startHeight } =
            startDimensionsPx.current;
        const margins = startMargins.current;
        const { width: availableWidth, height: availableHeight } =
            availableSpace.current;

        const dx = clientX - startX;
        const dy = clientY - startY;

        let newWidthPx = startWidth;
        let newHeightPx = startHeight;

        // Apply resize based on direction
        if (resizeDirection.includes("e")) newWidthPx += dx;
        if (resizeDirection.includes("w")) newWidthPx -= dx;
        if (resizeDirection.includes("s")) newHeightPx += dy;
        if (resizeDirection.includes("n")) newHeightPx -= dy;

        // Ensure minimum size
        newWidthPx = Math.max(20, newWidthPx);
        newHeightPx = Math.max(20, newHeightPx);

        // Calculate maximum allowed dimensions considering margins
        const maxWidth = availableWidth;
        const maxHeight = availableHeight;

        // Constrain to available space
        newWidthPx = Math.min(newWidthPx, maxWidth);
        newHeightPx = Math.min(newHeightPx, maxHeight);

        // Convert to percentage if parent exists, otherwise use pixels
        const parentElement = element.parentId
            ? document.getElementById(element.parentId)
            : document.getElementById("canvas");

        let finalWidth: string;
        let finalHeight: string;

        if (parentElement && element.parentId) {
            // For child elements, use percentage relative to parent's content area
            const parentRect = parentElement.getBoundingClientRect();
            const parentContentWidth =
                parentRect.width - margins.left - margins.right;
            const parentContentHeight =
                parentRect.height - margins.top - margins.bottom;

            const widthPercent = Math.max(
                1,
                Math.min(100, (newWidthPx / parentContentWidth) * 100),
            );
            const heightPercent = Math.max(
                1,
                Math.min(100, (newHeightPx / parentContentHeight) * 100),
            );

            finalWidth = `${widthPercent.toFixed(2)}%`;
            finalHeight = `${heightPercent.toFixed(2)}%`;
        } else {
            // For root elements, use pixels or viewport units
            finalWidth = `${newWidthPx}px`;
            finalHeight = `${newHeightPx}px`;
        }

        const updatedStyles: Partial<React.CSSProperties> = {
            ...element.styles,
        };

        const isHorizontalResize =
            resizeDirection.includes("w") || resizeDirection.includes("e");
        const isVerticalResize =
            resizeDirection.includes("n") || resizeDirection.includes("s");

        if (isHorizontalResize) {
            updatedStyles.width = finalWidth;
        }
        if (isVerticalResize) {
            updatedStyles.height = finalHeight;
        }

        // Handle position adjustments for corner/edge resizing from top/left
        if (
            resizeDirection.includes("w") &&
            element.styles?.position === "absolute"
        ) {
            const currentLeft = parseCSSValue(element.styles.left);
            const deltaX = startWidth - newWidthPx;
            updatedStyles.left = `${currentLeft + deltaX}px`;
        }

        if (
            resizeDirection.includes("n") &&
            element.styles?.position === "absolute"
        ) {
            const currentTop = parseCSSValue(element.styles.top);
            const deltaY = startHeight - newHeightPx;
            updatedStyles.top = `${currentTop + deltaY}px`;
        }

        updateElement(element.id, { styles: updatedStyles });
    };

    const handleResizeEnd = () => {
        setResizeDirection(null);
        startMousePos.current = null;
        startDimensionsPx.current = null;
        startMargins.current = null;
        availableSpace.current = null;
    };

    useEffect(() => {
        if (resizeDirection) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleResizeEnd);

            // Prevent text selection during resize
            document.body.style.userSelect = "none";
            document.body.style.cursor = `${resizeDirection}-resize`;
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleResizeEnd);

            // Restore text selection
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleResizeEnd);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };
    }, [resizeDirection]);

    return (
        <div
            ref={targetRef}
            className={cn("relative")}
            style={{
                    width: element.styles?.width || "auto",
                    height: element.styles?.height || "auto",
                }}
            id={element.id}
            onDoubleClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDoubleClick(e, element);
            }}
        >
            {children}
            {element.isSelected && (
                <div>
                    {["n", "s", "e", "w", "ne", "nw", "se", "sw"].map((dir) => (
                        <ResizeHandle
                            key={dir}
                            direction={dir as ResizeDirection}
                            onResizeStart={handleResizeStart}
                        />
                    ))}

                    <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none" />
                </div>
            )}
            {(element.isHovered && !element.isDraggedOver && !element.isSelected) && (
              <div className="pointer-events-none absolute inset-0 border border-black z-20" />
            )}
            {(element.isDraggedOver && !element.isSelected) && (
              <div className="pointer-events-none absolute border-dashed inset-0 border-2 border-green-600 z-20" />
            )}
        </div>
    );
}
