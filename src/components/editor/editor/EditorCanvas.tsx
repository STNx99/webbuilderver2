import React, { useEffect, useRef } from "react";
import { EditorElement } from "@/types/global.type";
import ElementLoader from "@/components/editor/ElementLoader";
import ElementLoading from "@/components/editor/skeleton/ElementLoading";
import { Button } from "@/components/ui/button";
import { KeyboardEvent as KeyboardEventClass } from "@/lib/utils/element/keyBoardEvents";

type EditorCanvasProps = {
  isDraggingOver: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isLoading: boolean;
  selectedElement: EditorElement | null;
  addNewSection: () => void;
};

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  isDraggingOver,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  isLoading,
  selectedElement,
  addNewSection,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const keyboardEvent = new KeyboardEventClass();

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
      className={`h-full w-full flex flex-col bg-background p-2 ${
        isDraggingOver ? "bg-primary/10" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      id="canvas"
      tabIndex={0}
    >
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <ElementLoading count={6} variant="mixed" />
        ) : (
          <ElementLoader />
        )}
        {!selectedElement && (
          <Button
            className="fixed bottom-2 left-2 right-2 h-6 z-10"
            onClick={addNewSection}
          >
            + Add new section
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
