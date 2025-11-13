"use client";
import React, { useEffect } from "react";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { useElementHandler } from "@/hooks";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { SectionElement } from "@/interfaces/elements.interface";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import ElementLoader from "../ElementLoader";

const SectionComponent = ({ element, data }: EditorComponentProps) => {
  const sectionElement = element as SectionElement;
  const { insertElement } = useElementStore();
  const { selectedElement } = useSelectionStore();
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { getCommonProps } = useElementHandler();
  const { elementRef, registerEvents, createEventHandlers, eventsActive } =
    useElementEvents({
      elementId: element.id,
    });

  const safeStyles = elementHelper.getSafeStyles(sectionElement);

  // Register events when element events change
  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();

  const handleCreateSeciont = () => {
    const newElement = elementHelper.createElement.create<SectionElement>(
      "Section",
      id as string,
      undefined,
      searchParams.get("page") || undefined,
    );
    console.log("New Section Element:", newElement);
    if (newElement) insertElement(element, newElement);
  };
  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      {...getCommonProps(sectionElement)}
      {...eventHandlers}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: eventsActive ? "pointer" : "inherit",
        userSelect: eventsActive ? "none" : "auto",
      }}
    >
      <ElementLoader elements={sectionElement.elements} data={data} />
      {selectedElement?.id === sectionElement.id && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: -30,
            zIndex: 10,
          }}
        >
          <Button
            className="h-6 text-primary-foreground"
            onDoubleClick={handleCreateSeciont}
          >
            + Add Section
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionComponent;
