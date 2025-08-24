"use client";

import { Button } from "@/components/ui/button";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/utils/element/elementhelper";
import { useParams, useSearchParams } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { FormElement, InputElement } from "@/interfaces/elements.interface";

type FormComponentProps = {
  element: EditorElement;
};

export default function FormComponent({ element }: FormComponentProps) {
  const { getCommonProps } = useElementHandler();
  const { addElement, updateElement } = useElementStore<EditorElement>();
  const formElement = element as FormElement;
  const { id } = useParams();

  const handleAddField = () => {
    const searhParams = useSearchParams();
    const newField = elementHelper.createElement<InputElement>(
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

  const isEditing = formElement.isSelected;

  return (
    <form
      {...getCommonProps(formElement)}
      className="flex flex-col gap-4 p-4 border rounded-lg"
      style={{
        ...(formElement.styles || {}),
        width: "100%",
        height: "100%",
      }}
    >
      {formElement.elements?.map((child, index) =>
        elementHelper.renderChildElement(child, {
          isEditing,
          onChange: (updatedChild: EditorElement) =>
            handleChildChange(index, updatedChild),
        }),
      )}

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
