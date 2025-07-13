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
  clearHoverStatesExcept: (excludeId: string) => void;
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

  clearHoverStatesExcept: (excludeId: string) => {
    const { elements } = get();
    const clearHover = (element: EditorElement): EditorElement => {
      const updated = { ...element, isHovered: false };
      if ("elements" in element) {
        return {
          ...updated,
          elements: element.elements.map(clearHover),
        };
      }
      return updated;
    };
    const updatedElements = elements.map(clearHover);
    set({ elements: updatedElements });
  },
}));

export default useElementStore;
