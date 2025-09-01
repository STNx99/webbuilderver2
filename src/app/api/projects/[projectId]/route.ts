import { projectDAL } from "@/data/project";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { projectId } = await params;
    if (!projectId) {
      return new Response("Project ID is required", { status: 400 });
    }
    const response = await projectDAL.deleteProject(projectId, userId);
    if (!response) {
      return new Response("Failed to delete project", { status: 500 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return new Response(JSON.stringify({ error: "Failed to delete project" }), {
      status: 500,
    });
  }
}
