import useElementStore from "@/globalstore/elementstore";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/global.type";
import React, { ReactNode, useRef, useState, useEffect } from "react";

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
        e.preventDefault();
        e.stopPropagation();
        onResizeStart(direction, e);
    };

    const commonClasses =
        "absolute bg-blue-500 rounded-full w-3 h-3 border-2 border-white";

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

    const { updateElement } = useElementStore();

    const handleResizeStart = (
        direction: ResizeDirection,
        e: React.MouseEvent,
    ) => {
        setResizeDirection(direction);
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            startDimensionsPx.current = {
                width: rect.width,
                height: rect.height,
            };
            startMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (
            !resizeDirection ||
            !startMousePos.current ||
            !startDimensionsPx.current
        ) {
            return;
        }

        const getEffectiveParentDimensions = () => {
            const parentEl = element.parentId
                ? document.getElementById(element.parentId)
                : document.getElementById("canvas");

            if (parentEl) {
                return {
                    width: parentEl.offsetWidth, // Always returns pixels
                    height: parentEl.offsetHeight,
                };
            }

            const canvas = document.getElementById("canvas");
            if (canvas) {
                return {
                    width: canvas.offsetWidth,
                    height: canvas.offsetHeight,
                };
            }

            return {
                width: window.innerWidth,
                height: window.innerHeight,
            };
        };

        const { width: effectiveParentWidth, height: effectiveParentHeight } =
            getEffectiveParentDimensions();

        // Calculate mouse movement
        const dx = e.clientX - startMousePos.current.x;
        const dy = e.clientY - startMousePos.current.y;

        // Calculate new dimensions
        let newWidthPx = startDimensionsPx.current.width;
        let newHeightPx = startDimensionsPx.current.height;

        // Apply resize direction
        if (resizeDirection.includes("e")) newWidthPx += dx;
        if (resizeDirection.includes("w")) newWidthPx -= dx;
        if (resizeDirection.includes("s")) newHeightPx += dy;
        if (resizeDirection.includes("n")) newHeightPx -= dy;

        // Ensure minimum dimensions
        newWidthPx = Math.max(1, newWidthPx);
        newHeightPx = Math.max(1, newHeightPx);

        // Convert to percentages with safeguards
        const MIN_SIZE_PERCENT = 2;
        const newWidthPercent = Math.max(
            MIN_SIZE_PERCENT,
            (newWidthPx / effectiveParentWidth) * 100,
        );
        const newHeightPercent = Math.max(
            MIN_SIZE_PERCENT,
            (newHeightPx / effectiveParentHeight) * 100,
        );

        updateElement(element.id, {
            styles: {
                ...element.styles,
                // Store both representations
                width: `${newWidthPercent}%`,
                height: `${newHeightPercent}%`,
            },
        });
    };

    const handleResizeEnd = () => {
        setResizeDirection(null);
        startMousePos.current = null;
        startDimensionsPx.current = null;
    };

    useEffect(() => {
        if (resizeDirection) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleResizeEnd);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleResizeEnd);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleResizeEnd);
        };
    }, [resizeDirection]);

    return (
        <div
            ref={targetRef}
            className="relative"
            style={{
                width: element.styles?.width,
                height: element.styles?.height,
            }}
        >
            {children}

            {element.isSelected && (
                <>
                    {["n", "s", "e", "w", "ne", "nw", "se", "sw"].map((dir) => (
                        <ResizeHandle
                            key={dir}
                            direction={dir as ResizeDirection}
                            onResizeStart={handleResizeStart}
                        />
                    ))}
                </>
            )}
        </div>
    );
}
