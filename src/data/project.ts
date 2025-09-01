import { Project } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export const projectDAL = {
  createProject: async (project: Project, userId: string) => {
    if (!project.Name || !project.Description || !project.Id) {
      throw new Error("Project Name and Description are required");
    }
    const now = new Date();
    return await prisma?.project.create({
      data: {
        Id: project.Id,
        Name: project.Name,
        Description: project.Description,
        OwnerId: userId,
        Subdomain: project.Subdomain || "",
        Published: project.Published || false,
        Styles: project.Styles || {},
        CreatedAt: now,
        UpdatedAt: now,
        DeletedAt: null,
      },
    });
  },

  // Soft delete: set DeletedAt to current date
  deleteProject: async (projectId: string, userId: string) => {
    if (!projectId) {
      throw new Error("Project Id is required");
    }
    return await prisma?.project.updateMany({
      where: {
        Id: projectId,
        OwnerId: userId,
        DeletedAt: null,
      },
      data: {
        DeletedAt: new Date(),
        UpdatedAt: new Date(),
      },
    });
  },

  // Get only active (not deleted) projects for a user
  getActiveProjects: async (userId: string) => {
    return await prisma?.project.findMany({
      where: {
        OwnerId: userId,
        DeletedAt: null,
      },
    });
  },

  // Restore a soft-deleted project
  restoreProject: async (projectId: string, userId: string) => {
    return await prisma?.project.updateMany({
      where: {
        Id: projectId,
        OwnerId: userId,
        DeletedAt: { not: null },
      },
      data: {
        DeletedAt: null,
        UpdatedAt: new Date(),
      },
    });
  },
};
