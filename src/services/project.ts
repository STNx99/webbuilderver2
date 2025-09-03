import GetUrl, { GetNextJSURL } from "@/utils/geturl";
import { IProjectService } from "@/interfaces/service.interface";
import getToken from "./token";
import { Page } from "@/generated/prisma";
import { fetchPublic, fetchWithAuth, updateWithAuth } from "./api";
import { Project } from "@/interfaces/project.interface";



export const projectService: IProjectService = {
  getProjects: async (): Promise<Project[]> => {
    return fetchPublic<Project []>(GetUrl("/projects/public"));
  },

  getUserProjects: async (): Promise<Project[]> => {
    return fetchWithAuth<Project[]>(GetUrl("/projects/user"));
  },

  getProjectById: async (id: string): Promise<Project> => {
    return fetchWithAuth<Project>(GetUrl(`/projects/${id}`));
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

  getProjectPages: async (id: string): Promise<Page[]> => {
    return fetchWithAuth<Page[]>(GetUrl(`/projects/${id}/pages`));
  },

  updateProject: async (
    projectId: string,
    project: Partial<Project>,
  ): Promise<Project> => {
    const token = await getToken();
    try {
      const response = await fetch(GetNextJSURL(`/api/projects/${projectId}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(project),
      });


      if (!response.ok) {
        let txt = "";
        try {
          txt = await response.text();
        } catch (e) {
          txt = String(e ?? "failed to read response body");
        }
        console.error(
          "projectService.updateProject: server responded with error",
          {
            projectId,
            status: response.status,
            body: txt,
          },
        );
        throw new Error(`Failed to update project: ${response.status} ${txt}`);
      }

      const data = await response.json();
      console.debug("projectService.updateProject: server returned data", {
        projectId,
        data,
      });
      return data as Project;
    } catch (err) {
      console.error("projectService.updateProject: network/error", {
        projectId,
        error: err,
        project,
      });
      throw err;
    }
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