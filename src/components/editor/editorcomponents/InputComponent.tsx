import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { InputElement } from "@/interfaces/elements.interface";
import React from "react";

const InputComponent = ({ element }: EditorComponentProps) => {
  const inputElement = element as InputElement;
  const { getCommonProps } = useElementHandler();

  // Defensive check: ensure styles is a valid object
  const safeStyles =
    inputElement.styles &&
    typeof inputElement.styles === "object" &&
    !Array.isArray(inputElement.styles)
      ? inputElement.styles
      : {};

  return (
    <input
      type="text"
      placeholder={inputElement.content || "Input field"}
      {...getCommonProps(inputElement)}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default InputComponent;
