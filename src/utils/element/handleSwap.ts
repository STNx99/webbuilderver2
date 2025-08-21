import { EditorElement } from "@/types/global.type";

export function handleSwap(
  draggingElement: EditorElement,
  hoveredElement: EditorElement,
  updateElement: (id: string, updatedElement: Partial<EditorElement>) => void
) {
  if (!hoveredElement || draggingElement.id === hoveredElement.id) {
    return;
  }

  const { id: dragId, ...dragRest } = draggingElement;
  const { id: hoverId, ...hoverRest } = hoveredElement;

  updateElement(draggingElement.id, hoverRest);
  updateElement(hoveredElement.id, dragRest);
}
