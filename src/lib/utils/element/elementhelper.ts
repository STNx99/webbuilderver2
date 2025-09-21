import {
  ContainerElement,
  ContainerElementType,
  EditableElementType,
  EditorElement,
  ElementTemplate,
  ElementType,
} from "@/types/global.type";
import { handleSwap } from "./handleSwap";
import { findElement } from "./findElement";
import { getElementSettings } from "./getElementSettings";
import { updateElementStyle } from "./updateElementStyle";
import computeTailwindFromStyles from "./computeTailwindFromStyles";
import React from "react";
import {
  CONTAINER_ELEMENT_TYPES,
  EDITABLE_ELEMENT_TYPES,
} from "@/constants/elements";
import {
  createElement,
  createElementFromTemplate,
} from "./create/createElements";
import { filterElementByPageId } from "./filterElementByPageId";

interface ICreateElment {
  create: <T extends EditorElement>(
    type: ElementType,
    projectId: string,
    parentId?: string,
    pageId?: string,
  ) => T | undefined;

  createFromTemplate: <T extends EditorElement>(
    element: ElementTemplate,
    projectId: string,
    pageId?: string,
  ) => T | undefined;
}

interface ElementHelper {
  createElement: ICreateElment;

  handleSwap: (
    draggingElement: EditorElement,
    hoveredElement: EditorElement,
    elements: EditorElement[],
    setElements: (elements: EditorElement[]) => void,
  ) => void;

  filterElementByPageId: (id?: string) => EditorElement[];

  findElement: (id: string) => EditorElement | undefined;

  getElementSettings: (element: EditorElement) => string | null;

  isContainerElement: (element: EditorElement) => element is ContainerElement;

  isEditableElement: (element: EditorElement) => boolean;

  computeTailwindFromStyles: (styles: Partial<React.CSSProperties>) => string;

  updateElementStyle: (
    element: EditorElement,
    styles: React.CSSProperties,
  ) => void;
}

export const isContainerElement = (
  element: EditorElement,
): element is ContainerElement => {
  return CONTAINER_ELEMENT_TYPES.includes(element.type as ContainerElementType);
};

export const elementHelper: ElementHelper = {
  createElement: {
    create: createElement,
    createFromTemplate: createElementFromTemplate,
  },
  handleSwap: handleSwap,
  findElement: findElement,
  getElementSettings: getElementSettings,
  isContainerElement: isContainerElement,
  filterElementByPageId: filterElementByPageId,
  isEditableElement: (element: EditorElement): boolean => {
    return EDITABLE_ELEMENT_TYPES.includes(element.type as EditableElementType);
  },
  computeTailwindFromStyles: computeTailwindFromStyles,
  updateElementStyle: updateElementStyle,
};
