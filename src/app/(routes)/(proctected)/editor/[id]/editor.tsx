"use client";
import React from "react";
import EditorHeader from "@/components/editor/editor/EditorHeader";
import PreviewContainer from "@/components/editor/editor/PreviewContainer";
import EditorCanvas from "@/components/editor/editor/EditorCanvas";
import { useEditor } from "@/hooks/useEditor";

type EditorProps = {
  id: string;
  pageId: string;
};

export default function Editor({ id, pageId }: EditorProps) {
  const {
    currentView,
    setCurrentView,
    isDraggingOver,
    isLoading,
    filteredElements,
    selectedElement,
    handleDrop,
    handlePageNavigation,
    handleDragOver,
    handleDragLeave,
    addNewSection,
  } = useEditor(id, pageId);

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-background text-foreground relative">
      <EditorHeader
        handlePageNavigation={handlePageNavigation}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <PreviewContainer currentView={currentView} isLoading={isLoading}>
        <EditorCanvas
          isDraggingOver={isDraggingOver}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          isLoading={isLoading}
          elements={filteredElements || []}
          selectedElement={selectedElement || null}
          addNewSection={addNewSection}
        />
      </PreviewContainer>
    </div>
  );
}
