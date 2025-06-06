import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { ButtonElement } from "@/interfaces/element";

const ButtonComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const buttonElement = element as ButtonElement;

  return (
    <button
      style={buttonElement.styles}
      className={buttonElement.tailwindStyles}
    >
      {buttonElement.content || "Button"}
    </button>
  );
};

export default ButtonComponent;
