import GetUrl from "@/lib/utils/geturl";
import { Page } from "@/generated/prisma";
import { Project } from "@/interfaces/project.interface";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface IProjectService {
  getProjects: () => Promise<Project[]>;
  getUserProjects: () => Promise<Project[]>;
  getProjectById: (id: string) => Promise<Project>;
  createProject: (project: Project) => Promise<Project>;
  updateProject: (project: Project) => Promise<Project>;
  updateProjectPartial: (
    projectId: string,
    project: Partial<Project>,
  ) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectPages: (id: string) => Promise<Page[]>;
  deleteProjectPage: (projectId: string, pageId: string) => Promise<boolean>;
  getFonts: () => Promise<string[]>;
}

export const projectService: IProjectService = {
  getProjects: async (): Promise<Project[]> => {
    return apiClient.getPublic<Project[]>(
      GetUrl(API_ENDPOINTS.PROJECTS.GET_PUBLIC),
    );
  },

  getUserProjects: async (): Promise<Project[]> => {
    return apiClient.get<Project[]>(GetUrl(API_ENDPOINTS.PROJECTS.GET_USER));
  },

  getProjectById: async (id: string): Promise<Project> => {
    return apiClient.get<Project>(GetUrl(API_ENDPOINTS.PROJECTS.GET_BY_ID(id)));
  },

  deleteProject: async (id: string): Promise<boolean> => {
    return apiClient.delete(GetUrl(API_ENDPOINTS.PROJECTS.DELETE(id)));
  },

  createProject: async (project: Project) => {
    return await apiClient.post<Project>(
      GetUrl(API_ENDPOINTS.PROJECTS.CREATE),
      project,
    );
  },

  updateProject: async (project: Project) => {
    return await apiClient.put<Project>(
      GetUrl(API_ENDPOINTS.PROJECTS.UPDATE(project.id)),
      project,
    );
  },

  getProjectPages: async (id: string): Promise<Page[]> => {
    return apiClient.get<Page[]>(GetUrl(API_ENDPOINTS.PROJECTS.GET_PAGES(id)));
  },

  updateProjectPartial: async (
    projectId: string,
    project: Partial<Project>,
  ): Promise<Project> => {
    return apiClient.patch<Project>(
      GetUrl(API_ENDPOINTS.PROJECTS.UPDATE(projectId)),
      project,
    );
  },

  deleteProjectPage: async (
    projectId: string,
    pageId: string,
  ): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.PROJECTS.DELETE_PAGE(projectId, pageId)),
    );
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
