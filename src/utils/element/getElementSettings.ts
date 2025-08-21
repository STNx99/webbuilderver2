import { EditorElement } from "@/types/global.type";

function convertToString(value: unknown): string {
  return JSON.stringify(value);
}

export function getElementSettings(element: EditorElement): string | null {
  if (!element || typeof element !== "object" || element.settings == null) {
    return null;
  }
  return convertToString(element.settings);
}
