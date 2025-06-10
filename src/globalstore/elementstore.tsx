import { ContainerElement, EditorElement } from "@/types/global.type";
import { create } from "zustand";

type ElementStore = {
  elements: EditorElement[];
  selectedElement: EditorElement | undefined;
  draggingElement: EditorElement | undefined;
  setDraggingElement: (element: EditorElement | undefined) => void;
  setSelectedElement: (element: EditorElement | undefined) => void;

  loadElements: (elements: EditorElement[]) => void;
  updateElement: (id: string, updatedElement: Partial<EditorElement>) => void;
  deleteElement: (id: string) => void;
  addElement: (newElement: EditorElement) => void;
};

const useElementStore = create<ElementStore>((set, get) => ({
  elements: [],
  selectedElement: undefined,
  draggingElement: undefined,

  setDraggingElement: (element) => set({ draggingElement: element }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  loadElements: (elements: EditorElement[]) => set({ elements }),

  updateElement: (id, updatedElement) => {
    const { elements } = get();
    const updateElement = (element: EditorElement): EditorElement => {
      if (element.id === id) {
        return { ...element, ...updatedElement };
      }
      if ("elements" in element) {
        return {
          ...element,
          elements: element.elements.map(updateElement),
        };
      }
      return element;
    };
    const updatedElements = elements.map(updateElement);
    set({ elements: updatedElements });
  },

  deleteElement: (id) => {
    const { elements } = get();
    const deleteElement = (
      element: EditorElement
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
  },

  addElement: (newElement) => {
    const { elements } = get();
    const addElementToParent = (element: EditorElement): EditorElement => {
      if (element.id === newElement.parentId) {
        return {
          ...element,
          elements: [
            ...((element as ContainerElement).elements || []),
            newElement,
          ],
        };
      }
      if ("elements" in element) {
        return {
          ...element,
          elements: element.elements.map(addElementToParent),
        };
      }
      return element;
    };
    const updatedElements = elements.map(addElementToParent);
    set({ elements: updatedElements });
  },
}));

export default useElementStore;
