import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { ListElement } from "@/interfaces/element";

const ListComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const listElement = element as ListElement;

  return (
    <ul style={listElement.styles} className={listElement.tailwindStyles}>
      <li>{listElement.content || "List item"}</li>
    </ul>
  );
};

export default ListComponent;
