import { ContainerElement, EditorElement } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { elementHelper } from "./elementhelper";
import { ElementStore } from "@/globalstore/elementstore";

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
    const { selectedElement } = ElementStore.getState();
    if (!selectedElement) return;
    sessionStorage.setItem("copiedElement", JSON.stringify(selectedElement));
  };

  public cutElement = () => {
    const { selectedElement, deleteElement, setSelectedElement } =
      ElementStore.getState();
    if (!selectedElement) return;
    sessionStorage.setItem("copiedElement", JSON.stringify(selectedElement));
    deleteElement(selectedElement.id);
    setSelectedElement(undefined);
  };

  public pasteElement = () => {
    const copiedElement = sessionStorage.getItem("copiedElement");
    if (!copiedElement) return;

    const elementData = JSON.parse(copiedElement) as EditorElement;
    const newElement = { ...elementData, id: uuidv4() };

    const { selectedElement, addElement, updateElement } =
      ElementStore.getState();

    if (!selectedElement) {
      addElement(newElement);
      return;
    }

    if (elementHelper.isContainerElement(selectedElement)) {
      updateElement(selectedElement.id, {
        elements: [
          ...(selectedElement as ContainerElement).elements,
          newElement,
        ],
      });
    }
  };

  public bringToFront = () => {
    const { selectedElement, elements, setElements } = ElementStore.getState();
    if (!selectedElement) return;
    const idx = elements.findIndex(
      (el: EditorElement) => el.id === selectedElement.id,
    );
    if (idx === -1) return;
    const newElements = [...elements];
    const [removed] = newElements.splice(idx, 1);
    newElements.push(removed);
    setElements(newElements);
  };

  public sendToBack = () => {
    const { selectedElement, elements, setElements } = ElementStore.getState();
    if (!selectedElement) return;
    const idx = elements.findIndex(
      (el: EditorElement) => el.id === selectedElement.id,
    );
    if (idx === -1) return;
    const newElements = [...elements];
    const [removed] = newElements.splice(idx, 1);
    newElements.unshift(removed);
    setElements(newElements);
  };

  public deleteElement = () => {
    const { selectedElement, deleteElement, setSelectedElement } =
      ElementStore.getState();
    if (!selectedElement) return;
    deleteElement(selectedElement.id);
    setSelectedElement(undefined);
  };
}
