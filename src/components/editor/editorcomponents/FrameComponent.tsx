import React, { useEffect } from "react";
import { useElementHandler } from "@/hooks";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { FrameElement } from "@/interfaces/elements.interface";
import ElementLoader from "../ElementLoader";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const FrameComponent = ({ element, data }: EditorComponentProps) => {
  const frameElement = element as FrameElement;
  const { getCommonProps } = useElementHandler();
  const { elementRef, registerEvents, createEventHandlers, eventsActive } =
    useElementEvents({
      elementId: element.id,
    });

  const safeStyles = elementHelper.getSafeStyles(frameElement);

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
      {...getCommonProps(frameElement)}
      {...eventHandlers}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
        cursor: eventsActive ? "pointer" : "inherit",
        userSelect: eventsActive ? "none" : "auto",
      }}
    >
      <ElementLoader elements={frameElement.elements} data={data} />
    </div>
  );
};

export default FrameComponent;
