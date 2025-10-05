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
import { customComps } from "@/lib/customcomponents/customComponents";
interface ElementLoaderProps {
  elements?: EditorElement[]; 
  data?: any;
}

export default function ElementLoader({
  elements,
  data,
}: ElementLoaderProps = {}) {
  const { currentPage } = usePageStore();
  const {
    draggedOverElement,
    draggingElement,
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
      data,
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
    const elementType = e.dataTransfer.getData("elementType");
    const customElement = e.dataTransfer.getData("customComponentName");
    if (elementType) {
      const newElement = elementHelper.createElement.create(
        elementType as ElementType,
        element.projectId,
        undefined,
        element.pageId,
      );
      if (newElement) insertElement(element, newElement);
    }
    if (customElement) {
      try {
        const customComp = customComps[parseInt(customElement)];
        const newElement = elementHelper.createElement.createFromTemplate(
          customComp,
          element.projectId,
          element.pageId,
        );
        if (newElement) insertElement(element, newElement);
        console.log("Inserting custom component:", newElement);
      } catch (error) {
        console.error("Failed to parse custom component data:", error);
      }
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
