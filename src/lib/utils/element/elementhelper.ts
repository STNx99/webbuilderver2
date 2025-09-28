import {
  ContainerElement,
  ContainerElementType,
  EditableElementType,
  EditorElement,
  ElementTemplate,
  ElementType,
} from "@/types/global.type";
import { reject, find } from "lodash";
import { handleSwap } from "./handleSwap";
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

const findById = (
  els: EditorElement[],
  id: string,
): EditorElement | undefined => {
  for (const el of els) {
    if (el.id === id) return el;
    if (isContainerElement(el)) {
      const found = findById((el as ContainerElement).elements, id);
      if (found) return found;
    }
  }
  return undefined;
};

const mapUpdateById = (
  els: EditorElement[],
  id: string,
  updater: (el: EditorElement) => EditorElement,
): EditorElement[] =>
  els.map((el) => {
    if (el.id === id) return updater(el);
    if (isContainerElement(el)) {
      return {
        ...el,
        elements: mapUpdateById(el.elements, id, updater),
      } as EditorElement;
    }
    return el;
  });

const mapDeleteById = (els: EditorElement[], id: string): EditorElement[] => {
  return reject(els, (el) => el.id === id).map((el) => {
    if (isContainerElement(el)) {
      return {
        ...el,
        elements: mapDeleteById(el.elements, id),
      } as EditorElement;
    }
    return el;
  });
};

export const mapInsertAfterId = (
  els: EditorElement[],
  targetId: string,
  toInsert: EditorElement,
): EditorElement[] => {
  const idx = els.findIndex((e) => e.id === targetId);
  if (idx !== -1) {
    const newEls = [...els];
    newEls.splice(idx + 1, 0, toInsert);
    return newEls;
  }
  return els.map((el) => {
    if (isContainerElement(el)) {
      return {
        ...el,
        elements: mapInsertAfterId(el.elements, targetId, toInsert),
      } as EditorElement;
    }
    return el;
  });
};

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

  filterElementByPageId: (
    elements: EditorElement[],
    id?: string,
  ) => EditorElement[];

  findElement: (
    elements: EditorElement[],
    id: string,
  ) => EditorElement | undefined;

  getElementSettings: (element: EditorElement) => string | null;

  isContainerElement: (element: EditorElement) => element is ContainerElement;

  isEditableElement: (element: EditorElement) => boolean;

  computeTailwindFromStyles: (styles: Partial<React.CSSProperties>) => string;

  updateElementStyle: (
    element: EditorElement,
    styles: React.CSSProperties,
    updateElement: (id: string, updates: Partial<EditorElement>) => void,
  ) => void;

  findById: (els: EditorElement[], id: string) => EditorElement | undefined;

  mapUpdateById: (
    els: EditorElement[],
    id: string,
    updater: (el: EditorElement) => EditorElement,
  ) => EditorElement[];

  mapDeleteById: (els: EditorElement[], id: string) => EditorElement[];

  mapInsertAfterId: (
    els: EditorElement[],
    targetId: string,
    toInsert: EditorElement,
  ) => EditorElement[];
}

export const isContainerElement = (
  element: EditorElement,
): element is ContainerElement => {
  return CONTAINER_ELEMENT_TYPES.includes(element.type as ContainerElementType);
};

const filterElementByPageId = (
  elements: EditorElement[],
  id?: string,
): EditorElement[] => {
  return id
    ? elements.filter((element) => element.pageId === id)
    : elements.filter((element) => !element.pageId);
};

const findElement = (
  elements: EditorElement[],
  id: string,
): EditorElement | undefined => {
  const findRecursive = (els: EditorElement[]): EditorElement | undefined => {
    const directMatch = find(els, (el) => el.id === id);
    if (directMatch) return directMatch;

    for (const el of els) {
      if ("elements" in el && Array.isArray(el.elements)) {
        const nestedMatch = findRecursive(el.elements);
        if (nestedMatch) return nestedMatch;
      }
    }
    return undefined;
  };

  return findRecursive(elements);
};

const getElementSettings = (element: EditorElement): string | null => {
  if (!element || typeof element !== "object" || element.settings == null) {
    return null;
  }
  return JSON.stringify(element.settings);
};

const updateElementStyle = (
  element: EditorElement,
  styles: React.CSSProperties,
  updateElement: (id: string, updates: Partial<EditorElement>) => void,
): void => {
  updateElement(element.id, { styles });
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
  findById: findById,
  mapUpdateById: mapUpdateById,
  mapDeleteById: mapDeleteById,
  mapInsertAfterId: mapInsertAfterId,
};
