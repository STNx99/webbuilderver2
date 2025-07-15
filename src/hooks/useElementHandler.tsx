import useElementStore from "@/globalstore/elementstore";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/utils/elements/elementhelper";
import { handleSwap } from "@/utils/elements/handleSwap";

export function useElementHandler() {
  const {
    draggingElement,
    addElement,
    setSelectedElement,
    setDraggingElement,
    updateElement,
    clearHoverStatesExcept,
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
    projectId: string,
    parentElement: EditorElement
  ) => {
    e.stopPropagation();
    e.preventDefault();
    
    const data = e.dataTransfer.getData("elementType");
    
    if (data) {
      const isContainer = elementHelper.isContainerElement(parentElement);
      
      if (!isContainer) {
        return;
      }
      
      const newElement = elementHelper.createElements(data, 0, 0, projectId, undefined, parentElement.id);
      addElement(newElement);
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
    return cn("", element.tailwindStyles);
  };
  
  const handleMouseEnter = (e: React.MouseEvent, element: EditorElement) => {
    e.stopPropagation();
    e.preventDefault();
    // Clear hover states from all other elements, then set this one as hovered
    clearHoverStatesExcept(element.id);
    updateElement(element.id, { isHovered: true });
  }
  
  const handleMouseLeave = (e: React.MouseEvent, element: EditorElement) => { 
    e.stopPropagation();
    e.preventDefault();
    updateElement(element.id, { isHovered: false });
  }
  
  const getStyles = (element: EditorElement) => {
    const { 
      border, 
      borderTop, 
      borderRight, 
      borderBottom, 
      borderLeft,
      borderWidth,
      borderStyle,
      borderColor,
      ...cleanStyles 
    } = element.styles || {};
    
    return {
      ...cleanStyles,
      ...(element.isSelected && {
        borderWidth: '4px',
        borderStyle: 'solid',
        borderColor: 'black',
      }),
      ...(element.isHovered && !element.isSelected && {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'black',
      }),
      ...(element.id !== draggingElement?.id && element.isDraggedOver && !element.isSelected && !element.isHovered && {
        borderWidth: '2px',
        borderStyle: 'dashed',
        borderColor: '#1d4ed8',
      }),
    };
    
  }
  const getCommonProps = (element: EditorElement) => {
    const tailwindStyles = getTailwindStyles(element);
    const mergedStyles = getStyles(element);    
    
    return {
      style: mergedStyles,
      draggable: true,
      className: tailwindStyles,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, element),
      onDragOver: (e: React.DragEvent) => handleDragOver(e, element),
      onDragLeave: (e: React.DragEvent) => handleDragLeave(e, element),
      onDragEnd: (e: React.DragEvent) => handleDragEnd(e, element),
      onDoubleClick: (e: React.MouseEvent) => handleDoubleClick(e, element),
      onDrop: (e: React.DragEvent) => handleDrop(e, element.projectId, element),
      onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e, element),
      onMouseLeave: (e: React.MouseEvent) => handleMouseLeave(e, element),   
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
