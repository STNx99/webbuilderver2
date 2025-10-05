"use server";
import { pageDAL } from "@/data/page";
import { Page } from "@prisma/client";
import { PageSchema } from "@/schema/zod";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export default async function createPage(page: Partial<Page>) {
  try {
    const { userId } = await auth();

    if (!page) {
      throw new Error("Page data is required");
    }

    if (!userId) {
      throw new Error("User not authenticated");
    }

    page.Id || (page.Id = uuidv4());
    const result = PageSchema.safeParse(page);
    if (result.error) throw new Error(JSON.stringify(result.error));

    const response = await pageDAL.createPage(page as Page);
    return response;
  } catch (error) {
    console.error("Error creating page:", error);
    throw new Error("Failed to create page");
  }
}
