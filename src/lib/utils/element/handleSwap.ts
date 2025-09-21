import { EditorElement } from "@/types/global.type";

export function handleSwap(
  draggingElement: EditorElement,
  hoveredElement: EditorElement,
  elements: EditorElement[],
  setElements: (elements: EditorElement[]) => void,
) {
  if (!hoveredElement || draggingElement.id === hoveredElement.id) {
    return;
  }

  const idx1 = elements.findIndex((e) => e.id === draggingElement.id);
  const idx2 = elements.findIndex((e) => e.id === hoveredElement.id);

  if (idx1 !== -1 && idx2 !== -1) {
    const newElements = [...elements];
    [newElements[idx1], newElements[idx2]] = [
      newElements[idx2],
      newElements[idx1],
    ];
    setElements(newElements);
  }
}
