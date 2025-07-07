import { Project } from "@/interfaces/project";
import prisma from "@/lib/prisma";

export const projectDAL = {
  createProject: async (project: Project, userId: string) => {
    if (!project.name || !project.description || !project.id) {
      throw new Error("Project name and description are required");
    }
    return await prisma?.projects.create({
      data: {
        Id: project.id,
        Name: project.name,
        Description: project.description,
        OwnerId: userId,
        subdomain: project.subdomain || "",
        published: project.published || false,
        Styles: JSON.stringify(project.styles) || "",
      },
    });
  },
  
  deleteProject: async (projectId: string, userId: string) => { 
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    return await prisma?.projects.deleteMany({
      where: {
        Id: projectId,
        OwnerId: userId,
      },
    });
  }
};
