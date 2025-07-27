import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { FrameElement } from "@/interfaces/element";
import { useElementHandler } from "@/hooks/useElementHandler";
import { elementHelper } from "@/utils/element/elementhelper";

const FrameComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const frameElement = element as FrameElement;
  const {getCommonProps} = useElementHandler();
  const childProps = { setContextMenuPosition, setShowContextMenu };

  return (
    <div
      {...getCommonProps(frameElement)}
    >
      {frameElement.elements?.map((child) =>
        elementHelper.renderChildElement(child, childProps),
      )}
    </div>
  );
};

export default FrameComponent;
