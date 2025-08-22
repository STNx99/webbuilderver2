import { EditorComponentProps } from "@/interfaces/editor.interface";
import { SelectElement } from "@/interfaces/elements.interface";
import React from "react";

const SelectComponent = ({ element }: EditorComponentProps) => {
  const selectElement = element as SelectElement;

  return (
    <select
      style={{ ...selectElement.styles, width: "100%", height: "100%" }}
      className={selectElement.tailwindStyles}
    >
      <option>{selectElement.content || "Select option"}</option>
    </select>
  );
};

export default SelectComponent;
