import { ContainerElement, EditorElement } from "@/types/global.type";

export function findElement(
  element: EditorElement,
  id: string
): EditorElement | undefined {
  if (element.id === id) {
    return element;
  }

  if ("elements" in element) {
    for (const child of (element as ContainerElement).elements) {
      const found = findElement(child, id);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
}
