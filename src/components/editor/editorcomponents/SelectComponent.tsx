import { EditorComponentProps } from "@/interfaces/editor.interface";
import { SelectElement } from "@/interfaces/elements.interface";
import React, { useEffect } from "react";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";

const SelectComponent = ({ element }: EditorComponentProps) => {
  const selectElement = element as SelectElement;
  const { elementRef, registerEvents, createEventHandlers, eventsActive } =
    useElementEvents({
      elementId: element.id,
      projectId: element.projectId,
    });

  const safeStyles = elementHelper.getSafeStyles(selectElement);

  // Register events when element events change
  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();

  return (
    <select
      ref={elementRef as React.RefObject<HTMLSelectElement>}
      {...eventHandlers}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
        cursor: eventsActive ? "pointer" : "inherit",
        userSelect: eventsActive ? "none" : "auto",
      }}
      className={selectElement.tailwindStyles}
    >
      <option>{selectElement.content || "Select option"}</option>
    </select>
  );
};

export default SelectComponent;
