import React from "react";
import DOMPurify from "dompurify";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { TextElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const BaseComponent = ({ element, data }: EditorComponentProps) => {
  const baseElement = element as TextElement;

  const { getCommonProps } = useElementHandler();

  const safeStyles = elementHelper.getSafeStyles(baseElement);

  const commonProps = getCommonProps(baseElement);
  const isEditing = commonProps.contentEditable;

  let content =
    (typeof data === "string" ? data : "") ||
    (typeof data === "object" && data && typeof data.content === "string"
      ? data.content
      : "") ||
    (typeof element.content === "string" ? element.content : "") ||
    "";

  // Apply placeholder replacement if content is from element.content and data is available
  if (typeof element.content === "string" && data && typeof data === "object") {
    content = elementHelper.replacePlaceholders(element.content, data);
  }

  // Show raw content with placeholders when editing, replaced content when not editing
  const displayContent = isEditing ? element.content : content;

  return (
    <div
      {...commonProps}
      style={{ ...safeStyles, width: "100%", height: "100%" }}
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(displayContent),
      }}
    ></div>
  );
};

export default BaseComponent;
