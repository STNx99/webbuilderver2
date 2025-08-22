import { EditorElement } from "@/types/global.type";
import GetUrl from "@/utils/geturl";
import getToken from "./token";
import { IElementService } from "@/interfaces/service.interface";

export const elementService : IElementService = {
  getElements: async (projectId: string): Promise<EditorElement[]> => {
    const token = await getToken();

    const response = await fetch(GetUrl(`/elements/${projectId}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch elements");
    }
    return response.json();
  },

  getElementsPublic: async (projectId: string): Promise<EditorElement[]> => {
    const response = await fetch(GetUrl(`/elements/public/${projectId}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch public elements");
    }
    return response.json();
  },
  
  createElement: async (projectId: string, element: EditorElement): Promise<void> => {
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
  }
};
