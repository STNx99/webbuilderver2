"use client";

import { Button } from "@/components/ui/button";
import { useElementHandler } from "@/hooks";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { FormElement, InputElement } from "@/interfaces/elements.interface";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import ElementLoader from "../ElementLoader";
import { usePageStore } from "@/globalstore/pagestore";

export default function FormComponent({ element, data }: EditorComponentProps) {
  const { id } = useParams();
  const { getCommonProps } = useElementHandler();
  const { elementRef, registerEvents, createEventHandlers, eventsActive } =
    useElementEvents({
      elementId: element.id,
      projectId: id as string,
    });
  const { addElement, updateElement } = useElementStore<EditorElement>();
  const formElement = element as FormElement;
  const { currentPage } = usePageStore();

  const handleAddField = () => {
    const newField = elementHelper.createElement.create<InputElement>(
      "Input",
      currentPage?.Id || "",
      formElement.id,
    );
    if (!newField) return;
    addElement(newField);
  };

  const handleChildChange = (index: number, updatedChild: EditorElement) => {
    const updated = [...formElement.elements];
    updated[index] = updatedChild;
    updateElement(formElement.id, { ...formElement, elements: updated });
  };

  const { selectedElement } = useSelectionStore();
  const isEditing = selectedElement?.id === formElement.id;

  const safeStyles = elementHelper.getSafeStyles(formElement);

  // Register events when element events change
  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();

  return (
    <form
      ref={elementRef as React.RefObject<HTMLFormElement>}
      data-element-id={element.id}
      data-element-type={element.type}
      {...getCommonProps(formElement)}
      {...eventHandlers}
      className="flex flex-col gap-4 p-4 border rounded-lg"
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
        cursor: eventsActive ? "pointer" : "inherit",
        userSelect: eventsActive ? "none" : "auto",
      }}
    >
      <ElementLoader elements={formElement.elements} data={data} />

      <div className="flex flex-row w-full">
        {isEditing && (
          <Button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded w-full"
            onClick={handleAddField}
          >
            + Add Field
          </Button>
        )}
      </div>
    </form>
  );
}
