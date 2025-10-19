import React from "react";
import { useElementHandler } from "@/hooks";
import DOMPurify from "isomorphic-dompurify";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ButtonElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const ButtonComponent = ({ element }: EditorComponentProps) => {
  const buttonElement = element as ButtonElement;
  const { getCommonProps } = useElementHandler();

  const safeStyles = elementHelper.getSafeStyles(buttonElement);

  return (
    <button
      {...getCommonProps(buttonElement)}
      type={"button"}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(element.content || ""),
      }}
    ></button>
  );
};

export default ButtonComponent;
