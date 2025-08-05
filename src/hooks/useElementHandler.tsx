import useElementStore from "@/globalstore/elementstore";
import { cn } from "@/lib/utils";
import { EditorElement, ElementType } from "@/types/global.type";
import { elementHelper } from "@/utils/element/elementhelper";

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
        parentElement: EditorElement,
    ) => {
        e.stopPropagation();
        e.preventDefault();

        const data = e.dataTransfer.getData("elementType");

        if (data) {
            const isContainer = elementHelper.isContainerElement(parentElement);

            if (!isContainer) {
                return;
            }

            const newElement = elementHelper.createElement(
                data as ElementType,
                projectId,
                parentElement.id,
            );
            
            if (!newElement) {
                return;
            }
            addElement(newElement as EditorElement);

            setSelectedElement(newElement);
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

    const handleDragEnd = (
        e: React.DragEvent,
        hoveredElement: EditorElement,
    ) => {
        e.stopPropagation();
        if (draggingElement && hoveredElement.isHovered) {
            elementHelper.handleSwap(
                draggingElement,
                hoveredElement,
                updateElement,
            );
        }
        setDraggingElement(undefined);
    };

    const getTailwindStyles = (element: EditorElement) => {
        return cn("", element.tailwindStyles);
    };

    const handleMouseEnter = (_: React.MouseEvent, element: EditorElement) => {
        // Don't interfere if any contentEditable element is currently focused
        if (
            document.activeElement &&
            (document.activeElement as HTMLElement).contentEditable === "true"
        ) {
            return;
        }

        // Clear hover states from all other elements, then set this one as hovered
        clearHoverStatesExcept(element.id);
        updateElement(element.id, { isHovered: true });
    };

    const handleMouseLeave = (_: React.MouseEvent, element: EditorElement) => {
        // Don't interfere if any contentEditable element is currently focused
        if (
            document.activeElement &&
            (document.activeElement as HTMLElement).contentEditable === "true"
        ) {
            return;
        }

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
            width,
            height,
            ...cleanStyles
        } = element.styles || {};
    
        return {
            ...cleanStyles,
            height: "100%",
            ...(element.isHovered &&
                !element.isSelected && {
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: "black",
                }),
            ...(element.id !== draggingElement?.id &&
                element.isDraggedOver &&
                !element.isSelected &&
                !element.isHovered && {
                    borderWidth: "2px",
                    borderStyle: "dashed",
                    borderColor: "#1d4ed8",
                }),
        };
    };

    const getCommonProps = (element: EditorElement) => {
        const tailwindStyles = getTailwindStyles(element);
        const mergedStyles = getStyles(element);
        const isEditableElement = elementHelper.isEditableElement(element);
        const isContainerElement = elementHelper.isContainerElement(element);

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
                : (e: React.DragEvent) =>
                      handleDrop(e, element.projectId, element),

            // Mouse event handlers
            onDoubleClick: (e: React.MouseEvent) =>
                handleDoubleClick(e, element),
            onMouseEnter:
                isContainerElement && element.isSelected
                    ? undefined
                    : (e: React.MouseEvent) => handleMouseEnter(e, element),
            onMouseLeave:
                isContainerElement && element.isSelected
                    ? undefined
                    : (e: React.MouseEvent) => handleMouseLeave(e, element),

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
