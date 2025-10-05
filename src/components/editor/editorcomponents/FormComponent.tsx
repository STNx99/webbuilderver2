"use client";

import { Button } from "@/components/ui/button";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { useParams, useSearchParams } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { FormElement, InputElement } from "@/interfaces/elements.interface";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import ElementLoader from "../ElementLoader";

export default function FormComponent({ element, data }: EditorComponentProps) {
  const { getCommonProps } = useElementHandler();
  const { addElement, updateElement } = useElementStore<EditorElement>();
  const formElement = element as FormElement;
  const searhParams = useSearchParams();
  const { id } = useParams();

  const handleAddField = () => {
    const newField = elementHelper.createElement.create<InputElement>(
      "Input",
      id as string,
      formElement.id,
      searhParams.get("page") || undefined,
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

  return (
    <form
      {...getCommonProps(formElement)}
      className="flex flex-col gap-4 p-4 border rounded-lg"
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
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
