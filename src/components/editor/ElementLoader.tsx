import { EditorElement, ElementType } from "@/types/global.type";
import React, { useCallback } from "react";
import { getComponentMap } from "@/constants/elements";
import ResizeHandler from "./resizehandler/ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { usePageStore } from "@/globalstore/pagestore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementStore } from "@/globalstore/elementstore";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { LayoutGroup } from "framer-motion";
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

  const handleHover = useCallback(
    (e: React.DragEvent, element: EditorElement) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedOverElement?.id !== element.id) {
        setDraggedOverElement(element);
      }
    },
    [draggedOverElement, setDraggedOverElement],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, element: EditorElement) => {
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
        } catch (error) {
          // Silent error handling
        }
      }

      setDraggedOverElement(undefined);
      setDraggingElement(undefined);
    },
    [insertElement, setDraggedOverElement, setDraggingElement],
  );

  return (
    <LayoutGroup>
      {filteredElements.map((element) => (
        <ResizeHandler element={element} key={element.id}>
          <EditorContextMenu element={element}>
            {renderElement(element)}
          </EditorContextMenu>
          <div
            onDragOver={(e) => handleHover(e, element)}
            onDrop={(e) => handleDrop(e, element)}
            className="bg-blue-400 border-2 border-dashed border-blue-600 flex items-center justify-center text-blue-800 font-semibold transition-all duration-100"
            style={{
              width: "100%",
              height: draggedOverElement?.id === element.id ? "50px" : "0px",
              opacity: draggedOverElement?.id === element.id ? 0.7 : 0,
              overflow: "hidden",
            }}
          >
            {draggingElement ? "Swap Here" : "Insert Here"}
          </div>
        </ResizeHandler>
      ))}
    </LayoutGroup>
  );
}
