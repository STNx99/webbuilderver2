import { ElementStore } from "@/globalstore/elementstore";
import { EditorElement } from "@/types/global.type";

export function filterElementByPageId(id?: string): EditorElement[] {
  const elements = ElementStore.getState().elements;

  return id
    ? elements.filter((element) => element.pageId === id)
    : elements.filter((element) => !element.pageId);
}
