import { EditorElement } from "@/types/global.type";

export function handleSwap(
  draggingElement: EditorElement,
  hoveredElement: EditorElement,
  updateElement: (id: string, updatedElement: Partial<EditorElement>) => void
) {
  if (draggingElement.id !== hoveredElement?.id) {
    return;
  }
  const draggingElementCopy = draggingElement;

  updateElement(hoveredElement.id, draggingElementCopy);

  updateElement(draggingElement.id, draggingElement);
}
