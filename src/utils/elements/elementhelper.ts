import { EditorElement } from "@/types/global.type";
import { createElements } from "./createElements";
import { handleSwap } from "./handleSwap";
import { findElement } from "./findElement";
import { getElementSettings } from "./getElementSettings";

interface ElementHelper {
  createElements: (
    type: string,
    x: number,
    y: number,
    projectId: string,
    src?: string,
    parentId?: string
  ) => EditorElement;

  handleSwap: (
    draggingElement: EditorElement,
    hoveredElement: EditorElement,
    updateElement: (id: string, updatedElement: Partial<EditorElement>) => void
  ) => void;

  findElement: (
    element: EditorElement,
    id: string
  ) => EditorElement | undefined;

  getElementSettings: (
    element: EditorElement
  ) => string | null;
}

export const elementHelper: ElementHelper = {
  createElements: createElements,
  handleSwap: handleSwap,
  findElement: findElement,
  getElementSettings : getElementSettings
};
