import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { FormElement } from "@/interfaces/element";

const FormComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const formElement = element as FormElement;

  return (
    <form style={formElement.styles} className={formElement.tailwindStyles}>
      {formElement.content || "Form Component"}
    </form>
  );
};

export default FormComponent;
