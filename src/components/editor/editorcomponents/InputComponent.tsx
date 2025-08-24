import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { InputElement } from "@/interfaces/elements.interface";
import React from "react";

const InputComponent = ({ element }: EditorComponentProps) => {
  const inputElement = element as InputElement;
  const { getCommonProps } = useElementHandler();

  return (
    <input
      type="text"
      placeholder={inputElement.content || "Input field"}
      {...getCommonProps(inputElement)}
      style={{
        ...(inputElement.styles || {}),
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default InputComponent;
