import useElementStore from "@/globalstore/elementstore";
import { cn } from "@/lib/utils";
import { EditorElement, ElementType } from "@/types/global.type";
import { elementHelper } from "@/utils/element/elementhelper";

export function useElementHandler() {
    const {
        draggingElement,
        addElement,
        selectedElements,
        setSelectedElement,
        setSelectedElements,
        setDraggingElement,
        updateElement,
        deselectAll,
        dehoverAll,
    } = useElementStore();

    const handleDoubleClick = (e: React.MouseEvent, element: EditorElement) => {
        e.stopPropagation();
        const isMultiSelect = e.ctrlKey || e.metaKey;
    
        if (
            !isMultiSelect &&
            Array.isArray(selectedElements) &&
            selectedElements.length === 1 &&
            selectedElements[0].id === element.id
        ) {
            // If the element is already selected and it's a single selection, deselect it
            setSelectedElement(undefined);
            setSelectedElements([]);
            updateElement(element.id, { isSelected: false });
            return;
        }
    
        setSelectedElement(element);
    
        if (!isMultiSelect || !Array.isArray(selectedElements)) {
            deselectAll();
            updateElement(element.id, { isSelected: true });
            setSelectedElement(element);
            setSelectedElements([element]);
        } else {
            const alreadySelected = selectedElements.some((el: EditorElement) => el.id === element.id);
            if (alreadySelected) {
                updateElement(element.id, { isSelected: false });
                setSelectedElements(selectedElements.filter((el: EditorElement) => el.id !== element.id));
            } else {
                updateElement(element.id, { isSelected: true });
                setSelectedElements([...selectedElements, element]);
            }
        }
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

    const handleMouseEnter = (e: React.MouseEvent, element: EditorElement) => {
        // Prevent event from bubbling to parent elements
        e.stopPropagation();
        e.preventDefault()
        // Don't interfere if any contentEditable element is currently focused
        if (
            document.activeElement &&
            (document.activeElement as HTMLElement).contentEditable === "true"
        ) {
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

    const getStyles = (element: EditorElement) : React.CSSProperties => {
        return {
            ...element.styles,
            height: "100%",
            width: "100%"
        }
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
                : (e: React.DragEvent) =>
                      handleDrop(e, element.projectId, element),

            // Mouse event handlers
            onDoubleClick: (e: React.MouseEvent) =>
                handleDoubleClick(e, element),
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
