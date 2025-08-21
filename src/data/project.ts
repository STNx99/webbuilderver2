import { Project } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export const projectDAL = {
  createProject: async (project: Project, userId: string) => {
    if (!project.Name || !project.Description || !project.Id) {
      throw new Error("Project Name and Description are required");
    }
    return await prisma?.project.create({
      data: {
        Id: project.Id,
        Name: project.Name,
        Description: project.Description,
        OwnerId: userId,
        Subdomain: project.Subdomain || "",
        Published: project.Published || false,
        Styles: JSON.stringify(project.Styles) || "",
      },
    });
  },

  deleteProject: async (projectId: string, userId: string) => {
    if (!projectId) {
      throw new Error("Project Id is required");
    }
    return await prisma?.project.deleteMany({
      where: {
        Id: projectId,
        OwnerId: userId,
      },
    });
  },
};
