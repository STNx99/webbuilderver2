import { projectDAL } from "@/data/project";
import { Project } from "@/interfaces/project.interface";
import { auth } from "@clerk/nextjs/server";

export async function GET(
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

    const project = await projectDAL.getProject(projectId, userId);
    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    const projectData: Project = {
      id: project.Id,
      ownerId: project.OwnerId,
      name: project.Name,
      description: project.Description,
      styles: project.Styles ? JSON.parse(project.Styles as string) : undefined,
      customStyles: project.CustomStyles || undefined,
      published: project.Published,
      subdomain: project.Subdomain || undefined,
      createdAt: project.CreatedAt.toISOString(),
      updatedAt: project.UpdatedAt.toISOString(),
      deletedAt: project.DeletedAt ? project.DeletedAt.toISOString() : null,
    };

    return new Response(JSON.stringify(projectData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch project" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

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

/**
 * PATCH /api/projects/:projectId
 * Partially updates a project. Only whitelisted fields will be applied.
 */
export async function PATCH(
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

    let body: Partial<Project>;
    try {
      body = await req.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({ error: "Request body must be an object" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const updated = await projectDAL.updateProject(projectId, userId, body);

    if (!updated) {
      return new Response(
        JSON.stringify({ error: "Project not found or not updated" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }
    const newProject: Project = {
      id: updated.Id,
      ownerId: updated.OwnerId,
      name: updated.Name,
      description: updated.Description,
      styles: updated.Styles ? JSON.parse(updated.Styles as string) : undefined,
      customStyles: updated.CustomStyles || undefined,
      published: updated.Published,
      subdomain: updated.Subdomain || undefined,
      createdAt: updated.CreatedAt.toISOString(),
      updatedAt: updated.UpdatedAt.toISOString(),
      deletedAt: updated.DeletedAt ? updated.DeletedAt.toISOString() : null,
    };

    return new Response(JSON.stringify(newProject), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return new Response(JSON.stringify({ error: "Failed to update project" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
