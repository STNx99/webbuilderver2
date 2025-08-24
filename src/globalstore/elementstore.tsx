import { create } from "zustand";
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
  insertElement: (element: TElement, elementToBeInserted: TElement) => void;
};

const createElementStore = <TElement extends EditorElement>() => {
  return create<ElementStore<TElement>>((set, get) => ({
    elements: [],
    selectedElement: undefined,
    selectedElements: undefined,
    draggingElement: undefined,

    setElements: (elements) => set({ elements }),
    setDraggingElement: (element) => set({ draggingElement: element }),
    setSelectedElement: (element) => set({ selectedElement: element }),
    setSelectedElements: (elements) => set({ selectedElements: elements }),
    loadElements: (elements: TElement[]) => set({ elements }),

    updateElement: (id, updatedElement) => {
      const { elements, selectedElement } = get();
      const updateElementRecursively = (
        element: EditorElement,
      ): EditorElement => {
        if (element.id === id) {
          return { ...element, ...updatedElement } as TElement;
        }
        if (isContainer(element)) {
          return {
            ...element,
            elements: element.elements.map(updateElementRecursively),
          };
        }
        return element;
      };
      const updatedElements = elements.map(
        (e) => updateElementRecursively(e) as TElement,
      );

      let updatedSelectedElement = selectedElement;
      if (selectedElement && selectedElement.id === id) {
        const findUpdated = (
          els: EditorElement[],
        ): EditorElement | undefined => {
          for (const el of els) {
            if (el.id === id) return el;
            if (isContainer(el)) {
              const found = findUpdated(el.elements);
              if (found) return found;
            }
          }
          return undefined;
        };
        updatedSelectedElement = findUpdated(updatedElements) as TElement;
      }

      set({
        elements: updatedElements,
        selectedElement: updatedSelectedElement as TElement,
      });
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
        .filter((el): el is TElement => el !== undefined);
      set({ elements: updatedElements });
      set({
        selectedElement: undefined,
        selectedElements: undefined,
        draggingElement: undefined,
      });
    },

    insertElement: (element, elementToBeInserted) => {
      const { elements } = get();

      // Helper to insert after the target element in an array
      const insertAfter = (
        arr: EditorElement[],
        targetId: string,
        toInsert: EditorElement,
      ) => {
        const idx = arr.findIndex((el) => el.id === targetId);
        if (idx === -1) return arr;
        return [...arr.slice(0, idx + 1), toInsert, ...arr.slice(idx + 1)];
      };

      const insertRecursively = (arr: EditorElement[]): EditorElement[] => {
        const idx = arr.findIndex((el) => el.id === element.id);
        if (idx !== -1) {
          return insertAfter(arr, element.id, elementToBeInserted);
        }
        return arr.map((el) => {
          if (isContainer(el)) {
            return {
              ...el,
              elements: insertRecursively(el.elements),
            };
          }
          return el;
        });
      };

      const updatedElements = insertRecursively(elements) as TElement[];
      set({ elements: updatedElements });
    },

    addElement: (newElement) => {
      const { elements } = get();

      if (!newElement.parentId) {
        set({ elements: [...elements, newElement] as TElement[] });
        return;
      }

      const addElementToParent = (element: EditorElement): EditorElement => {
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
        (e) => addElementToParent(e) as TElement,
      );
      set({ elements: updatedElements });
      set({
        selectedElement: newElement,
        selectedElements: [newElement],
      });
    },

    updateAllElements: (update) => {
      const { elements } = get();
      const recursivelyUpdate = (element: EditorElement): EditorElement => {
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
        (e) => recursivelyUpdate(e) as TElement,
      );
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
};

const useElementStoreImplementation = createElementStore();

export const useElementStore = useElementStoreImplementation as {
  <TElement extends EditorElement>(): ElementStore<TElement>;
  <TElement extends EditorElement, U>(
    selector: (state: ElementStore<TElement>) => U,
  ): U;
};

export const ElementStore = useElementStoreImplementation;
