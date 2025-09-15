import { create } from "zustand";
import { ContainerElement, EditorElement } from "@/types/global.type";
import { elementHelper } from "@/utils/element/elementhelper";
import { elementService } from "@/services/element";
import { debounce } from "lodash";
import { cloneDeep, find, reject } from "lodash";
import { useSelectionStore } from "./selectionstore";

type ElementStore<TElement extends EditorElement> = {
  // States
  elements: TElement[];

  // Actions
  setElements: (elements: TElement[]) => void;
  loadElements: (elements: TElement[]) => void;
  updateElement: (id: string, updatedElement: Partial<TElement>) => void;
  deleteElement: (id: string) => void;
  addElement: (...newElements: TElement[]) => void;
  deselectAll: () => void;
  dehoverAll: () => void;
  updateAllElements: (update: Partial<EditorElement>) => void;
  insertElement: (element: TElement, elementToBeInserted: TElement) => void;
};

/**
 * Payload used by the per-element debouncer for persisted updates.
 * `PersistElement` intentionally omits UI-only flags so the debounced payload
 * only contains fields intended for persistence.
 */
type PersistElement = Omit<
  EditorElement,
  "isSelected" | "isHovered" | "isDraggedOver"
> & {
  isSelected?: boolean;
  isHovered?: boolean;
  isDraggedOver?: boolean;
};

type UpdatePayload<TElement extends EditorElement> = {
  element: PersistElement;
  prevElements: TElement[];
  settings?: string | null;
};

type Debouncer<TElement extends EditorElement> = ReturnType<
  typeof debounce<(payload: UpdatePayload<TElement>) => Promise<void>>
>;

