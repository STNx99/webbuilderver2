import type { Page } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

export const pageDAL = {
  createPage: async (page: Page): Promise<Page> => {
    const createdPage = await prisma.page.create({
      data: {
        Id: page.Id || uuidv4(),
        Name: page.Name,
        Type: page.Type,
        Styles: page.Styles || {},
        ProjectId: page.ProjectId,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        DeletedAt: page.DeletedAt ?? null,
      },
    });

    return createdPage;
  },

  getPage: async (pageId: string, userId: string): Promise<Page | null> => {
    // This is a placeholder implementation
    console.log("Getting page:", pageId, "for user:", userId);
    return null;
  },

  updatePage: async (
    pageId: string,
    page: Partial<Page>,
    userId: string
  ): Promise<Page | null> => {
    return null;
  },

  deletePage: async (pageId: string, projectId: string): Promise<boolean> => {
    try {
      const result = await prisma.page.delete({
        where: {
          Id: pageId,
          ProjectId: projectId,
        },
      });
      return !!result;
    } catch (error) {
      console.error("Failed to delete page:", error);
      return false;
    }
  },
};
