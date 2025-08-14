import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { SelectElement } from "@/interfaces/element";

const SelectComponent = ({
  element,
}: EditorComponentProps) => {
  const selectElement = element as SelectElement;

  return (
    <select
      style={selectElement.styles}
      className={selectElement.tailwindStyles}
    >
      <option>{selectElement.content || "Select option"}</option>
    </select>
  );
};

export default SelectComponent;
