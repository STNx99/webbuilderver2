import GetUrl from "@/utils/geturl";
import { Token } from "@clerk/nextjs/server";
import getToken from "./token";
import { IProjectService } from "@/interfaces/services";

export interface Project {
  id: string;
  name: string;
  description: string;
}

export const projectService : IProjectService= {
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
};
