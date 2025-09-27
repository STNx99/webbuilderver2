import { create } from "zustand";
import { ContainerElement, EditorElement } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { elementService } from "@/services/element";
import { debounce } from "lodash";
import { cloneDeep, find, reject } from "lodash";
import { SelectionStore } from "./selectionstore";
import { Snapshot } from "@/interfaces/snapshot.interface";

type ElementStore<TElement extends EditorElement> = {
  elements: TElement[];
  past: TElement[][];
  future: TElement[][];
  setElements: (elements: TElement[]) => ElementStore<TElement>;
  loadElements: (elements: TElement[]) => ElementStore<TElement>;
  updateElement: (
    id: string,
    updatedElement: Partial<TElement>,
  ) => ElementStore<TElement>;
  deleteElement: (id: string) => ElementStore<TElement>;
  addElement: (...newElements: TElement[]) => ElementStore<TElement>;
  updateAllElements: (update: Partial<EditorElement>) => ElementStore<TElement>;
  insertElement: (
    parentElement: TElement,
    elementToBeInserted: TElement,
  ) => ElementStore<TElement>;
  undo: () => ElementStore<TElement>;
  redo: () => ElementStore<TElement>;
  clearHistory: () => ElementStore<TElement>;
};

type PersistElement = EditorElement;

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
      for (const el of els) {
        if (el.id === id) return el;
        if (elementHelper.isContainerElement(el)) {
          const found = findById((el as ContainerElement).elements, id);
          if (found) return found;
        }
      }
      return undefined;
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

    const getDebouncerForId = (id: string): Debouncer<TElement> => {
      let d = debouncers.get(id);
      if (d) return d;

      d = debounce(async (payload: UpdatePayload<TElement>) => {
        try {
          await elementService.updateElement(
            payload.element.id,
            payload.element,
            payload.settings ?? null,
          );
        } catch (err) {
          console.error("Failed to persist element update, reverting:", err);
        }
      }, 300) as Debouncer<TElement>;

      debouncers.set(id, d);
      return d;
    };

    const saveSnapshotToApi = async (elements: EditorElement[]) => {
      try {
        const projectId = elements[0]?.projectId;
        if (!projectId) return;
        const snapshot: Snapshot = {
          id: `snapshot-${Date.now()}`,
          elements: cloneDeep(elements),
          timestamp: Date.now(),
        };
        if (elementService.saveSnapshot) {
          await elementService.saveSnapshot(projectId, snapshot);
        } else {
          console.warn("saveSnapshot not implemented in elementService");
        }
      } catch (err) {
        console.error("Failed to save snapshot to API:", err);
      }
    };

    const takeSnapshot = () => {
      const { elements, past } = get();
      set({
        past: [...past, cloneDeep(elements) as TElement[]],
        future: [],
      });
    };

    return {
      elements: [],
      past: [],
      future: [],

      setElements: (elements: TElement[]) => {
        takeSnapshot();
        set({ elements });
        saveSnapshotToApi(elements as EditorElement[]);
        return get();
      },
      loadElements: (elements: TElement[]) => {
        set({ elements });
        saveSnapshotToApi(elements as EditorElement[]);
        return get();
      },

      updateElement: (id: string, updatedElement: Partial<TElement>) => {
        takeSnapshot();
        const { elements } = get();

        const prevElements = cloneDeep(elements);
        const updatedTree = mapUpdateById(
          elements as EditorElement[],
          id,
          (el) => ({
            ...el,
            ...updatedElement,
          }),
        ) as TElement[];

        set({ elements: updatedTree });

        const { selectedElement } = SelectionStore.getState();
        console.log("element before update", selectedElement);
        if (selectedElement?.id === id) {
          const updatedSelected = findById(updatedTree as EditorElement[], id);
          if (updatedSelected) {
            SelectionStore.setState({
              selectedElement: updatedSelected as TElement,
            });
          }
        }
        console.log("element after update", selectedElement);

        const elementToPersist = findById(updatedTree as EditorElement[], id);
        if (!elementToPersist) return get();

        const persistElement = elementToPersist as PersistElement;

        const settingsPayload =
          "settings" in persistElement &&
          typeof (persistElement as EditorElement).settings === "string"
            ? ((persistElement as EditorElement).settings as string)
            : undefined;

        const db = getDebouncerForId(id);
        db({
          element: persistElement,
          prevElements,
          settings: settingsPayload,
        });
        return get();
      },

      deleteElement: (id: string) => {
        takeSnapshot();
        const { elements } = get();

        const prevElements = cloneDeep(elements);
        const updatedTree = mapDeleteById(
          elements as EditorElement[],
          id,
        ) as TElement[];

        set({
          elements: updatedTree,
        });

        (async () => {
          try {
            const ok = await elementService.deleteElement(id);
            if (!ok) set({ elements: prevElements });
          } catch (err) {
            console.error("Failed to delete element, reverting:", err);
            set({ elements: prevElements });
          }
        })();
        return get();
      },

      insertElement: (
        parentElement: TElement,
        elementToBeInserted: TElement,
      ) => {
        takeSnapshot();
        const { elements } = get();
        const prevElements = cloneDeep(elements);
        const updated = mapInsertAfterId(
          elements as EditorElement[],
          parentElement.id,
          elementToBeInserted,
        ) as TElement[];

        console.log("Inserting element", elementToBeInserted);
        set({ elements: updated });

        (async () => {
          try {
            const projectId = elementToBeInserted.projectId;
            if (!projectId) return;
            await elementService.insertElement(
              projectId,
              parentElement.id,
              elementToBeInserted as EditorElement,
            );
          } catch (err) {
            console.error(
              "Failed to persist inserted element, reverting:",
              err,
            );
            set({ elements: prevElements });
          }
        })();
        return get();
      },

      addElement: (...newElements: TElement[]) => {
        takeSnapshot();
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
            console.error(
              "Failed to persist elements, reverting optimistic update:",
              err,
            );
            set({
              elements: prevElements,
            });
          }
        })();
        return get();
      },

      updateAllElements: (update: Partial<EditorElement>) => {
        takeSnapshot();
        const { elements } = get();
        const recursivelyUpdate = (el: EditorElement): EditorElement => {
          const updated = { ...el };
          Object.assign(updated, update);
          if (update.styles) {
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
        const updated = elements.map(
          (e: TElement) => recursivelyUpdate(e) as TElement,
        );
        set({ elements: updated });
        saveSnapshotToApi(updated as EditorElement[]);
        return get();
      },

      undo: () => {
        const { past, elements, future } = get();
        if (past.length === 0) return get();
        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);
        set({
          past: newPast,
          elements: previous,
          future: [elements, ...future],
        });
        saveSnapshotToApi(previous as EditorElement[]);
        return get();
      },

      redo: () => {
        const { future, elements, past } = get();
        if (future.length === 0) return get();
        const next = future[0];
        const newFuture = future.slice(1);
        set({
          past: [...past, elements],
          elements: next,
          future: newFuture,
        });
        saveSnapshotToApi(next as EditorElement[]);
        return get();
      },

      clearHistory: () => {
        set({ past: [], future: [] });
        return get();
      },
    };
  });
};

const elementStoreInstance = createElementStore();

const useElementStoreImplementation = elementStoreInstance;

export const useElementStore = useElementStoreImplementation as {
  <TElement extends EditorElement>(): ElementStore<TElement>;
  <TElement extends EditorElement, U>(
    selector: (state: ElementStore<TElement>) => U,
  ): U;
};

export const ElementStore = elementStoreInstance;
