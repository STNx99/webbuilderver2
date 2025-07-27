import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import DOMPurify from "dompurify";
import { TextElement } from "@/interfaces/element";
import { useElementHandler } from "@/hooks/useElementHandler";

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
