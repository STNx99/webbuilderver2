import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { FormElement } from "@/interfaces/element";

const SectionComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const formElement = element as FormElement;

  return (
    <div>
      SectionELement
    </div>
  );
};

export default SectionComponent;
