import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import DOMPurify from "dompurify";

const BaseComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
    
  return (
    <div
      style={element.styles}
      className={element.tailwindStyles}
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(element.content || ""),
      }}
    ></div>
  );
};

export default BaseComponent;
