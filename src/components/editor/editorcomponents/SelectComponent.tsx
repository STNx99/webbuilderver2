import { EditorComponentProps } from "@/interfaces/editor.interface";
import { SelectElement } from "@/interfaces/elements.interface";
import React from "react";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const SelectComponent = ({ element }: EditorComponentProps) => {
  const selectElement = element as SelectElement;

  const safeStyles = elementHelper.getSafeStyles(selectElement);

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
