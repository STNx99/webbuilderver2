import { Project } from "@/interfaces/project.interface";
import prisma from "@/lib/prisma";

export const projectDAL = {
  createProject: async (project: Project, userId: string) => {
    if (!project.name || !project.description || !project.id) {
      throw new Error("Project Name and Description are required");
    }
    const now = new Date();
    return await prisma?.project.create({
      data: {
        Id: project.id,
        Name: project.name,
        Description: project.description || "",
        OwnerId: userId,
        Subdomain: project.subdomain || "",
        Published: project.published || false,
        Styles: JSON.stringify(project.styles || {}),
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

  /**
   * Update a project.
   *
   * Performs an ownership check and ensures the project is not soft-deleted.
   * Accepts a partial `updates` object containing fields to change (e.g. Name, Description, Styles, Published, Subdomain, CustomStyles).
   *
   * Returns the updated project object on success, or null if the project was not found / not owned by the user / deleted.
   */
  updateProject: async (
    projectId: string,
    userId: string,
    updates: Partial<Project>,
  ) => {
    if (!projectId) {
      throw new Error("Project Id is required");
    }
    try {
      const existing = await prisma?.project.findUnique({
        where: { Id: projectId },
      });

      if (!existing) return null;
      if (existing.OwnerId !== userId) return null;
      if (existing.DeletedAt !== null) return null;

      const updated = await prisma?.project.update({
        where: { Id: projectId },
        data: {
          UpdatedAt: new Date(),
          Styles: JSON.stringify(updates.styles ?? existing.Styles),
          CustomStyles: updates.customStyles ?? existing.CustomStyles,
          Name: updates.name ?? existing.Name,
          Description: updates.description ?? existing.Description,
          Published:
            updates.published !== undefined
              ? updates.published
              : existing.Published,
          Subdomain: updates.subdomain ?? existing.Subdomain,
        }
      });

      return updated || null;
    } catch (err) {
      console.error("projectDAL.updateProject error:", err);
      return null;
    }
  },

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
