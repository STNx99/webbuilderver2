import { find } from "lodash";
import { useElementStore } from "@/globalstore/elementstore";
import { EditorElement } from "@/types/global.type";

export function findElement(id: string): EditorElement | undefined {
  const elements = useElementStore((state) => state.elements);

  const findRecursive = (els: EditorElement[]): EditorElement | undefined => {
    const directMatch = find(els, (el) => el.id === id);
    if (directMatch) return directMatch;

    for (const el of els) {
      if ("elements" in el && Array.isArray(el.elements)) {
        const nestedMatch = findRecursive(el.elements);
        if (nestedMatch) return nestedMatch;
      }
    }
    return undefined;
  };

  return findRecursive(elements);
}
