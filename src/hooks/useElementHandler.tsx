import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { cn } from "@/lib/utils";
import { EditorElement, ElementType } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";

export function useElementHandler() {
  const { addElement, updateElement, deselectAll, dehoverAll } =
    useElementStore();
  const {
    selectedElement,
    setSelectedElement,
    setDraggingElement,
    draggingElement,
  } = useSelectionStore();

  const handleDoubleClick = (e: React.MouseEvent, element: EditorElement) => {
    e.preventDefault();
    e.stopPropagation();

    // If clicking on the already selected element, deselect it
    if (selectedElement && selectedElement.id === element.id) {
      setSelectedElement(undefined);
      updateElement(element.id, { isSelected: false });
      return;
    }

    // Select the new element
    deselectAll();
    updateElement(element.id, { isSelected: true });
    setSelectedElement(element);
  };

  const handleDrop = (
    e: React.DragEvent,
    projectId: string,
    parentElement: EditorElement,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    deselectAll();
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
      // console.log(newElement?.pageId)

      if (!newElement) {
        return;
      }
      addElement(newElement as EditorElement);

      setSelectedElement(newElement);
    } else if (draggingElement) {
      elementHelper.handleSwap(draggingElement, parentElement, updateElement);
      updateElement(draggingElement.id, {
        isDraggedOver: false,
      });
    }
    updateElement(parentElement.id, {
      isDraggedOver: false,
    });
    setDraggingElement(undefined);
  };

  const handleDragStart = (e: React.DragEvent, element: EditorElement) => {
    e.stopPropagation();
    setDraggingElement(element);
  };

  const handleDragOver = (e: React.DragEvent, element: EditorElement) => {
    e.preventDefault();
    e.stopPropagation();
    if (element.isDraggedOver || draggingElement?.id === element.id) return;
    updateElement(element.id, {
      isDraggedOver: true,
    });
  };

  const handleDragLeave = (e: React.DragEvent, element: EditorElement) => {
    e.stopPropagation();
    if (!element.isDraggedOver) return;
    updateElement(element.id, {
      isDraggedOver: false,
    });
  };

  const handleDragEnd = (e: React.DragEvent, hoveredElement: EditorElement) => {
    e.stopPropagation();
    setDraggingElement(undefined);
  };

  const getTailwindStyles = (element: EditorElement) => {
    return cn("", element.tailwindStyles);
  };

  const handleMouseEnter = (e: React.MouseEvent, element: EditorElement) => {
    // Prevent event from bubbling to parent elements
    e.stopPropagation();
    e.preventDefault();
    // Don't interfere if any contentEditable element is currently focused
    if (
      document.activeElement &&
      (document.activeElement as HTMLElement).contentEditable === "true"
    ) {
      return;
    }

    // Only allow hovering on the currently selected element to prevent changing selection
    if (selectedElement && selectedElement.id !== element.id) {
      return;
    }

    dehoverAll(); // Clear hover states from all other elements
    // Clear hover states from all other elements, then set this one as hovered
    updateElement(element.id, { isHovered: true });
  };

  const handleMouseLeave = (e: React.MouseEvent, element: EditorElement) => {
    // Prevent event from bubbling to parent elements
    e.stopPropagation();

    // Don't interfere if any contentEditable element is currently focused
    if (
      document.activeElement &&
      (document.activeElement as HTMLElement).contentEditable === "true"
    ) {
      return;
    }
    // Clear hover state for this element
    updateElement(element.id, { isHovered: false });
  };

  const handleTextChange = (e: React.FocusEvent, element: EditorElement) => {
    e.stopPropagation();
    e.preventDefault();

    if (!elementHelper.isEditableElement(element)) {
      return;
    }
    // Handle text change logic here, if needed
    updateElement(element.id, {
      content: e.currentTarget.textContent || "",
    });
  };

  const getStyles = (element: EditorElement): React.CSSProperties => {
    // Defensive check: ensure styles is a valid object
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
        elementHelper.isEditableElement(element) && element.isSelected,
      suppressContentEditableWarning: true,

      onDragStart: (e: React.DragEvent) => handleDragStart(e, element),
      onDragLeave: (e: React.DragEvent) => handleDragLeave(e, element),
      onDragEnd: (e: React.DragEvent) => handleDragEnd(e, element),

      onDragOver: isEditableElement
        ? undefined
        : (e: React.DragEvent) => handleDragOver(e, element),
      onDrop: isEditableElement
        ? undefined
        : (e: React.DragEvent) => handleDrop(e, element.projectId, element),

      // Mouse event handlers
      onDoubleClick: (e: React.MouseEvent) => handleDoubleClick(e, element),
      onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e, element),
      onMouseLeave: (e: React.MouseEvent) => handleMouseLeave(e, element),

      // Text editing handler (fires when element loses focus)
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
