import { EditorElement, ContainerElement } from "@/types/global.type";
import { elementHelper } from "./elementhelper";

function findPath(
  elements: EditorElement[],
  id: string,
  path: number[] = [],
): number[] | null {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === id) return [...path, i];
    if (elementHelper.isContainerElement(elements[i])) {
      const found = findPath((elements[i] as ContainerElement).elements, id, [
        ...path,
        i,
      ]);
      if (found) return found;
    }
  }
  return null;
}

function getElementAtPath(
  elements: EditorElement[],
  path: number[],
): EditorElement | null {
  let current: EditorElement[] = elements;
  for (let i = 0; i < path.length; i++) {
    const idx = path[i];
    if (idx >= current.length) return null;
    const el = current[idx];
    if (i === path.length - 1) return el;
    if (elementHelper.isContainerElement(el)) {
      current = (el as ContainerElement).elements;
    } else {
      return null;
    }
  }
  return null;
}

function setElementAtPath(
  elements: EditorElement[],
  path: number[],
  newEl: EditorElement,
): EditorElement[] {
  if (path.length === 0) return elements;
  const [idx, ...rest] = path;
  const newElements = [...elements];
  if (rest.length === 0) {
    newElements[idx] = newEl;
  } else {
    if (elementHelper.isContainerElement(newElements[idx])) {
      (newElements[idx] as ContainerElement).elements = setElementAtPath(
        (newElements[idx] as ContainerElement).elements,
        rest,
        newEl,
      );
    }
  }
  return newElements;
}

export function handleSwap(
  draggingElement: EditorElement,
  hoveredElement: EditorElement,
  elements: EditorElement[],
  setElements: (elements: EditorElement[]) => void,
) {
  if (!hoveredElement || draggingElement.id === hoveredElement.id) {
    return;
  }

  const path1 = findPath(elements, draggingElement.id);
  const path2 = findPath(elements, hoveredElement.id);

  if (!path1 || !path2) return;

  if (draggingElement.parentId !== hoveredElement.parentId) return;

  const el1 = getElementAtPath(elements, path1);
  const el2 = getElementAtPath(elements, path2);

  if (!el1 || !el2) return;

  let newElements = setElementAtPath(elements, path1, el2);
  newElements = setElementAtPath(newElements, path2, el1);

  setElements(newElements);
}
