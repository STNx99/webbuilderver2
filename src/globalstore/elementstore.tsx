
import { create, StoreApi, UseBoundStore } from "zustand";
import { ContainerElement, EditorElement } from "@/types/global.type";

const isContainer = (element: EditorElement): element is ContainerElement => {
    return "elements" in element;
};

type ElementStore<TElement extends EditorElement> = {
    elements: TElement[];
    selectedElement: TElement | undefined;
    selectedElements: TElement[] | undefined;
    draggingElement: TElement | undefined;

    setSelectedElements: (elements: TElement[] | undefined) => void;
    setDraggingElement: (element: TElement | undefined) => void;
    setSelectedElement: (element: TElement | undefined) => void;
    setElements: (elements: TElement[]) => void;
    loadElements: (elements: TElement[]) => void;
    updateElement: (id: string, updatedElement: Partial<TElement>) => void;
    deleteElement: (id: string) => void;
    addElement: (newElement: TElement) => void;
    deselectAll: () => void;
    dehoverAll: () => void;
    updateAllElements: (update: Partial<EditorElement>) => void;
};

// Create the generic store factory
const useElementStoreImplementation = create<ElementStore<any>>((set, get) => ({
    elements: [],
    selectedElement: undefined,
    selectedElements: undefined,
    draggingElement: undefined,

    setElements: (elements) => set({ elements }),
    setDraggingElement: (element) => set({ draggingElement: element }),
    setSelectedElement: (element) => set({ selectedElement: element }),
    setSelectedElements: (elements) => set({ selectedElements: elements }),
    loadElements: (elements: any[]) => set({ elements }),

    updateElement: (id, updatedElement) => {
        const { elements } = get();
        const updateElementRecursively = (
            element: EditorElement,
        ): EditorElement => {
            if (element.id === id) {
                return { ...element, ...updatedElement };
            }
            if (isContainer(element)) {
                return {
                    ...element,
                    elements: element.elements.map(
                        updateElementRecursively,
                    ),
                };
            }
            return element;
        };
        const updatedElements = elements.map(
            updateElementRecursively,
        ) as any[];
        set({ elements: updatedElements });
    },

    deleteElement: (id) => {
        const { elements } = get();
        const deleteElementRecursively = (
            element: EditorElement,
        ): EditorElement | undefined => {
            if (element.id === id) {
                return undefined;
            }
            if (isContainer(element)) {
                const filteredElements = element.elements
                    .map(deleteElementRecursively)
                    .filter((el): el is EditorElement => el !== undefined);
                return { ...element, elements: filteredElements };
            }
            return element;
        };
        const updatedElements = elements
            .map(deleteElementRecursively)
            .filter((el): el is any => el !== undefined);
        set({ elements: updatedElements });
        set({
            selectedElement: undefined,
            selectedElements: undefined,
            draggingElement: undefined,
        });
    },

    addElement: (newElement) => {
        const { elements } = get();

        if (!newElement.parentId) {
            set({ elements: [...elements, newElement] });
            return;
        }

        const addElementToParent = (
            element: EditorElement,
        ): EditorElement => {
            if (element.id === newElement.parentId) {
                if (isContainer(element)) {
                    return {
                        ...element,
                        elements: [...element.elements, newElement],
                    };
                }
                return element;
            }

            if (isContainer(element)) {
                return {
                    ...element,
                    elements: element.elements.map(addElementToParent),
                };
            }
            return element;
        };
        const updatedElements = elements.map(
            addElementToParent,
        ) as any[];
        set({ elements: updatedElements });
        set({
            selectedElement: newElement,
            selectedElements: [newElement],
        });
    },

    updateAllElements: (update) => {
        const { elements } = get();
        const recursivelyUpdate = (
            element: EditorElement,
        ): EditorElement => {
            const updated = { ...element };
            Object.assign(updated, update);

            if (update.styles) {
                updated.styles = { ...element.styles, ...update.styles };
            }

            if (isContainer(element)) {
                return {
                    ...updated,
                    elements: element.elements.map(recursivelyUpdate),
                };
            }
            return updated;
        };
        const updatedElements = elements.map(
            recursivelyUpdate,
        ) as any[];
        set({ elements: updatedElements });
    },

    deselectAll: () => {
        get().updateAllElements({
            isSelected: false,
            isHovered: false,
        });
        set({
            selectedElements: undefined,
            selectedElement: undefined,
        });
    },

    dehoverAll: () => {
        get().updateAllElements({ isHovered: false });
    },
}));

// Provide the type-safe wrapper
export const useElementStore = useElementStoreImplementation as {
  <TElement extends EditorElement>(): ElementStore<TElement>;
  <TElement extends EditorElement, U>(
      selector: (state: ElementStore<TElement>) => U,
  ): U;
};