"use client";

import { useElementHandler } from "@/hooks";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { InputElement } from "@/interfaces/elements.interface";
import React from "react";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const InputComponent = ({ element }: EditorComponentProps) => {
  const inputElement = element as InputElement;
  const { getCommonProps } = useElementHandler();

  const safeStyles = elementHelper.getSafeStyles(inputElement);
  const commonProps = getCommonProps(inputElement);

  return (
    <input
      type="text"
      placeholder={inputElement.content || "Input field"}
      {...commonProps}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default InputComponent;