const createElementStore = <TElement extends EditorElement>() => {
  return create<ElementStore<TElement>>((set, get) => {
    const debouncers = new Map<string, Debouncer<TElement>>();

    const findById = (
      els: EditorElement[],
      id: string,
    ): EditorElement | undefined => {
      return find(els, (el) => {
        if (el.id === id) return true;
        if (elementHelper.isContainerElement(el)) {
          const found = findById((el as ContainerElement).elements, id);
          return !!found;
        }
        return false;
      });
    };

    const mapUpdateById = (
      els: EditorElement[],
      id: string,
      updater: (el: EditorElement) => EditorElement,
    ): EditorElement[] =>
      els.map((el) => {
        if (el.id === id) return updater(el);
        if (elementHelper.isContainerElement(el)) {
          return {
            ...el,
            elements: mapUpdateById(el.elements, id, updater),
          } as EditorElement;
        }
        return el;
      });

    const mapDeleteById = (
      els: EditorElement[],
      id: string,
    ): EditorElement[] => {
      return reject(els, (el) => el.id === id).map((el) => {
        if (elementHelper.isContainerElement(el)) {
          return {
            ...el,
            elements: mapDeleteById(el.elements, id),
          } as EditorElement;
        }
        return el;
      });
    };

    const mapInsertAfterId = (
      els: EditorElement[],
      targetId: string,
      toInsert: EditorElement,
    ): EditorElement[] => {
      const idx = els.findIndex((e) => e.id === targetId);
      if (idx !== -1) {
        const newEls = [...els];
        newEls.splice(idx + 1, 0, toInsert);
        return newEls;
      }
      return els.map((el) => {
        if (elementHelper.isContainerElement(el)) {
          return {
            ...el,
            elements: mapInsertAfterId(el.elements, targetId, toInsert),
          } as EditorElement;
        }
        return el;
      });
    };

    // --- Debouncer factory (per-element) ---
    const getDebouncerForId = (id: string): Debouncer<TElement> => {
      let d = debouncers.get(id);
      if (d) return d;

      d = debounce(async (payload: UpdatePayload<TElement>) => {
        try {
          await elementService.updateElement(
            payload.element as unknown as EditorElement,
            payload.settings ?? null,
          );
        } catch (err) {
          // revert the optimistic change on failure
          // eslint-disable-next-line no-console
          console.error("Failed to persist element update, reverting:", err);
          if (payload.prevElements) {
            set({ elements: payload.prevElements });
          }
        }
      }, 300) as Debouncer<TElement>;

      debouncers.set(id, d);
      return d;
    };

    const UI_FLAGS = ["isSelected", "isHovered", "isDraggedOver"] as const;
    type UiFlagKey = (typeof UI_FLAGS)[number];

    return {
      elements: [],

      setElements: (elements) => set({ elements }),
      loadElements: (elements: TElement[]) => set({ elements }),

      updateElement: (id, updatedElement) => {
        const { elements } = get();

        const prevElements = cloneDeep(elements);

        const updatedKeys = Object.keys(
          updatedElement,
        ) as (keyof typeof updatedElement)[];
        const hasNonUiChange = updatedKeys.some(
          (k) => !UI_FLAGS.includes(k as UiFlagKey),
        );

        const updatedTree = mapUpdateById(
          elements as EditorElement[],
          id,
          (el) => ({
            ...el,
            ...updatedElement,
          }),
        ) as TElement[];

        set({
          elements: updatedTree,
        });

        // If update is UI-only, we intentionally skip persistence entirely.
        if (!hasNonUiChange) return;

        // Find the element to persist
        const elementToPersist = findById(updatedTree as EditorElement[], id);
        if (!elementToPersist) return;

        // Build a PersistElement by removing UI-only flags via destructuring.
        // The rest object will be the payload we persist.
        // No `any` usage -- types derive from EditorElement.
        const {
          isSelected: _isSelected,
          isHovered: _isHovered,
          isDraggedOver: _isDraggedOver,
          ...persistObj
        } = elementToPersist as EditorElement;
        const persistElement = persistObj as PersistElement;

        // Determine settings payload if it's a string
        const settingsPayload =
          "settings" in persistElement &&
          typeof (persistElement as any).settings === "string"
            ? ((persistElement as any).settings as string)
            : undefined;

        // Trigger a per-element debounced persistence
        const db = getDebouncerForId(id);
        db({
          element: persistElement,
          prevElements,
          settings: settingsPayload,
        });
      },

      deleteElement: (id) => {
        const { elements } = get();

        const prevElements = cloneDeep(elements);
        const updatedTree = mapDeleteById(
          elements as EditorElement[],
          id,
        ) as TElement[];

        // optimistic
        set({
          elements: updatedTree,
        });

        (async () => {
          try {
            const ok = await elementService.deleteElement(id);
            if (!ok) set({ elements: prevElements });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to delete element, reverting:", err);
            set({ elements: prevElements });
          }
        })();
      },

      insertElement: (element, elementToBeInserted) => {
        const { elements } = get();
        const updated = mapInsertAfterId(
          elements as EditorElement[],
          element.id,
          elementToBeInserted,
        ) as TElement[];
        set({ elements: updated });
      },

      addElement: (...newElements) => {
        const { elements } = get();
        const prevElements = cloneDeep(elements);

        const insertOne = (
          tree: EditorElement[],
          newEl: TElement,
        ): EditorElement[] => {
          if (!newEl.parentId) return [...tree, newEl];
          let parentFound = false;

          const addToParent = (el: EditorElement): EditorElement => {
            if (el.id === newEl.parentId) {
              if (elementHelper.isContainerElement(el)) {
                parentFound = true;
                return {
                  ...el,
                  elements: [...el.elements, newEl],
                } as EditorElement;
              }
              parentFound = true;
              return el;
            }
            if (elementHelper.isContainerElement(el)) {
              return {
                ...el,
                elements: el.elements.map(addToParent),
              } as EditorElement;
            }
            return el;
          };

          const updatedTree = tree.map(addToParent);
          if (!parentFound) return [...updatedTree, newEl];
          return updatedTree;
        };

        const updatedTree = newElements.reduce<EditorElement[]>(
          (acc, newEl) => insertOne(acc, newEl),
          elements as EditorElement[],
        ) as TElement[];

        console.log("Creating element", ...newElements);
        set({
          elements: updatedTree,
        });

        (async () => {
          try {
            const projectId = newElements[0]?.projectId;
            if (!projectId) return;
            await elementService.createElement(
              projectId,
              ...(newElements as EditorElement[]),
            );
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(
              "Failed to persist elements, reverting optimistic update:",
              err,
            );
            set({
              elements: prevElements,
            });
          }
        })();
      },

      updateAllElements: (update) => {
        const { elements } = get();
        const recursivelyUpdate = (el: EditorElement): EditorElement => {
          const updated = { ...el };
          Object.assign(updated, update);
          if (update.styles) {
            // Defensive check: ensure el.styles is a valid object
            const safeElStyles =
              el.styles &&
              typeof el.styles === "object" &&
              !Array.isArray(el.styles)
                ? el.styles
                : {};
            updated.styles = { ...safeElStyles, ...update.styles };
          }
          if (elementHelper.isContainerElement(el)) {
            return {
              ...updated,
              elements: el.elements.map(recursivelyUpdate),
            } as EditorElement;
          }
          return updated;
        };
        const updated = elements.map((e) => recursivelyUpdate(e) as TElement);
        set({ elements: updated });
      },

      deselectAll: () => {
        get().updateAllElements({ isSelected: false, isHovered: false });
      },

      dehoverAll: () => {
        get().updateAllElements({ isHovered: false });
      },
    };
  });
};

// Create a vanilla store instance for static access (used by keyboard events)
const elementStoreInstance = createElementStore();

// Create the hook version
const useElementStoreImplementation = elementStoreInstance;

export const useElementStore = useElementStoreImplementation as {
  <TElement extends EditorElement>(): ElementStore<TElement>;
  <TElement extends EditorElement, U>(
    selector: (state: ElementStore<TElement>) => U,
  ): U;
};

// Export the vanilla store instance for static access
export const ElementStore = elementStoreInstance;
