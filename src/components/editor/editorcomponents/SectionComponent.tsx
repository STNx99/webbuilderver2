import React from "react";
import { elementHelper } from "@/utils/element/elementhelper";
import { useElementHandler } from "@/hooks/useElementHandler";
import { SectionElement } from "@/interfaces/elements.interface";
import { EditorComponentProps } from "@/interfaces/editor.interface";

const SectionComponent = ({ element }: EditorComponentProps) => {
    const sectionElement = element as SectionElement;
    const { getCommonProps } = useElementHandler();

    return (
        <div {...getCommonProps(sectionElement)}>
            {sectionElement.elements.map((childElement) => {
                return elementHelper.renderChildElement(childElement, {});
            })}
        </div>
    );
};

export default SectionComponent;
