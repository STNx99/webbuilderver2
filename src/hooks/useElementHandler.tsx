import useElementStore from "@/globalstore/elementstore";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/global.type";
import { createElements } from "@/utils/elements/createElements";
import { handleSwap } from "@/utils/elements/handleSwap";

export function useElementHandler() {
  const {
    draggingElement,
    addElement,
    setSelectedElement,
    setDraggingElement,
    updateElement,
  } = useElementStore();

  const handleDoubleClick = (e: React.MouseEvent, element: EditorElement) => {
    e.stopPropagation();
    if (element.isSelected) {
      setSelectedElement(undefined);
    } else {
      setSelectedElement(element);
    }
    updateElement(element.id, { isSelected: !element.isSelected });
  };

  const handleDrop = (
    e: React.DragEvent,
    parentId: string,
    projectId: string
  ) => {
    e.stopPropagation();
    const data = e.dataTransfer.getData("element/type");
    if (data) {
      addElement(createElements(data, 0, 0, projectId, "", parentId));
    }
  };

  const handleDragStart = (e: React.DragEvent, element: EditorElement) => {
    e.stopPropagation();
    setDraggingElement(element);
  };

  const handleDragOver = (e: React.DragEvent, element: EditorElement) => {
    e.preventDefault();
    e.stopPropagation();
    updateElement(element.id, {
      isDraggedOver: true,
    });
  };

  const handleDragLeave = (e: React.DragEvent, element: EditorElement) => {
    e.stopPropagation();
    updateElement(element.id, {
      isDraggedOver: false,
    });
  };

  const handleDragEnd = (e: React.DragEvent, hoveredElement: EditorElement) => {
    e.stopPropagation();
    if (draggingElement && hoveredElement.isHovered) {
      handleSwap(draggingElement, hoveredElement, updateElement);
    }
    setDraggingElement(undefined);
  };

  const getTailwindStyles = (element: EditorElement) => {
    return cn("", element.tailwindStyles, {
      "border-4 border-solid border-black": element.isSelected,
      "border-2 border-solid border-black": element.isHovered,
      "border-2 border-dashed border-blue-700":
        element.id !== draggingElement?.id,
    });
  };

  const getCommonProps = (element: EditorElement) => {
    const tailwindStyles = getTailwindStyles(element);
    return {
      style: element.styles,
      draggable: true,
      className: tailwindStyles,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, element),
      onDragOver: (e: React.DragEvent) => handleDragOver(e, element),
      onDragLeave: (e: React.DragEvent) => handleDragLeave(e, element),
      onDragEnd: (e: React.DragEvent) => handleDragEnd(e, element),
      onDoubleClick: (e: React.MouseEvent) => handleDoubleClick(e, element),
    };
  };

  return {
    handleDoubleClick,
    handleDrop,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    getTailwindStyles,
    getCommonProps,
  };
}
