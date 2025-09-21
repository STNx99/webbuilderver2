import { EditorElement } from "@/types/global.type";
import GetUrl, { GetNextJSURL } from "@/lib/utils/geturl";
import {
  fetchWithAuth,
  fetchPublic,
  postWithAuth,
  deleteWithAuth,
  updateWithAuth,
} from "./api";
import { IElementService } from "@/interfaces/service.interface";
import { API_ENDPOINTS, NEXT_API_ENDPOINTS } from "@/constants/endpoints";

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
    return fetchWithAuth<EditorElement[]>(
      GetUrl(API_ENDPOINTS.ELEMENTS.GET(projectId)),
    );
  },

  getElementsPublic: async (projectId: string): Promise<EditorElement[]> => {
    return fetchPublic<EditorElement[]>(
      GetUrl(API_ENDPOINTS.ELEMENTS.GET_PUBLIC(projectId)),
    );
  },

  createElement: async (
    projectId: string,
    ...elements: EditorElement[]
  ): Promise<void> => {
    if (!Array.isArray(elements) || elements.length === 0) return;

    try {
      await postWithAuth(
        GetUrl(API_ENDPOINTS.ELEMENTS.CREATE(projectId)),
        elements,
      );
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
      const resp = await updateWithAuth<Record<string, unknown>>(
        GetNextJSURL(NEXT_API_ENDPOINTS.ELEMENTS.UPDATE(element.id)),
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
      return await deleteWithAuth(
        GetNextJSURL(NEXT_API_ENDPOINTS.ELEMENTS.DELETE(id)),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`deleteElement failed: ${message}`);
    }
  },

  insertElement: async (
    projectId: string,
    targetId: string,
    elementToBeInserted: EditorElement,
  ): Promise<void> => {
    try {
      await postWithAuth(GetUrl(API_ENDPOINTS.ELEMENTS.INSERT(projectId, targetId)), elementToBeInserted);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`insertElement failed: ${message}`);
    }
  },
};
