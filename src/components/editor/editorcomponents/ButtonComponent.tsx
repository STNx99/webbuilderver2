import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import DOMPurify from "dompurify";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ButtonElement } from "@/interfaces/elements.interface";

const ButtonComponent = ({ element }: EditorComponentProps) => {
  const buttonElement = element as ButtonElement;
  const { getCommonProps } = useElementHandler();

  // Defensive check: ensure styles is a valid object
  const safeStyles =
    buttonElement.styles &&
    typeof buttonElement.styles === "object" &&
    !Array.isArray(buttonElement.styles)
      ? buttonElement.styles
      : {};

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
