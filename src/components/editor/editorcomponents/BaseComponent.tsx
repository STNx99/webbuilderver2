import React, { useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useElementHandler } from "@/hooks";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { TextElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const BaseComponent = ({ element, data }: EditorComponentProps) => {
  const baseElement = element as TextElement;

  const { getCommonProps } = useElementHandler();
  const { elementRef, registerEvents, createEventHandlers, eventsActive } =
    useElementEvents({
      elementId: element.id,
    });

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

  if (typeof element.content === "string" && data && typeof data === "object") {
    content = elementHelper.replacePlaceholders(element.content, data);
  }

  const displayContent = isEditing ? element.content : content;

  // Register events when element events change
  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      {...commonProps}
      {...eventHandlers}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
        cursor: eventsActive ? "pointer" : "inherit",
        userSelect: eventsActive ? "none" : "auto",
      }}
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(displayContent),
      }}
    ></div>
  );
};

export default BaseComponent;
