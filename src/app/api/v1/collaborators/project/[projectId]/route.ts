import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
  requirePermission,
  Permission,
  getUserProjectAccess,
} from "@/lib/rbac";
import { CollaboratorRole } from "@/interfaces/collaboration.interface";

/**
 * GET /api/v1/collaborators/project/[projectId]
 * Get all collaborators for a specific project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if user has permission to view collaborators
    await requirePermission(userId, projectId, Permission.COLLABORATOR_VIEW);

    // Get project owner info
    const project = await prisma.project.findUnique({
      where: { Id: projectId },
      select: {
        OwnerId: true,
        Owner: {
          select: {
            Id: true,
            Email: true,
            FirstName: true,
            LastName: true,
            ImageUrl: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get all collaborators
    const collaborators = await prisma.collaborator.findMany({
      where: { ProjectId: projectId },
      include: {
        User: {
          select: {
            Id: true,
            Email: true,
            FirstName: true,
            LastName: true,
            ImageUrl: true,
          },
        },
      },
      orderBy: { CreatedAt: "asc" },
    });

    // Format the response
    const formattedCollaborators = [
      // Add project owner first
      {
        id: `owner-${project.OwnerId}`,
        projectId: projectId,
        userId: project.OwnerId,
        role: CollaboratorRole.OWNER,
        isOwner: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: project.Owner.Id,
          email: project.Owner.Email,
          firstName: project.Owner.FirstName,
          lastName: project.Owner.LastName,
          imageUrl: project.Owner.ImageUrl,
        },
      },
      // Add collaborators
      ...collaborators.map((collab) => ({
        id: collab.Id,
        projectId: collab.ProjectId,
        userId: collab.UserId,
        role: collab.Role,
        isOwner: false,
        createdAt: collab.CreatedAt.toISOString(),
        updatedAt: collab.UpdatedAt.toISOString(),
        user: {
          id: collab.User.Id,
          email: collab.User.Email,
          firstName: collab.User.FirstName,
          lastName: collab.User.LastName,
          imageUrl: collab.User.ImageUrl,
        },
      })),
    ];

    return NextResponse.json({
      collaborators: formattedCollaborators,
    });
  } catch (error: any) {
    console.error("[Collaborators API] Error fetching collaborators:", error);

    if (error.status === 403) {
      return NextResponse.json(
        { error: error.message || "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/collaborators/project/[projectId]/leave
 * Leave a project (remove self as collaborator)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if user has access to the project
    const access = await getUserProjectAccess(userId, projectId);

    if (!access) {
      return NextResponse.json(
        { error: "You do not have access to this project" },
        { status: 403 }
      );
    }

    // Owner cannot leave their own project
    if (access.isOwner) {
      return NextResponse.json(
        {
          error:
            "Project owner cannot leave. Please transfer ownership or delete the project.",
        },
        { status: 400 }
      );
    }

    // Remove the collaborator
    await prisma.collaborator.delete({
      where: {
        UserId_ProjectId: {
          UserId: userId,
          ProjectId: projectId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully left the project",
    });
  } catch (error: any) {
    console.error("[Collaborators API] Error leaving project:", error);

    return NextResponse.json(
      { error: "Failed to leave project" },
      { status: 500 }
    );
  }
}
