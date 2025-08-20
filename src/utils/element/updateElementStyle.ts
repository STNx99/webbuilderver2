import { ElementStore } from "@/globalstore/elementstore";
import { EditorElement } from "@/types/global.type";

/**
 * Updates the styles of an element using the Zustand store
 * @param elementId - The ID of the element to update
 * @param property - The type of property to update
 * @param value - The value to apply
 */
export const updateElementStyle = (
  element: EditorElement,
  styles: React.CSSProperties,
): void => {
  const updateElement = ElementStore.getState().updateElement;

  updateElement(element.id, { styles: styles });
};
