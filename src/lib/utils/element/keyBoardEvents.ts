import { ContainerElement, EditorElement } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { elementHelper } from "./elementhelper";
import { ElementStore } from "@/globalstore/elementstore";
import { SelectionStore } from "@/globalstore/selectionstore";

export interface IKeyboardEvent {
  copyElement: () => void;
  cutElement: () => void;
  pasteElement: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  deleteElement: () => void;
}

export class KeyboardEvent implements IKeyboardEvent {
  public copyElement = () => {
    const selectedElement =
      SelectionStore.getState().selectedElement ||
      SelectionStore.getState().hoveredElement;
    if (!selectedElement) return;
    sessionStorage.setItem("copiedElement", JSON.stringify(selectedElement));
  };

  public cutElement = () => {
    const selectedElement =
      SelectionStore.getState().selectedElement ||
      SelectionStore.getState().hoveredElement;
    if (!selectedElement) return;
    sessionStorage.setItem("copiedElement", JSON.stringify(selectedElement));
    ElementStore.getState().deleteElement(selectedElement.id);
    SelectionStore.getState().setSelectedElement(undefined);
  };

  public pasteElement = () => {
    const copiedElement = sessionStorage.getItem("copiedElement");
    if (!copiedElement) return;

    const elementData = JSON.parse(copiedElement) as EditorElement;
    let newElement = { ...elementData, id: uuidv4() };

    if (elementHelper.isContainerElement(newElement)) {
      const updateIdsRecursively = (
        element: ContainerElement,
      ): ContainerElement => {
        const updatedElements = element.elements.map((child) => {
          const newChild = { ...child, id: uuidv4() };
          if (elementHelper.isContainerElement(newChild)) {
            return updateIdsRecursively(newChild);
          }
          return newChild;
        });
        return { ...element, elements: updatedElements };
      };
      newElement = updateIdsRecursively(newElement as ContainerElement);
    }

    const elementState = ElementStore.getState();

    elementState.addElement(newElement);
  };

  public bringToFront = () => {
    const selectedElement =
      SelectionStore.getState().selectedElement ||
      SelectionStore.getState().hoveredElement;
    if (!selectedElement) return;
    const elementState = ElementStore.getState();
    const elements = elementState.elements;
    const idx = elements.findIndex(
      (el: EditorElement) => el.id === selectedElement.id,
    );
    if (idx === -1) return;
    const newElements = [...elements];
    const [removed] = newElements.splice(idx, 1);
    newElements.push(removed);
    elementState.setElements(newElements);
  };

  public sendToBack = () => {
    const selectedElement =
      SelectionStore.getState().selectedElement ||
      SelectionStore.getState().hoveredElement;
    if (!selectedElement) return;
    const elementState = ElementStore.getState();
    const elements = elementState.elements;
    const idx = elements.findIndex(
      (el: EditorElement) => el.id === selectedElement.id,
    );
    if (idx === -1) return;
    const newElements = [...elements];
    const [removed] = newElements.splice(idx, 1);
    newElements.unshift(removed);
    elementState.setElements(newElements);
  };

  public deleteElement = () => {
    const selectedElement =
      SelectionStore.getState().selectedElement ||
      SelectionStore.getState().hoveredElement;
    if (!selectedElement) return;
    ElementStore.getState().deleteElement(selectedElement.id);
    SelectionStore.getState().setSelectedElement(undefined);
  };

  public deselectAll = () => {
    SelectionStore.getState().setSelectedElement(undefined);
  };

  public undo = () => {
    ElementStore.getState().undo();
  };

  public redo = () => {
    ElementStore.getState().redo();
  };
}
