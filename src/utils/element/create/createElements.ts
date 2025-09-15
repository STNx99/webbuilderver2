import {
  ContainerElement,
  ContainerElementTemplate,
  EditorElement,
  ElementTemplate,
  ElementType,
} from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { getElementStrategy } from "./elementStrategyMap";
import { BuilderState } from "./elementCreateStrategy";
import { ElementStore } from "@/globalstore/elementstore";
import { SelectionStore } from "@/globalstore/selectionstore";
import { CSSStyles } from "@/interfaces/elements.interface";

/**
 * Lightweight utilities and improved typings for creating elements.
 *
 * This refactor:
 * - Replaces the class-based builder with small, focused functions.
 * - Improves type-safety and explicit guards for container templates.
 * - Centralizes error handling and logs informative messages.
 *
 * The public API remains compatible:
 * - createElement
 * - createElementFromTemplate
 */

/* Helpers */

const makeId = () => uuidv4();

const isContainerTemplate = (
  t: ElementTemplate,
): t is ContainerElementTemplate =>
  // runtime-check for presence of `elements` makes this safe across builds
  (t as Partial<Record<string, unknown>>).hasOwnProperty("elements");

/**
 * Build an element using the strategy map for complex element types (images, sections, etc).
 * Throws on missing strategy or build failure so callers can handle/return undefined if desired.
 */
function buildWithStrategy(options: BuilderState): EditorElement {
  const strategy = getElementStrategy(options.type);
  if (!strategy) {
    throw new Error(`No strategy available for element type "${options.type}"`);
  }
  const built = strategy.buildElement(options);
  if (!built) {
    throw new Error(
      `Strategy failed to build element for type "${options.type}" with id "${options.id}"`,
    );
  }
  return built;
}

/**
 * Create the baseline properties shared by every element.
 *
 * Note: Empty-string defaults have been replaced with `undefined` to better represent
 * absent values and align with optional typings across the codebase.
 */
function baseElementFactory({
  id,
  type,
  projectId,
  pageId,
  parentId,
  styles,
  tailwindStyles,
  src,
  href,
  content,
}: {
  id: string;
  type: ElementType;
  projectId: string;
  pageId?: string;
  parentId?: string;
  styles?: CSSStyles;
  tailwindStyles?: string;
  src?: string;
  href?: string;
  content?: string;
}): EditorElement {
  return {
    id,
    type,
    projectId,
    pageId: pageId ?? undefined,
    src: src ?? undefined,
    parentId: parentId && parentId !== "" ? parentId : undefined,
    styles: styles ?? {},
    tailwindStyles: tailwindStyles ?? undefined,
    elements: [], // may be overridden for container elements
    href: href ?? undefined,
    settings: {},
    content: content ?? undefined,
    isDraggedOver: false,
    isSelected: false,
    isHovered: false,
  } as EditorElement;
}

/* Public API */

/**
 * Creates a new EditorElement using strategy-based builders where available.
 * Keeps behavior compatible with previous implementation: it deselects current selection
 * and sets the created element as the selected element in global ElementStore.
 *
 * @param type Element type to create
 * @param projectId Project id to attach to the element
 * @param parentId Optional parent id
 * @param pageId Optional page id
 * @returns created element T or undefined on error
 */
export function createElement<T extends EditorElement>(
  type: ElementType,
  projectId: string,
  parentId?: string,
  pageId?: string,
): T | undefined {
  const id = makeId();

  try {
    const state: BuilderState = {
      id,
      type,
      projectId,
      src: undefined,
      parentId,
      pageId,
      styles: {},
      tailwindStyles: undefined,
      href: undefined,
      content: undefined,
      baseProperties: {
        isDraggedOver: false,
        isSelected: true,
        isHovered: false,
      },
    };

    const newElement = buildWithStrategy(state);

    ElementStore.getState().deselectAll();
    SelectionStore.getState().setSelectedElement(newElement as T);

    return newElement as T;
  } catch (err) {
    console.error(
      `[createElement] failed to create type="${type}" projectId="${projectId}" parentId="${parentId}" pageId="${pageId}":`,
      err,
    );
    return undefined;
  }
}

/**
 * Create an element tree from a template. Each template node will receive a new id
 * and parentId will be set to preserve tree structure. The function is defensive:
 * - It accepts both container and non-container templates.
 * - It ensures container children are recursively processed.
 *
 * @param element Element template to clone
 * @param projectId project id to attach
 * @param pageId optional page id to attach
 * @returns created root element or undefined on error
 */
export function createElementFromTemplate<T extends EditorElement>(
  element: ElementTemplate,
  projectId: string,
  pageId?: string,
): T | undefined {
  try {
    const recursivelyCreate = (
      tmpl: ElementTemplate,
      parentId?: string,
    ): EditorElement => {
      const id = makeId();
      const base = baseElementFactory({
        id,
        type: tmpl.type,
        projectId,
        pageId,
        parentId,
        styles: tmpl.styles ?? {},
        tailwindStyles: tmpl.tailwindStyles ?? undefined,
        src: tmpl.src ?? undefined,
        href: tmpl.href ?? undefined,
        content: tmpl.content ?? undefined,
      });

      if (isContainerTemplate(tmpl)) {
        const children = (tmpl as ContainerElementTemplate).elements ?? [];
        const createdChildren = children.map((child) =>
          recursivelyCreate(child, id),
        );
        (base as ContainerElement).elements = createdChildren;
      }

      base.settings = (tmpl.settings as unknown) ?? {};

      return base;
    };

    const root = recursivelyCreate(element, undefined);
    root.isSelected = true;
    ElementStore.getState().deselectAll();
    SelectionStore.getState().setSelectedElement(root as T);

    return root as T;
  } catch (err) {
    console.error(
      "[createElementFromTemplate] failed to create element from template:",
      err,
    );
    return undefined;
  }
}
