import { ContainerElement, EditorElement } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { map, isArray, has } from "lodash";

export function prepareElements(
  element: Partial<EditorElement>,
  parentId: string | undefined = undefined,
): EditorElement {
  const preparedElement: EditorElement = {
    ...element,
    id: uuidv4(),
    parentId: parentId || undefined,
  } as EditorElement;

  if (has(element, "elements") && isArray(element.elements)) {
    const containerElement = preparedElement as ContainerElement;
    containerElement.elements = map(
      element.elements as EditorElement[],
      (childElement) => prepareElements(childElement, preparedElement.id),
    );
  }

  return preparedElement;
}
