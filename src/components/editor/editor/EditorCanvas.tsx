import React, { useEffect, useRef, useMemo } from "react";
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
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const keyboardEvent = new KeyboardEventClass();
  const { mousePositions, remoteUsers, users } = useMouseStore();

  useEffect(() => {
    keyboardEvent.setReadOnly(isReadOnly);
    keyboardEvent.setLocked(isLocked);
  }, [isReadOnly, isLocked, keyboardEvent]);

  // Only use old mouse tracking if not using Yjs (sendMessage prop available)
  useMouseTracking({
    canvasRef,
    sendMessage: sendMessage || (() => false),
    userId,
    enabled: !ydoc,
  });

  // Sync awareness cursor position if using Yjs
  useEffect(() => {
    if (!provider || !provider.awareness || !canvasRef.current) return;

    let lastLogTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Log occasionally to avoid spam
      const now = Date.now();
      if (now - lastLogTime > 500) {
        console.log("[EditorCanvas] Setting local cursor:", { x, y }, "rect:", {
          left: rect.left,
          top: rect.top,
          clientX: e.clientX,
          clientY: e.clientY,
        });
        lastLogTime = now;
      }

      try {
        provider.awareness.setLocalStateField("cursor", { x, y });
      } catch (err) {
        console.warn("[EditorCanvas] Error updating awareness cursor:", err);
      }
    };

    canvasRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [provider]);

  // Memoize remote cursors for performance
  const remoteCursors = useMemo(() => {
    if (ydoc && remoteUsers) {
      const cursors = Object.entries(remoteUsers)
        .filter(([uid]) => uid !== userId)
        .map(([uid, pos]) => {
          console.log(`[EditorCanvas] Processing cursor for ${uid}:`, {
            pos,
            x: typeof pos.x === "number" ? pos.x : "not a number",
            y: typeof pos.y === "number" ? pos.y : "not a number",
          });
          return {
            uid,
            x: typeof pos.x === "number" ? pos.x : 0,
            y: typeof pos.y === "number" ? pos.y : 0,
            userName: users[uid]?.userName || `User ${uid.slice(0, 8)}`,
          };
        });
      console.log("[EditorCanvas] Final cursors to render:", cursors);
      return cursors;
    }
    return [];
  }, [ydoc, remoteUsers, userId, users]);

  // Memoize websocket cursors for performance
  const webSocketCursors = useMemo(() => {
    if (!ydoc && mousePositions) {
      return Object.entries(mousePositions)
        .filter(([uid]) => uid !== userId)
        .map(([uid, pos]) => ({
          uid,
          x: typeof pos.x === "number" ? pos.x : 0,
          y: typeof pos.y === "number" ? pos.y : 0,
          userName: users[uid]?.userName || `User ${uid.slice(0, 8)}`,
        }));
    }
    return [];
  }, [ydoc, mousePositions, userId, users]);

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
      {/* Display remote user cursors from Yjs awareness or WebSocket */}
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
      <div className="overflow-x-hidden h-full w-full p-4">
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
