import { EditorComponentProps } from "@/interfaces/editor.interface";
import { SelectElement } from "@/interfaces/elements.interface";
import React from "react";

const SelectComponent = ({ element }: EditorComponentProps) => {
  const selectElement = element as SelectElement;

  // Defensive check: ensure styles is a valid object
  const safeStyles =
    selectElement.styles &&
    typeof selectElement.styles === "object" &&
    !Array.isArray(selectElement.styles)
      ? selectElement.styles
      : {};

  return (
    <select
      style={{ ...safeStyles, width: "100%", height: "100%" }}
      className={selectElement.tailwindStyles}
    >
      <option>{selectElement.content || "Select option"}</option>
    </select>
  );
};

export default SelectComponent;
