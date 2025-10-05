import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { FrameElement } from "@/interfaces/elements.interface";
import ElementLoader from "../ElementLoader";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const FrameComponent = ({ element, data }: EditorComponentProps) => {
  const frameElement = element as FrameElement;
  const { getCommonProps } = useElementHandler();

  const safeStyles = elementHelper.getSafeStyles(frameElement);

  return (
    <div
      {...getCommonProps(frameElement)}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
    >
      <ElementLoader elements={frameElement.elements} data={data} />
    </div>
  );
};

export default FrameComponent;
