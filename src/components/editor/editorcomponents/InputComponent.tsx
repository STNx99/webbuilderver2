import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { InputElement } from "@/interfaces/element";

const InputComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const inputElement = element as InputElement;

  return (
    <input
      type="text"
      placeholder={inputElement.content || "Input field"}
      style={inputElement.styles}
      className={inputElement.tailwindStyles}
    />
  );
};

export default InputComponent;
