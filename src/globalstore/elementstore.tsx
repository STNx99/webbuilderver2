import { ContainerElement, EditorElement } from "@/types/global.type";
import { create } from "zustand";

type ElementStore = {
    elements: EditorElement[];
    selectedElement: EditorElement | undefined;
    selectedElements: EditorElement[] | undefined;
    draggingElement: EditorElement | undefined;

    setSelectedElements: (elements: EditorElement[] | undefined) => void;
    setDraggingElement: (element: EditorElement | undefined) => void;
    setSelectedElement: (element: EditorElement | undefined) => void;
    setElements: (elements: EditorElement[]) => void;
    loadElements: (elements: EditorElement[]) => void;
    updateElement: (id: string, updatedElement: Partial<EditorElement>) => void;
    deleteElement: (id: string) => void;
    addElement: (newElement: EditorElement) => void;
    deselectAll: () => void;
    dehoverAll: () => void;
};

const useElementStore = create<ElementStore>((set, get) => ({
    elements: [],
    selectedElement: undefined,
    selectedElements: undefined,
    draggingElement: undefined,

    setElements: (elements) => set({ elements }),
    setDraggingElement: (element) => set({ draggingElement: element }),
    setSelectedElement: (element) => set({ selectedElement: element }),
    setSelectedElements: (elements) => set({ selectedElements: elements }),
    loadElements: (elements: EditorElement[]) => set({ elements }),

    updateElement: (id, updatedElement) => {
        const { elements } = get();
        const updateElement = (element: EditorElement): EditorElement => {
            if (element.id === id) {
                return { ...element, ...updatedElement } as EditorElement;
            }
            if ("elements" in element) {
                return {
                    ...element,
                    elements: element.elements.map(updateElement),
                } as EditorElement;
            }
            return element;
        };
        const updatedElements = elements.map(updateElement);
        set({ elements: updatedElements });
    },

    deleteElement: (id) => {
        const { elements } = get();
        const deleteElement = (
            element: EditorElement,
        ): EditorElement | undefined => {
            if (element.id === id) {
                return undefined;
            }
            if ("elements" in element) {
                const filteredElements = element.elements
                    .map(deleteElement)
                    .filter((el): el is EditorElement => el !== undefined);
                return { ...element, elements: filteredElements };
            }
            return element;
        };
        const updatedElements = elements
            .map(deleteElement)
            .filter((el): el is EditorElement => el !== undefined);
        set({ elements: updatedElements });
        set({
            selectedElement: undefined,
            selectedElements: undefined,
            draggingElement: undefined,
        });
    },

    addElement: (newElement) => {
        const { elements } = get();

        // If no parentId, add to root level
        if (!newElement.parentId) {
            set({ elements: [...elements, newElement] });
            return;
        }

        // If parentId exists, add to the parent element
        const addElementToParent = (element: EditorElement): EditorElement => {
            if (element.id === newElement.parentId) {
                return {
                    ...element,
                    elements: [
                        ...((element as ContainerElement).elements || []),
                        newElement,
                    ],
                } as EditorElement;
            }
            if ("elements" in element) {
                return {
                    ...element,
                    elements: element.elements.map(addElementToParent),
                } as EditorElement;
            }
            return element;
        };
        const updatedElements = elements.map(addElementToParent);
        set({ elements: updatedElements });
        set({
            selectedElement: newElement,
            selectedElements: [newElement],
        });
    },

    deselectAll: () => {
        const { elements } = get();
        const recursivelyDeselect = (element: EditorElement): EditorElement => {
            const updated = { ...element, isSelected: false, isHovered: false } as EditorElement;
            if ("elements" in element && Array.isArray(element.elements)) {
                return {
                    ...updated,
                    elements: element.elements.map(recursivelyDeselect),
                } as EditorElement;
            }
            return updated;
        };

        const updatedElements = elements.map(recursivelyDeselect);
        set({
            elements: updatedElements,
            selectedElements: undefined,
            selectedElement: undefined,
        });
    },

    dehoverAll: () => {
        const { elements } = get();
        const recursivelyDehover = (element: EditorElement): EditorElement => {
            const updated = { ...element, isHovered: false } as EditorElement;
            if ("elements" in element && Array.isArray(element.elements)) {
                return {
                    ...updated,
                    elements: element.elements.map(recursivelyDehover),
                } as EditorElement;
            }
            return updated;
        };

        const updatedElements = elements.map(recursivelyDehover);
        set({ elements: updatedElements });
    },


}));

export default useElementStore;
