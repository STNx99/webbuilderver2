import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { elementHelper } from "@/utils/element/elementhelper";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ListElement } from "@/interfaces/elements.interface";

const ListComponent = ({ element }: EditorComponentProps) => {
  const listElement = element as ListElement;

  const { getCommonProps } = useElementHandler();
  return (
    <ul {...getCommonProps(listElement)}>
      {listElement.elements?.map((item, index) => (
        <li key={index} className="list-item">
          {elementHelper.renderChildElement(item, {})}
        </li>
      ))}
    </ul>
  );
};

export default ListComponent;
