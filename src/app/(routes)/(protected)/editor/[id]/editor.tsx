"use client";
import React, { useState, useEffect } from "react";
import EditorHeader from "@/components/editor/editor/EditorHeader";
import PreviewContainer from "@/components/editor/editor/PreviewContainer";
import EditorCanvas from "@/components/editor/editor/EditorCanvas";
import { useEditor } from "@/hooks";
import { useAuth } from "@clerk/nextjs";
import * as Y from "yjs";

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
    isReadOnly,
    isLocked,
    collab,
  } = useEditor(id, pageId, {
    enableCollab: isMounted && !!effectiveUserId,
    enableYjsCollab: true,
    userId: effectiveUserId,
  });

  // Extract Yjs-specific properties if available
  const ydoc = collab.type === "yjs" ? (collab.ydoc as Y.Doc | null) : null;
  const provider = collab.type === "yjs" ? collab.provider : null;
  const sendMessage =
    collab.type === "websocket" ? collab.sendMessage : undefined;

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-background text-foreground relative">
      <EditorHeader
        handlePageNavigation={handlePageNavigation}
        currentView={currentView}
        setCurrentView={setCurrentView}
        projectId={id}
        isConnected={collab.isConnected}
        isSynced={collab.isSynced}
        ydoc={ydoc}
        collabType={collab.type}
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
          sendMessage={sendMessage}
          isReadOnly={isReadOnly}
          isLocked={isLocked}
          ydoc={ydoc}
          provider={provider}
        />
      </PreviewContainer>
    </div>
  );
}
