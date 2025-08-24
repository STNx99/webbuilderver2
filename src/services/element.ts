import { EditorElement } from "@/types/global.type";
import GetUrl from "@/utils/geturl";
import { fetchWithAuth, fetchPublic } from "./fetcher";
import getToken from "./token";
import { IElementService } from "@/interfaces/service.interface";

export const elementService: IElementService = {
  getElements: async (projectId: string): Promise<EditorElement[]> => {
    return fetchWithAuth<EditorElement[]>(GetUrl(`/elements/${projectId}`));
  },

  getElementsPublic: async (projectId: string): Promise<EditorElement[]> => {
    return fetchPublic<EditorElement[]>(
      GetUrl(`/elements/public/${projectId}`),
    );
  },

  createElement: async (
    projectId: string,
    element: EditorElement,
  ): Promise<void> => {
    const token = await getToken();

    const response = await fetch(GetUrl(`/elements/${projectId}`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(element),
    });

    if (!response.ok) {
      throw new Error("Failed to create element");
    }
  },
};
