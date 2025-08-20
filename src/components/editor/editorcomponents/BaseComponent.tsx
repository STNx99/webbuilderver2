import React from "react";
import DOMPurify from "dompurify";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { TextElement } from "@/interfaces/elements.interface";

const BaseComponent = ({
  element,
}: EditorComponentProps) => {
  const baseElement = element as TextElement;
  
  const { getCommonProps} = useElementHandler();
  return (
    <div
      {...getCommonProps(baseElement)}
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(element.content || ""),
      }}
    ></div>
  );
};

export default BaseComponent;
