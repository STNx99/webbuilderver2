import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { FrameElement } from "@/interfaces/elements.interface";
import ElementLoader from "../ElementLoader";

const FrameComponent = ({ element }: EditorComponentProps) => {
  const frameElement = element as FrameElement;
  const { getCommonProps } = useElementHandler();

  // Defensive check: ensure styles is a valid object
  const safeStyles =
    frameElement.styles &&
    typeof frameElement.styles === "object" &&
    !Array.isArray(frameElement.styles)
      ? frameElement.styles
      : {};

  return (
    <div
      {...getCommonProps(frameElement)}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
    >
      <ElementLoader elements={frameElement.elements} />
    </div>
  );
};

export default FrameComponent;
