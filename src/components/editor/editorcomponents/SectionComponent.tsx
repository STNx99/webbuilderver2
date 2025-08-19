import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { SectionElement } from "@/interfaces/element";
import { elementHelper } from "@/utils/element/elementhelper";
import { useElementHandler } from "@/hooks/useElementHandler";

const SectionComponent = ({ element }: EditorComponentProps) => {
    const sectionElement = element as SectionElement;
    const { getCommonProps } = useElementHandler();

    return (
        <section {...getCommonProps(sectionElement)}>
            {sectionElement.elements.map((childElement) => {
                return elementHelper.renderChildElement(childElement, {});
            })}
        </section>
    );
};

export default SectionComponent;
