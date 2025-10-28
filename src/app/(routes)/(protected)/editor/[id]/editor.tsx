"use client";
import React, { useState, useEffect } from "react";
import EditorHeader from "@/components/editor/editor/EditorHeader";
import PreviewContainer from "@/components/editor/editor/PreviewContainer";
import EditorCanvas from "@/components/editor/editor/EditorCanvas";
import { useEditor } from "@/hooks";
import { useAuth } from "@clerk/nextjs";

type EditorProps = {
  id: string;
  pageId: string;
};

export default function Editor({ id, pageId }: EditorProps) {
  const { userId } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const effectiveUserId = userId || "guest";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    currentView,
    setCurrentView,
    isDraggingOver,
    isLoading,
    selectedElement,
    handleDrop,
    handlePageNavigation,
    handleDragOver,
    handleDragLeave,
    addNewSection,
    collab,
  } = useEditor(id, pageId, {
    enableCollab: isMounted && !!effectiveUserId,
    userId: effectiveUserId,
  });

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-background text-foreground relative">
      <EditorHeader
        handlePageNavigation={handlePageNavigation}
        currentView={currentView}
        setCurrentView={setCurrentView}
        projectId={id}
      />
      <PreviewContainer currentView={currentView} isLoading={isLoading}>
        <EditorCanvas
          isDraggingOver={isDraggingOver}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          isLoading={isLoading}
          selectedElement={selectedElement || null}
          addNewSection={addNewSection}
          userId={effectiveUserId}
          sendMessage={collab.sendMessage}
        />
      </PreviewContainer>
    </div>
  );
}
