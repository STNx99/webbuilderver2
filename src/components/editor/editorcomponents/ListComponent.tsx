import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ListElement } from "@/interfaces/elements.interface";
import { LayoutGroup } from "framer-motion";
import ElementLoader from "../ElementLoader";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const ListComponent = ({ element, data }: EditorComponentProps) => {
  const listElement = element as ListElement;

  const { getCommonProps } = useElementHandler();
  const safeStyles = elementHelper.getSafeStyles(listElement);

  // If data is an array, render each item using child elements as template
  const itemsToRender = Array.isArray(data) ? data : listElement.elements || [];

  return (
    <ul
      {...getCommonProps(listElement)}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
    >
      <LayoutGroup>
        {itemsToRender.map((item, index) => (
          <li key={index} className="list-item">
            {Array.isArray(data) ? (
              // If data is array, pass the item data to child elements
              <ElementLoader elements={listElement.elements} data={item} />
            ) : (
              // Otherwise, render the element directly
              <ElementLoader elements={[item]} />
            )}
          </li>
        ))}
      </LayoutGroup>
    </ul>
  );
};

export default ListComponent;
