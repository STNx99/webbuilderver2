import React, { useEffect, useRef, useMemo, useState } from "react";
import { MousePointer } from "lucide-react";
import { EditorElement } from "@/types/global.type";
import ElementLoader from "@/components/editor/ElementLoader";
import { Button } from "@/components/ui/button";
import { KeyboardEvent as KeyboardEventClass } from "@/lib/utils/element/keyBoardEvents";
import { useMouseTracking } from "@/hooks/realtime/use-mouse-tracking";
import { useMouseStore } from "@/globalstore/mousestore";
import * as Y from "yjs";

type EditorCanvasProps = {
  isDraggingOver: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isLoading: boolean;
  selectedElement: EditorElement | null;
  addNewSection: () => void;
  userId: string;
  sendMessage?: (message: any) => boolean;
  isReadOnly?: boolean;
  isLocked?: boolean;
  ydoc?: Y.Doc | null;
  provider?: any;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
};

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  isDraggingOver,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  isLoading,
  selectedElement,
  addNewSection,
  userId,
  sendMessage,
  isReadOnly = false,
  isLocked = false,
  ydoc,
  provider,
  iframeRef,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const keyboardEvent = new KeyboardEventClass();
  const { mousePositions, remoteUsers, users } = useMouseStore();
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    keyboardEvent.setReadOnly(isReadOnly);
    keyboardEvent.setLocked(isLocked);
  }, [isReadOnly, isLocked, keyboardEvent]);

  // Track scroll position of inner content container
  useEffect(() => {
    if (!innerContentRef.current) return;

    const handleScroll = () => {
      setScrollOffset({
        x: innerContentRef.current?.scrollLeft || 0,
        y: innerContentRef.current?.scrollTop || 0,
      });
    };

    const container = innerContentRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Only use old mouse tracking if not using Yjs (sendMessage prop available)
  useMouseTracking({
    canvasRef,
    sendMessage: sendMessage || (() => false),
    userId,
    enabled: !ydoc,
  });

  // Sync awareness cursor position if using Yjs
  useEffect(() => {
    if (!provider || !provider.awareness) return;

    let logCount = 0;
    let lastX = -1;
    let lastY = -1;

    // Determine if we're tracking mouse in an iframe or regular canvas
    const isIframe = iframeRef && iframeRef.current;
    const targetDoc = isIframe ? iframeRef.current?.contentDocument : document;

    if (!targetDoc) {
      console.warn(
        "[EditorCanvas] No target document available for mouse tracking",
      );
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // For iframe: coordinates are already relative to iframe content
      // For canvas: need to calculate relative to canvas bounds
      let x: number;
      let y: number;

      if (isIframe) {
        // Inside iframe - coordinates are already relative to iframe document
        x = e.clientX;
        y = e.clientY;
        logCount++;

        if (logCount % 10 === 0) {
          console.log(
            "[EditorCanvas] 🖱️ Iframe mouse move - clientX:",
            e.clientX,
            "clientY:",
            e.clientY,
          );
        }
      } else {
        // Regular canvas tracking
        if (!canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        if (!canvasRect) return;

        logCount++;

        // Only send cursor if mouse is actually inside the canvas bounds
        const isInsideCanvas =
          e.clientX >= canvasRect.left &&
          e.clientX <= canvasRect.right &&
          e.clientY >= canvasRect.top &&
          e.clientY <= canvasRect.bottom;

        if (logCount % 10 === 0) {
          console.log(
            "[EditorCanvas] Mouse move event - clientX:",
            e.clientX,
            "clientY:",
            e.clientY,
            "canvasRect:",
            {
              left: canvasRect.left,
              right: canvasRect.right,
              top: canvasRect.top,
              bottom: canvasRect.bottom,
            },
            "isInsideCanvas:",
            isInsideCanvas,
          );
        }

        if (!isInsideCanvas) {
          if (logCount % 10 === 0) {
            console.log(
              "[EditorCanvas] ⚠️ Mouse outside canvas bounds, skipping update",
            );
          }
          return;
        }

        x = e.clientX - canvasRect.left;
        y = e.clientY - canvasRect.top;
      }

      if (logCount % 10 === 0) {
        console.log(
          "[EditorCanvas] ✅ Calculated position:",
          { x, y },
          "lastPosition:",
          { lastX, lastY },
        );
      }

      // Only update if position actually changed
      if (lastX === x && lastY === y) {
        return;
      }
      lastX = x;
      lastY = y;

      if (logCount % 10 === 0) {
        console.log("[EditorCanvas] 📤 Sending cursor to awareness:", { x, y });
      }

      try {
        provider.awareness.setLocalStateField("cursor", { x, y });
      } catch (err) {
        console.warn("[EditorCanvas] Error updating awareness cursor:", err);
      }
    };

    const handleMouseLeave = () => {
      console.log("[EditorCanvas] Mouse left canvas");
      try {
        provider.awareness.setLocalStateField("cursor", null);
      } catch (err) {
        console.warn("[EditorCanvas] Error clearing cursor on leave:", err);
      }
    };

    const trackingTarget = isIframe ? iframeRef.current : canvasRef.current;
    if (!trackingTarget) return;

    const targetName = isIframe ? "iframe" : "canvas";
    console.log(`[EditorCanvas] Attaching mouse listeners to ${targetName}`);

    targetDoc.addEventListener("mousemove", handleMouseMove);
    if (!isIframe) {
      // Only attach mouseleave to regular canvas
      trackingTarget.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      console.log(`[EditorCanvas] Removing mouse listeners from ${targetName}`);
      targetDoc.removeEventListener("mousemove", handleMouseMove);
      if (!isIframe) {
        trackingTarget.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [provider, iframeRef]);

  // Memoize remote cursors for performance
  const remoteCursors = useMemo(() => {
    if (ydoc && remoteUsers) {
      const cursors = Object.entries(remoteUsers)
        .filter(([uid]) => uid !== userId)
        .map(([uid, pos]) => {
          const x = typeof pos.x === "number" ? pos.x : 0;
          const y = typeof pos.y === "number" ? pos.y : 0;

          const cursor = {
            uid,
            // Adjust for scroll position of inner container
            x: x - scrollOffset.x,
            y: y - scrollOffset.y,
            userName: users[uid]?.userName || `User ${uid.slice(0, 8)}`,
          };

          console.log(
            "[EditorCanvas] Remote cursor for",
            uid.slice(0, 8),
            "- original:",
            { x, y },
            "after scroll adjustment:",
            { x: cursor.x, y: cursor.y },
            "scrollOffset:",
            scrollOffset,
          );

          return cursor;
        });

      if (cursors.length > 0) {
        console.log(
          "[EditorCanvas] Rendering",
          cursors.length,
          "remote cursors from remoteUsers:",
          Object.keys(remoteUsers),
        );
      }

      return cursors;
    }
    console.log(
      "[EditorCanvas] Not rendering remote cursors - ydoc:",
      !!ydoc,
      "remoteUsers:",
      remoteUsers ? Object.keys(remoteUsers) : "null",
    );
    return [];
  }, [ydoc, remoteUsers, userId, users, scrollOffset]);

  // Memoize websocket cursors for performance
  const webSocketCursors = useMemo(() => {
    if (!ydoc && mousePositions) {
      return Object.entries(mousePositions)
        .filter(([uid]) => uid !== userId)
        .map(([uid, pos]) => ({
          uid,
          x: typeof pos.x === "number" ? pos.x - scrollOffset.x : 0,
          y: typeof pos.y === "number" ? pos.y - scrollOffset.y : 0,
          userName: users[uid]?.userName || `User ${uid.slice(0, 8)}`,
        }));
    }
    return [];
  }, [ydoc, mousePositions, userId, users, scrollOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "c":
            keyboardEvent.copyElement();
            break;
          case "v":
            keyboardEvent.pasteElement();
            break;
          case "x":
            keyboardEvent.cutElement();
            break;
          case "z":
            keyboardEvent.undo();
            break;
          case "y":
            keyboardEvent.redo();
            break;
        }
      } else if (e.key === "Delete") {
        keyboardEvent.deleteElement();
      } else if (e.key === "Escape") {
        keyboardEvent.deselectAll();
      }
    };

    canvas.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboardEvent]);

  return (
    <div
      ref={canvasRef}
      className={`h-full relative flex flex-col bg-background  ${
        isDraggingOver ? "bg-primary/10" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      id="canvas"
      tabIndex={0}
    >
      {(ydoc ? remoteCursors : webSocketCursors).map(
        ({ uid, x, y, userName }) => (
          <div
            key={`cursor-${uid}`}
            className="absolute pointer-events-none z-9999 flex flex-col items-start gap-1 transition-all duration-75"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-2px, -2px)",
            }}
          >
            <MousePointer className="w-5 h-5 text-blue-500 drop-shadow-lg" />
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              {userName}
            </div>
          </div>
        ),
      )}
      <div
        ref={innerContentRef}
        className="overflow-x-hidden h-full w-full p-4"
      >
        {isLoading ? null : (
          <ElementLoader isReadOnly={isReadOnly} isLocked={isLocked} />
        )}
        {!selectedElement && (
          <Button
            className="mb-4 w-full"
            onClick={addNewSection}
            disabled={isReadOnly || isLocked}
          >
            + Add new section
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
