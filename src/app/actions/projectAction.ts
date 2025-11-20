"use server";
import { projectDAL } from "@/data/project";
import { Project } from "@/interfaces/project.interface";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import createPage from "./pageAction";

export default async function createProject(project: Partial<Project>) {
  try {
    const { userId } = await auth();

    if (!project) {
      throw new Error("Project data is required");
    }

    if (!userId) {
      throw new Error("User not authenticated");
    }
    project.id || (project.id = uuidv4());

    await projectDAL.createProject(project as Project, userId);

    await createPage({
      Name: "",
      Type: "page",
      Styles: {},
      ProjectId: project.id,
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
}
