import React, { useEffect, useRef } from "react";
import { MousePointer } from "lucide-react";
import { EditorElement } from "@/types/global.type";
import ElementLoader from "@/components/editor/ElementLoader";
import { Button } from "@/components/ui/button";
import { KeyboardEvent as KeyboardEventClass } from "@/lib/utils/element/keyBoardEvents";
import { useMouseTracking } from "@/hooks/realtime/use-mouse-tracking";
import { useMouseStore } from "@/globalstore/mousestore";

type EditorCanvasProps = {
  isDraggingOver: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isLoading: boolean;
  selectedElement: EditorElement | null;
  addNewSection: () => void;
  userId: string;
  sendMessage: (message: any) => boolean;
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
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const keyboardEvent = new KeyboardEventClass();
  const { mousePositions, users } = useMouseStore();

  useMouseTracking({
    canvasRef,
    sendMessage,
    userId,
    enabled: true,
  });

  useEffect(() => {}, [mousePositions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(
        "Key pressed:",
        e.key,
        "Ctrl:",
        e.ctrlKey,
        "Meta:",
        e.metaKey,
        "Key:",
        e.key,
      );
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "c":
            e.preventDefault();
            keyboardEvent.copyElement();
            break;
          case "v":
            e.preventDefault();
            keyboardEvent.pasteElement();
            break;
          case "x":
            e.preventDefault();
            keyboardEvent.cutElement();
            break;
          case "z":
            e.preventDefault();
            keyboardEvent.undo();
            break;
          case "y":
            e.preventDefault();
            keyboardEvent.redo();
            break;
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        keyboardEvent.deleteElement();
      } else if (e.key === "Escape") {
        e.preventDefault();
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
      {Object.entries(mousePositions).map(([uid, pos]) => {
        if (uid === userId) return null;
        return (
          <div
            key={uid}
            className="absolute pointer-events-none z-[9999] flex flex-col items-start gap-1"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-2px, -2px)",
            }}
          >
            <MousePointer className="w-5 h-5 text-blue-500 drop-shadow-lg" />
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              {users[uid]?.userName || uid.slice(0, 8)}
            </div>
          </div>
        );
      })}
      <div className="overflow-x-hidden h-full w-full p-4">
        {isLoading ? null : <ElementLoader />}
        {!selectedElement && (
          <Button className="mb-4 w-full " onClick={addNewSection}>
            + Add new section
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
