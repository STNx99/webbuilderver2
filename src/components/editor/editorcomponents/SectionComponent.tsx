import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { SectionElement } from "@/interfaces/element";
import { elementHelper } from "@/utils/elements/elementhelper";
import { useElementHandler } from "@/hooks/useElementHandler";

const SectionComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const sectionElement = element as SectionElement;
  const { getCommonProps } = useElementHandler();

  return (
    <div {...getCommonProps(sectionElement)}>
      {sectionElement.elements.map((childElement) => {
        return elementHelper.renderChildElement(childElement, {
          setContextMenuPosition,
          setShowContextMenu,
        });
      })}
    </div>
  );
};

export default SectionComponent;
