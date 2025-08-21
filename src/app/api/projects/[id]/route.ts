import { projectDAL } from "@/data/project";
import { auth } from "@clerk/nextjs/server";

export  async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }
        const { id } = await params;
        if (!id) {
            return new Response("Project ID is required", { status: 400 });
        }
        const response = await projectDAL.deleteProject(id, userId);
        if (!response) {
            return new Response("Failed to delete project", { status: 500 });
        }
        return new Response(JSON.stringify({ message: `Project with ID ${id} deleted` }), { status: 204 });
    }catch (error) {
        console.error("Error deleting project:", error);
        return new Response(JSON.stringify({ error: "Failed to delete project" }), { status: 500 });
    }
}