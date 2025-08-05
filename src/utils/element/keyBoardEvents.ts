import useElementStore from "@/globalstore/elementstore";
import { ContainerElement, EditorElement } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { elementHelper } from "./elementhelper";

export interface IKeyboardEvent {
    copyElement: (e: React.KeyboardEvent) => void;
    cutElement: (e: React.KeyboardEvent) => void;
    pasteElement: (e: React.KeyboardEvent) => void;
}

export class KeyboardEvent implements IKeyboardEvent {
    private selectedElement: EditorElement | undefined;
    private setSelectedElement: (element: EditorElement | undefined) => void;
    private updateElement: (
        id: string,
        updatedElement: Partial<EditorElement>,
    ) => void;
    private addElement: (element: EditorElement) => void;
    private deleteElement: (id: string) => void;

    constructor() {
        const elementStore = useElementStore.getState();
        this.selectedElement = elementStore.selectedElement;
        this.setSelectedElement = elementStore.setSelectedElement;
        this.addElement = elementStore.addElement;
        this.updateElement = elementStore.updateElement;
        this.deleteElement = elementStore.deleteElement;
    }

    public copyElement = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!this.selectedElement) return;

        sessionStorage.setItem("copiedElement", JSON.stringify(this.selectedElement));
    };

    public cutElement = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!this.selectedElement) return;

        sessionStorage.setItem("copiedElement", JSON.stringify(this.selectedElement));
        this.deleteElement(this.selectedElement.id);
        this.setSelectedElement(undefined);
    };

    public pasteElement = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const copiedElement = sessionStorage.getItem("copiedElement");
        if (!copiedElement) return;

        const elementData = JSON.parse(copiedElement) as EditorElement;
        const newElement = { ...elementData, id: uuidv4() };

        if (!this.selectedElement) {
            this.addElement(newElement);
            return;
        }

        if (elementHelper.isContainerElement(this.selectedElement)) {
            this.updateElement(this.selectedElement.id, {
                elements: [
                    ...(this.selectedElement as ContainerElement).elements,
                    newElement,
                ],
            });
        }
    };
}
