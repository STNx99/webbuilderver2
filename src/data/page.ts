import { Page } from "@/interfaces/page.interface";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

export const pageDAL = {
  createPage: async (page: Page): Promise<Page> => {
    const createdPage = await prisma.page.create({
      data: {
        Id: page.Id || uuidv4(),
        Name: page.Name,
        Type: page.Type,
        Styles: (page.Styles as any) || {},
        ProjectId: page.ProjectId,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        DeletedAt: page.DeletedAt ?? null,
      },
    });

    return {
      Id: createdPage.Id,
      Name: createdPage.Name,
      Type: createdPage.Type,
      Styles: createdPage.Styles as Record<string, unknown> | null,
      ProjectId: createdPage.ProjectId,
      CreatedAt: createdPage.CreatedAt,
      UpdatedAt: createdPage.UpdatedAt,
      DeletedAt: createdPage.DeletedAt,
    };
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
