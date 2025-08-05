import {
    ContainerElement,
    ContainerElementType,
    EditableElementType,
    EditorElement,
    ElementType,
} from "@/types/global.type";
import { createElement } from "./create/createElements";
import { handleSwap } from "./handleSwap";
import { findElement } from "./findElement";
import { getElementSettings } from "./getElementSettings";
import { updateElementStyle } from "./updateElementStyle";
import { renderChildElement } from "../renderElements";
import React from "react";
import {
    CONTAINER_ELEMENT_TYPES,
    EDITABLE_ELEMENT_TYPES,
} from "@/constants/elements";

interface ElementHelper {
    createElement: (
        type: ElementType,
        projectId: string,
        parentId?: string,
    ) => EditorElement | undefined;

    handleSwap: (
        draggingElement: EditorElement,
        hoveredElement: EditorElement,
        updateElement: (
            id: string,
            updatedElement: Partial<EditorElement>,
        ) => void,
    ) => void;

    findElement: (id: string) => EditorElement | undefined;

    getElementSettings: (element: EditorElement) => string | null;

    isContainerElement: (element: EditorElement) => boolean;

    isEditableElement: (element: EditorElement) => boolean;

    renderChildElement: (element: EditorElement, props: any) => React.ReactNode;

    updateElementStyle: (
        element: EditorElement,
        styles: React.CSSProperties,
    ) => void;

}

export const elementHelper: ElementHelper = {
    createElement: createElement,
    handleSwap: handleSwap,
    findElement: findElement,
    getElementSettings: getElementSettings,
    isContainerElement: (
        element: EditorElement,
    ): element is ContainerElement => {
        return CONTAINER_ELEMENT_TYPES.includes(
            element.type as ContainerElementType,
        );
    },
    isEditableElement: (element: EditorElement): boolean => {
        return EDITABLE_ELEMENT_TYPES.includes(
            element.type as EditableElementType,
        );
    },
    renderChildElement: renderChildElement,
    updateElementStyle: updateElementStyle,
};
