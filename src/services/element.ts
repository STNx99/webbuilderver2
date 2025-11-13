import { EditorElement } from "@/types/global.type";
import GetUrl, { GetNextJSURL } from "@/utils/geturl";
import apiClient from "./apiclient";

interface IElementService {
  getElements: (projectId: string) => Promise<EditorElement[]>;

  getElementsPublic: (projectId: string) => Promise<EditorElement[]>;

  createElement: (
    projectId: string,
    ...elements: EditorElement[]
  ) => Promise<void>;

  updateElement: (
    element: EditorElement,
    settings?: string | null,
  ) => Promise<EditorElement>;

  deleteElement: (id: string) => Promise<boolean>;
}

/**
 * Element service for communicating with backend element endpoints.
 *
 * Methods:
 * - getElements: authenticated fetch of elements for a project
 * - getElementsPublic: public fetch for published rendering
 * - createElement: create one or more elements for a project
 * - updateElement: update an element (sends { element, settings } payload,
 *                  uses permissive request typing and casts response to EditorElement)
 * - deleteElement: delete an element by id
 */
export const elementService: IElementService = {
  getElements: async (projectId: string): Promise<EditorElement[]> => {
    return apiClient.get<EditorElement[]>(GetUrl(`/elements/${projectId}`));
  },

  getElementsPublic: async (projectId: string): Promise<EditorElement[]> => {
    return apiClient.getPublic<EditorElement[]>(
      GetUrl(`/elements/public/${projectId}`),
    );
  },

  createElement: async (
    projectId: string,
    ...elements: EditorElement[]
  ): Promise<void> => {
    if (!Array.isArray(elements) || elements.length === 0) return;

    try {
      await apiClient.post(GetUrl(`/elements/${projectId}`), elements);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`createElement failed: ${message}`);
    }
  },

  updateElement: async (
    element: EditorElement,
    settings?: string | null,
  ): Promise<EditorElement> => {
    if (!element?.id) {
      throw new Error("updateElement failed: element id is required");
    }

    try {
      const resp = await apiClient.put<Record<string, unknown>>(
        GetNextJSURL(`/api/elements/${element.id}`),
        { element, settings },
      );
      return resp as unknown as EditorElement;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`updateElement failed: ${message}`);
    }
  },

  deleteElement: async (id: string): Promise<boolean> => {
    try {
      return await apiClient.delete(GetNextJSURL(`/api/elements/${id}`));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`deleteElement failed: ${message}`);
    }
  },
};
