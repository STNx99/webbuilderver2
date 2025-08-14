import { Button } from "@/components/ui/button";
import useElementStore from "@/globalstore/elementstore";
import { useElementHandler } from "@/hooks/useElementHandler";
import { FormElement } from "@/interfaces/element";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/utils/element/elementhelper";
import { useParams } from "next/navigation";

type FormComponentProps = {
    element: EditorElement;
};

export default function FormComponent({ element }: FormComponentProps) {
    const { getCommonProps } = useElementHandler();
    const { addElement, updateElement } = useElementStore();
    const formElement = element as FormElement;
    const { id } = useParams();

    const handleAddField = () => {
        const newField = elementHelper.createElement(
            "Input",
            id as string,
            formElement.id,
        );
        if (!newField) return;
        addElement(newField)
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
        >
            {formElement.elements?.map((child, index) =>
                elementHelper.renderChildElement(child, {
                    isEditing,
                    onChange: (updatedChild: EditorElement) =>
                        handleChildChange(index, updatedChild),
                }),
            )}

            {isEditing && (
                <Button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleAddField}
                >
                    + Add Field
                </Button>
            )}
        </form>
    );
}
