import { EditorElement, ElementType } from "@/types/global.type";
import React from "react";
import { getComponentMap } from "@/constants/elements";
import ResizeHandler from "./resizehandler/ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { usePageStore } from "@/globalstore/pagestore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementStore } from "@/globalstore/elementstore";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
interface ElementLoaderProps {
  elements?: EditorElement[];
}

export default function ElementLoader({ elements }: ElementLoaderProps = {}) {
  const { currentPage } = usePageStore();
  const {
    draggedOverElement,
    draggingElement,
    setSelectedElement,
    setDraggingElement,
    setDraggedOverElement,
  } = useSelectionStore();
  const { elements: allElements, insertElement } = useElementStore();

  const filteredElements =
    elements ||
    elementHelper.filterElementByPageId(
      allElements,
      currentPage?.Id || undefined,
    );
  const renderElement = (element: EditorElement) => {
    const commonProps: EditorComponentProps = {
      element,
    };

    const Component = getComponentMap(commonProps);
    return Component ? <Component {...commonProps} /> : null;
  };

  const handleHover = (e: React.DragEvent, element: EditorElement) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverElement(element);
  };

  const handleDrop = (e: React.DragEvent, element: EditorElement) => {
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer.getData("elementType");
    if (data) {
      const newElement = elementHelper.createElement.create(
        data as ElementType,
        element.projectId,
        undefined,
        element.pageId,
      );
      if (newElement) insertElement(element, newElement);
    }
    setDraggedOverElement(undefined);
    setDraggingElement(undefined);
  };

  return (
    <LayoutGroup>
      {filteredElements.map((element) => (
        <ResizeHandler element={element} key={element.id}>
          <motion.div className="w-full h-full" key={element.id}>
            <EditorContextMenu element={element}>
              {renderElement(element)}
            </EditorContextMenu>
            <AnimatePresence>
              {draggedOverElement?.id === element.id && (
                <motion.div
                  onDragOver={(e) => handleHover(e, element)}
                  onDrop={(e) => handleDrop(e, element)}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 0.7,
                    height: 50,
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.1 }}
                  className="bg-blue-400 border-2 border-dashed border-blue-600 flex items-center justify-center text-blue-800 font-semibold"
                  style={{ width: "100%" }}
                >
                  {draggingElement ? "Swap Here" : "Insert Here"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </ResizeHandler>
      ))}
    </LayoutGroup>
  );
}
