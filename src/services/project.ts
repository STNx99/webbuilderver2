import GetUrl from "@/utils/geturl";
import getToken from "./token";
import { IProjectService } from "@/interfaces/service.interface";
import { Project } from "next/dist/build/swc/types";

export const projectService: IProjectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(GetUrl("/projects/public"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return response.json();
  },

  getUserProjects: async (): Promise<Project[]> => {
    const token = await getToken();

    const response = await fetch(GetUrl("/projects/user"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user projects");
    }
    return response.json();
  },

  getProjectById: async (id: string): Promise<Project> => {
    const token = await getToken();

    const response = await fetch(GetUrl(`/projects/${id}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project by ID");
    }
    return response.json();
  },

  getFonts : async (): Promise<string[]> => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch fonts");
    }
    const data = await response.json();
    return data.items.map((font: { family: string }) => font.family);
  },
};
