import { EditorElement } from "@/types/global.type";
import GetUrl from "@/lib/utils/geturl";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { Snapshot } from "@/interfaces/snapshot.interface";

interface IElementService {
  getElements: (projectId: string) => Promise<EditorElement[]>;
  getElementsPublic: (projectId: string) => Promise<EditorElement[]>;
  saveSnapshot: (projectId: string, snapshot: Snapshot) => Promise<void>;
  getSnapshots: (projectId: string) => Promise<Snapshot[]>;
  loadSnapshot: (projectId: string, snapshotId: string) => Promise<EditorElement[]>;
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

  getSnapshots: async (projectId: string): Promise<Snapshot[]> => {
    return apiClient.get<Snapshot[]>(
      GetUrl(API_ENDPOINTS.SNAPSHOTS.GET(projectId)),
    );
  },

  loadSnapshot: async (
    projectId: string,
    snapshotId: string,
  ): Promise<EditorElement[]> => {
    const snapshot = await apiClient.get<Snapshot>(
      GetUrl(API_ENDPOINTS.SNAPSHOTS.LOAD(projectId, snapshotId)),
    );
    return snapshot.elements;
  },
};