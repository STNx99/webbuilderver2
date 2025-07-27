import { FormElement, InputElement, SelectElement } from "@/interfaces/element";
import { EditorElement } from "@/types/global.type";

function convertToString(value: Object): string {
  return JSON.stringify(value);
}

export function getElementSettings(element: EditorElement): string | null {
  let settings: string | null = null;
  switch (element.type) {
    case "Form":
      settings = convertToString((element as FormElement).formSettings || {});
      break;
    case "Input":
      settings = convertToString((element as InputElement).inputSettings || {});
      break;
    case "Select":
      settings = convertToString(
        (element as SelectElement).selectSettings || {}
      );
      break;
    default:
      break;
  }
  return settings;
}
