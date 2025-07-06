"use server";
import { projectDAL } from "@/data/project";
import { Project } from "@/interfaces/project";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export default async function createProject(project: Project) {
  try {
    const { userId } = await auth();

    if (!project) {
      throw new Error("Project data is required");
    }
    if (!userId) {
      throw new Error("User not authenticated");
    }
    project.id || (project.id = uuidv4());

    const response = await projectDAL.createProject(project as Project, userId);
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
}
