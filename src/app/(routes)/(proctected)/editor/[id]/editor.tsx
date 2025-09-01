"use client";
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
    isLoadingElements,
    filteredElements,
    selectedElement,
    handleDrop,
    handlePageNavigation,
    handleDragOver,
    handleDragLeave,
    addNewSection,
  } = useEditor(id, pageId);

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground relative">
      <EditorHeader
        handlePageNavigation={handlePageNavigation}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <PreviewContainer currentView={currentView}>
        <EditorCanvas
          isDraggingOver={isDraggingOver}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          isLoading={isLoadingElements}
          elements={filteredElements || []}
          selectedElement={selectedElement || null}
          addNewSection={addNewSection}
        />
      </PreviewContainer>
    </div>
  );
}
