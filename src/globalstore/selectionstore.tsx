import { create } from "zustand";
import { EditorElement } from "@/types/global.type";

type SelectionStore = {
  selectedElement: EditorElement | undefined;
  draggingElement: EditorElement | undefined;
  setSelectedElement: (element: EditorElement | undefined) => void;
  setDraggingElement: (element: EditorElement | undefined) => void;
};

const selectionStoreInstance = create<SelectionStore>((set) => ({
  selectedElement: undefined,
  draggingElement: undefined,
  setSelectedElement: (element) => set({ selectedElement: element }),
  setDraggingElement: (element) => set({ draggingElement: element }),
}));

export const useSelectionStore = selectionStoreInstance;

export const SelectionStore = selectionStoreInstance;
