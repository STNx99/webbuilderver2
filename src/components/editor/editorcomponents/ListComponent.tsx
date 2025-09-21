import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ListElement } from "@/interfaces/elements.interface";
import { LayoutGroup } from "framer-motion";
import ElementLoader from "../ElementLoader";

const ListComponent = ({ element }: EditorComponentProps) => {
  const listElement = element as ListElement;

  const { getCommonProps } = useElementHandler();
  // Defensive check: ensure styles is a valid object
  const safeStyles =
    listElement.styles &&
    typeof listElement.styles === "object" &&
    !Array.isArray(listElement.styles)
      ? listElement.styles
      : {};

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
        {listElement.elements?.map((item, index) => (
          <li key={index} className="list-item">
            <ElementLoader elements={[item]} />
          </li>
        ))}
      </LayoutGroup>
    </ul>
  );
};

export default ListComponent;
