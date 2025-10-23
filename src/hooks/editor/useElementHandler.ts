import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { cn } from "@/lib/utils";
import { EditorElement, ElementType } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";

export function useElementHandler() {
  const { addElement, updateElement, swapElement } = useElementStore();
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

  const createElementFromType = (
    type: ElementType,
    projectId: string,
    parentId: string,
    pageId: string,
  ) => {
    return elementHelper.createElement.create(
      type,
      projectId,
      parentId,
      pageId!,
    );
  };

  const handleImageDrop = (
    parsed: any,
    projectId: string,
    parentElement: EditorElement,
  ) => {
    const isContainer = elementHelper.isContainerElement(parentElement);
    if (!isContainer) {
      return null;
    }
    const newElement = createElementFromType(
      "Image",
      projectId,
      parentElement.id,
      parentElement.pageId!,
    );
    if (newElement) {
      newElement.src = parsed.imageLink;
      newElement.name = parsed.imageName || "Image";
    }
    setDraggedOverElement(undefined);
    return newElement;
  };

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

      const newElement = createElementFromType(
        data as ElementType,
        projectId,
        parentElement.id,
        parentElement.pageId!,
      );

      if (!newElement) {
        return;
      }
      addElement(newElement as EditorElement);
      setSelectedElement(newElement);
      setDraggedOverElement(undefined);
    } else if (draggingElement) {
      swapElement(draggingElement.id, parentElement.id);
      setDraggedOverElement(undefined);
    } else {
      const imageData = e.dataTransfer.getData("application/json");
      if (imageData) {
        try {
          const parsed = JSON.parse(imageData);
          if (parsed.type === "image") {
            const newElement = handleImageDrop(
              parsed,
              projectId,
              parentElement,
            );
            if (newElement) {
              addElement(newElement);
              setSelectedElement(newElement);
            }
          }
        } catch (error) {
          // ignore
        }
      }
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

    if (selectedElement && elementHelper.isEditableElement(selectedElement)) {
      return;
    }

    if (selectedElement && selectedElement.id !== element.id) {
      return;
    }

    setHoveredElement(element);
  };

  const handleMouseLeave = (e: React.MouseEvent, element: EditorElement) => {
    e.stopPropagation();

    if (selectedElement && elementHelper.isEditableElement(selectedElement)) {
      return;
    }

    if (
      (document.activeElement &&
        (document.activeElement as HTMLElement).contentEditable === "true") ||
      (hoveredElement && hoveredElement.id !== element.id) ||
      (selectedElement && selectedElement.id === element.id)
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

  const getStyles = (element: EditorElement): React.CSSProperties => {
    if (
      !element.styles ||
      typeof element.styles !== "object" ||
      Array.isArray(element.styles)
    ) {
      return {};
    }
    const merged: React.CSSProperties = {};
    const styles = element.styles;
    const breakpoints: (keyof typeof styles)[] = [
      "default",
      "sm",
      "md",
      "lg",
      "xl",
    ];
    breakpoints.forEach((bp) => {
      if (styles[bp]) {
        Object.assign(merged, styles[bp]);
      }
    });
    return merged;
  };

  const getEventHandlers = (element: EditorElement) => {
    const isEditableElement = elementHelper.isEditableElement(element);

    return {
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

  const getCommonProps = (element: EditorElement) => {
    const tailwindStyles = getTailwindStyles(element);
    const mergedStyles = getStyles(element);
    const eventHandlers = getEventHandlers(element);

    return {
      style: mergedStyles,
      draggable: true,
      className: tailwindStyles,
      contentEditable:
        elementHelper.isEditableElement(element) &&
        selectedElement?.id === element.id,
      suppressContentEditableWarning: true,
      ...eventHandlers,
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
