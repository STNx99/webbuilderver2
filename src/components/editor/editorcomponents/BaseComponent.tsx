import React from "react";
import DOMPurify from "dompurify";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { TextElement } from "@/interfaces/elements.interface";

const BaseComponent = ({ element, data }: EditorComponentProps) => {
  const baseElement = element as TextElement;

  const { getCommonProps } = useElementHandler();

  // Defensive check: ensure styles is a valid object
  const safeStyles =
    baseElement.styles &&
    typeof baseElement.styles === "object" &&
    !Array.isArray(baseElement.styles)
      ? baseElement.styles
      : {};

  // Use data for content if available, otherwise fall back to element.content
  const content = data !== undefined ? String(data) : element.content || "";

  return (
    <div
      {...getCommonProps(baseElement)}
      style={{ ...safeStyles, width: "100%", height: "100%" }}
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content),
      }}
    ></div>
  );
};

export default BaseComponent;
