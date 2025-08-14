import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { FrameElement } from "@/interfaces/element";
import { useElementHandler } from "@/hooks/useElementHandler";
import { elementHelper } from "@/utils/element/elementhelper";

const FrameComponent = ({
  element,
}: EditorComponentProps) => {
  const frameElement = element as FrameElement;
  const {getCommonProps} = useElementHandler();

  return (
    <div
      {...getCommonProps(frameElement)}
    >
      {frameElement.elements?.map((child) =>
          elementHelper.renderChildElement(child, {}),
      )}
    </div>
  );
};

export default FrameComponent;
