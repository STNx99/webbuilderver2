import getToken from "./token";
import { Page } from "@/generated/prisma";
import { Project } from "@/interfaces/project.interface";
import apiClient from "./apiclient";
import GetUrl, { GetNextJSURL } from "@/lib/utils/geturl";

interface IProjectService {
  getProjects: () => Promise<Project[]>;

  getUserProjects: () => Promise<Project[]>;

  getProjectById: (id: string) => Promise<Project>;

  createProject: (project: Project) => Promise<Project>;

  updateProject: (project: Project) => Promise<Project>;

  deleteProject: (id: string) => Promise<boolean>;

  getProjectPages: (id: string) => Promise<Page[]>;

  deleteProjectPage: (projectId: string, pageId: string) => Promise<boolean>;

  getFonts: () => Promise<string[]>;
}

export const projectService: IProjectService = {
  getProjects: async (): Promise<Project[]> => {
    return apiClient.getPublic<Project[]>(GetUrl("/projects/public"));
  },

  getUserProjects: async (): Promise<Project[]> => {
    return apiClient.get<Project[]>(GetUrl("/projects/user"));
  },

  getProjectById: async (id: string): Promise<Project> => {
    return apiClient.get<Project>(GetUrl(`/projects/${id}`));
  },

  deleteProject: async (id: string): Promise<boolean> => {
    const token = await getToken();
    const response = await fetch(GetNextJSURL(`/api/projects/${id}`), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (response.status === 204) return true;
    return false;
  },

  createProject: async (project: Project) => {
    return await apiClient.post<Project>(GetUrl("/projects"), project);
  },

  updateProject: async (project: Project) => {
    return await apiClient.put<Project>(
      GetUrl(`/projects/${project.id}`),
      project,
    );
  },

  getProjectPages: async (id: string): Promise<Page[]> => {
    return apiClient.get<Page[]>(GetUrl(`/projects/${id}/pages`));
  },

  deleteProjectPage: async (
    projectId: string,
    pageId: string,
  ): Promise<boolean> => {
    const token = await getToken();
    const response = await fetch(`/api/projects/${projectId}/pages/${pageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.status === 204;
  },

  getFonts: async (): Promise<string[]> => {
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
