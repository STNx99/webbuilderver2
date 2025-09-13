import React from "react";
import { EditorElement } from "@/types/global.type";
import ElementLoader from "@/components/editor/ElementLoader";
import ElementLoading from "@/components/editor/skeleton/ElementLoading";
import { Button } from "@/components/ui/button";

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
  return (
    <div
      className={`h-full w-full overflow-auto bg-background p-2 ${
        isDraggingOver ? "bg-primary/10" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      id="canvas"
    >
      {isLoading ? (
        <ElementLoading count={6} variant="mixed" />
      ) : (
        <ElementLoader />
      )}
      {!selectedElement && (
        <Button className="w-full h-6" onClick={addNewSection}>
          + Add new section
        </Button>
      )}
    </div>
  );
};

export default EditorCanvas;
