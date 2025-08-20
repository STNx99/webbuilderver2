import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { elementHelper } from "@/utils/element/elementhelper";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { FrameElement } from "@/interfaces/elements.interface";

const FrameComponent = ({ element }: EditorComponentProps) => {
  const frameElement = element as FrameElement;
  const { getCommonProps } = useElementHandler();

  return (
    <div {...getCommonProps(frameElement)}>
      {frameElement.elements?.map((child) =>
        elementHelper.renderChildElement(child, {}),
      )}
    </div>
  );
};

export default FrameComponent;
