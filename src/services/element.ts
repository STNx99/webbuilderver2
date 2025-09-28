import { EditorElement } from "@/types/global.type";
import GetUrl from "@/lib/utils/geturl";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { Snapshot } from "@/interfaces/snapshot.interface";

interface IElementService {
  getElements: (projectId: string) => Promise<EditorElement[]>;
  getElementsPublic: (projectId: string) => Promise<EditorElement[]>;
  createElement: (
    projectId: string,
    ...elements: EditorElement[]
  ) => Promise<void>;
  updateElement: (
    id: string,
    updates: Partial<EditorElement>,
    settings?: string | null,
  ) => Promise<EditorElement>;
  deleteElement: (id: string) => Promise<boolean>;
  swapElement: (
    projectId: string,
    element1Id: string,
    element2Id: string,
  ) => Promise<void>;
  insertElement: (
    projectId: string,
    targetId: string,
    elementToBeInserted: EditorElement,
  ) => Promise<void>;
  saveSnapshot: (projectId: string, snapshot: Snapshot) => Promise<void>;
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
    id: string,
    updates: Partial<EditorElement>,
  ): Promise<EditorElement> => {
    try {
      const resp = await apiClient.patch<Record<string, unknown>>(
        GetUrl(API_ENDPOINTS.ELEMENTS.UPDATE(id)),
        { updates },
      );
      return resp as unknown as EditorElement;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`updateElement failed: ${message}`);
    }
  },

  deleteElement: async (id: string): Promise<boolean> => {
    try {
      return await apiClient.delete(GetUrl(API_ENDPOINTS.ELEMENTS.DELETE(id)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`deleteElement failed: ${message}`);
    }
  },

  swapElement: async (projectId : string, elementId1: string, elementId2: string) => {
    try{
     return await apiClient.post(GetUrl(API_ENDPOINTS.ELEMENTS.SWAP(projectId)), {
       elementId1,
      elementId2
     }) 
    }catch(err: unknown){
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`swapElement failed: ${message}`);
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

  saveSnapshot: async (
    projectId: string,
    snapshot: Snapshot,
  ): Promise<void> => {
    try {
      await apiClient.post(
        GetUrl(API_ENDPOINTS.SNAPSHOTS.SAVE(projectId)),
        snapshot,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`saveSnapshot failed: ${message}`);
    }
  },
};
