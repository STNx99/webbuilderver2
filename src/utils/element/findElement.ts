import { useElementStore } from "@/globalstore/elementstore";
import { EditorElement } from "@/types/global.type";

export function findElement(
  id: string
): EditorElement | undefined {
  const elements = useElementStore(state=> state.elements);

  function find(elements: EditorElement[]): EditorElement | undefined {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if ("elements" in element && Array.isArray(element.elements)) {
        const found = find(element.elements);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  return find(elements);
}
