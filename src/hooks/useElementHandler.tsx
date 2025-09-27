import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { cn } from "@/lib/utils";
import { EditorElement, ElementType } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { CSSStyles } from "@/interfaces/elements.interface";

export function useElementHandler() {
  const {
    addElement,
    updateElement,
    elements,
    setElements,
    updateAllElements,
  } = useElementStore();
  const {
    hoveredElement,
    selectedElement,
    setSelectedElement,
    setDraggingElement,
    draggingElement,
    draggedOverElement,
    setDraggedOverElement,
    setHoveredElement,
  } = useSelectionStore();

  const handleDoubleClick = (e: React.MouseEvent, element: EditorElement) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedElement && selectedElement.id === element.id) {
      setSelectedElement(undefined);
      return;
    }

    setSelectedElement(element);
  };

  const handleDrop = (
    e: React.DragEvent,
    projectId: string,
    parentElement: EditorElement,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedElement(undefined);
    const data = e.dataTransfer.getData("elementType");

    if (data) {
      const isContainer = elementHelper.isContainerElement(parentElement);

      if (!isContainer) {
        return;
      }

      const newElement = elementHelper.createElement.create(
        data as ElementType,
        projectId,
        parentElement.id,
        parentElement.pageId,
      );

      if (!newElement) {
        return;
      }
      addElement(newElement as EditorElement);

      setSelectedElement(newElement);
      setDraggedOverElement(undefined);
    } else if (draggingElement) {
      elementHelper.handleSwap(
        draggingElement,
        parentElement,
        elements,
        setElements,
      );
      setDraggedOverElement(undefined);
    }
    setHoveredElement(undefined);
    setDraggingElement(undefined);
  };

  const handleDragStart = (e: React.DragEvent, element: EditorElement) => {
    e.stopPropagation();
    setDraggingElement(element);
  };

  const handleDragOver = (e: React.DragEvent, element: EditorElement) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      draggingElement?.id === element.id ||
      draggingElement?.parentId === element.id
    )
      return;
    if (!elementHelper.isContainerElement(element)) return;
    setDraggedOverElement(element);
  };

  const handleDragLeave = (e: React.DragEvent, element: EditorElement) => {
    e.stopPropagation();
    if (draggedOverElement?.id === element.id) {
      setDraggedOverElement(undefined);
    }
  };

  const handleDragEnd = (e: React.DragEvent, hoveredElement: EditorElement) => {
    e.stopPropagation();
    setDraggingElement(undefined);
    setDraggedOverElement(undefined);
  };

  const getTailwindStyles = (element: EditorElement) => {
    return cn("", element.tailwindStyles);
  };

  const handleMouseEnter = (e: React.MouseEvent, element: EditorElement) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      document.activeElement &&
      (document.activeElement as HTMLElement).contentEditable === "true"
    ) {
      return;
    }

    if (selectedElement && selectedElement.id !== element.id) {
      return;
    }

    setHoveredElement(element);
  };

  const handleMouseLeave = (e: React.MouseEvent, element: EditorElement) => {
    e.stopPropagation();

    if (
      document.activeElement &&
      (document.activeElement as HTMLElement).contentEditable === "true"
    ) {
      return;
    }
    setHoveredElement(undefined);
  };

  const handleTextChange = (e: React.FocusEvent, element: EditorElement) => {
    e.stopPropagation();
    e.preventDefault();

    if (!elementHelper.isEditableElement(element)) {
      return;
    }
    updateElement(element.id, {
      content: e.currentTarget.textContent || "",
    });
  };

  const getStyles = (element: EditorElement): CSSStyles => {
    if (
      !element.styles ||
      typeof element.styles !== "object" ||
      Array.isArray(element.styles)
    ) {
      return {};
    }
    return {
      ...element.styles,
    };
  };

  const getCommonProps = (element: EditorElement) => {
    const tailwindStyles = getTailwindStyles(element);
    const mergedStyles = getStyles(element);
    const isEditableElement = elementHelper.isEditableElement(element);

    return {
      style: mergedStyles,
      draggable: true,
      className: tailwindStyles,
      contentEditable:
        elementHelper.isEditableElement(element) &&
        selectedElement?.id === element.id,
      suppressContentEditableWarning: true,

      onDragStart: (e: React.DragEvent) => handleDragStart(e, element),
      onDragLeave: (e: React.DragEvent) => handleDragLeave(e, element),
      onDragEnd: (e: React.DragEvent) => handleDragEnd(e, element),

      onDragOver: (e: React.DragEvent) => handleDragOver(e, element),
      onDrop: isEditableElement
        ? undefined
        : (e: React.DragEvent) => handleDrop(e, element.projectId, element),

      onDoubleClick: (e: React.MouseEvent) => handleDoubleClick(e, element),
      onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e, element),
      onMouseLeave: (e: React.MouseEvent) => handleMouseLeave(e, element),

      onBlur: (e: React.FocusEvent) => handleTextChange(e, element),
    };
  };

  return {
    handleDoubleClick,
    handleDrop,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleMouseEnter,
    handleMouseLeave,
    getTailwindStyles,
    getCommonProps,
    getStyles,
  };
}
