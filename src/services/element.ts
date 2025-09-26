import { EditorElement } from "@/types/global.type";
import GetUrl, { GetNextJSURL } from "@/lib/utils/geturl";
import apiClient from "./apiclient";
import { API_ENDPOINTS, NEXT_API_ENDPOINTS } from "@/constants/endpoints";

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
  insertElement: (
    projectId: string,
    targetId: string,
    elementToBeInserted: EditorElement,
  ) => Promise<void>;
}

export const elementService: IElementService = {
  getElements: async (projectId: string): Promise<EditorElement[]> => {
    return apiClient.get<EditorElement[]>(
      GetUrl(API_ENDPOINTS.ELEMENTS.GET(projectId)),
    );
  },

  getElementsPublic: async (projectId: string): Promise<EditorElement[]> => {
    return apiClient.getPublic<EditorElement[]>(
      GetUrl(API_ENDPOINTS.ELEMENTS.GET_PUBLIC(projectId)),
    );
  },

  createElement: async (
    projectId: string,
    ...elements: EditorElement[]
  ): Promise<void> => {
    if (!Array.isArray(elements) || elements.length === 0) return;

    try {
      await apiClient.post(
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
      const resp = await apiClient.put<Record<string, unknown>>(
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
      return await apiClient.delete(
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
      await apiClient.post(
        GetUrl(API_ENDPOINTS.ELEMENTS.INSERT(projectId, targetId)),
        elementToBeInserted,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`insertElement failed: ${message}`);
    }
  },
};
