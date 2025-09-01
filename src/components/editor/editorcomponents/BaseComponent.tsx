import React from "react";
import DOMPurify from "dompurify";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { TextElement } from "@/interfaces/elements.interface";

const BaseComponent = ({ element }: EditorComponentProps) => {
  const baseElement = element as TextElement;

  const { getCommonProps } = useElementHandler();
  return (
    <div
      {...getCommonProps(baseElement)}
      style={{ ...(baseElement.styles || {}), width: "100%", height: "100%" }}
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(element.content || ""),
      }}
    ></div>
  );
};

export default BaseComponent;
