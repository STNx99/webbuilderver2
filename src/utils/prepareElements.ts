import { ContainerElement, EditorElement } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";

export function prepareElements(
    element: Partial<EditorElement>,
    parentId: string | undefined = undefined
): EditorElement {
  const preparedElement: EditorElement = {
    ...element,
    id: uuidv4(),
    parentId: parentId || undefined,
  } as EditorElement;

  // Check if this element can contain child elements
  if ('elements' in element && Array.isArray(element.elements)) {
    const containerElement = preparedElement as ContainerElement;
    containerElement.elements = element.elements.map((childElement) => {
      return prepareElements(childElement, preparedElement.id);
    });
  }

  return preparedElement;
}
