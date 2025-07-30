import { ContainerElement, ContainerElementType, EditableElementType, EditorElement } from "@/types/global.type";
import { createElements } from "./createElements";
import { handleSwap } from "./handleSwap";
import { findElement } from "./findElement";
import { getElementSettings } from "./getElementSettings";
import { updateElementStyle } from "./updateElementStyle";
import { renderChildElement } from "../renderElements";
import React from "react";
import { CONTAINER_ELEMENT_TYPES, EDITABLE_ELEMENT_TYPES } from "@/constants/elements";
import { findParent } from "./findParent";

interface ElementHelper {
  createElements: (
    type: string,
    x: number,
    y: number,
    projectId: string,
    src?: string,
    parentId?: string
  ) => EditorElement | undefined;

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
  
  isContainerElement: (element: EditorElement) => boolean;
 
  isEditableElement: (element: EditorElement) => boolean; 
  
  renderChildElement: (
    element: EditorElement,
    props: any
  ) => React.ReactNode ;
  
  updateElementStyle: (element: EditorElement, styles: React.CSSProperties ) => void;
  
  findParent: (id: string) => EditorElement | undefined;
}

export const elementHelper: ElementHelper = {
  createElements: createElements,
  handleSwap: handleSwap,
  findElement: findElement,
  getElementSettings : getElementSettings,
  isContainerElement: (element: EditorElement): element is ContainerElement => {
    return CONTAINER_ELEMENT_TYPES.includes(element.type as ContainerElementType);
  },
  isEditableElement: (element: EditorElement): boolean => {
    return EDITABLE_ELEMENT_TYPES.includes(element.type as EditableElementType);
  },
  renderChildElement: renderChildElement,
  updateElementStyle : updateElementStyle,
  findParent: findParent
};