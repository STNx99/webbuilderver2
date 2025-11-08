import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
  canModifyCollaborator,
  canChangeRole,
  getAssignableRoles,
} from "@/lib/rbac";
import { CollaboratorRole } from "@/interfaces/collaboration.interface";

/**
 * PATCH /api/v1/collaborators/[id]/role
 * Update a collaborator's role
 * Only project owners can update roles
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: collaboratorId } = params;

    if (!collaboratorId) {
      return NextResponse.json(
        { error: "Collaborator ID is required" },
        { status: 400 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { role: newRole } = body;

    if (!newRole) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Validate role
    const validRoles = Object.values(CollaboratorRole);
    if (!validRoles.includes(newRole as CollaboratorRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Get the collaborator to find the project and current role
    const collaborator = await prisma.collaborator.findUnique({
      where: { Id: collaboratorId },
      select: {
        Id: true,
        ProjectId: true,
        UserId: true,
        Role: true,
      },
    });

    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 },
      );
    }

    // Check if user has permission to modify this collaborator
    const canModify = await canModifyCollaborator(
      userId,
      collaborator.ProjectId,
      collaboratorId,
    );

    if (!canModify.authorized) {
      return NextResponse.json(
        { error: canModify.reason || "Forbidden" },
        { status: 403 },
      );
    }

    // Verify the new role can be assigned by the current user
    if (canModify.role) {
      const assignableRoles = getAssignableRoles(canModify.role);
      if (!assignableRoles.includes(newRole as CollaboratorRole)) {
        return NextResponse.json(
          { error: "You cannot assign this role" },
          { status: 403 },
        );
      }
    }

    // Check if role change is allowed
    const canChange = canChangeRole(
      canModify.role!,
      collaborator.Role as CollaboratorRole,
      newRole as CollaboratorRole,
    );

    if (!canChange) {
      return NextResponse.json(
        { error: "Role change not allowed" },
        { status: 403 },
      );
    }

    // Prevent changing owner role through this endpoint
    if (collaborator.Role === CollaboratorRole.OWNER) {
      return NextResponse.json(
        {
          error:
            "Cannot change owner role through this endpoint. Use project transfer instead.",
        },
        { status: 400 },
      );
    }

    // If promoting to owner, check if there's already an owner
    if (newRole === CollaboratorRole.OWNER) {
      const project = await prisma.project.findUnique({
        where: { Id: collaborator.ProjectId },
        select: { OwnerId: true },
      });

      if (project) {
        return NextResponse.json(
          {
            error:
              "Project already has an owner. Use project transfer to change ownership.",
          },
          { status: 400 },
        );
      }
    }

    // Update the collaborator's role
    const updatedCollaborator = await prisma.collaborator.update({
      where: { Id: collaboratorId },
      data: {
        Role: newRole as CollaboratorRole,
        UpdatedAt: new Date(),
      },
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
    });

    // Format the response
    const formattedCollaborator = {
      id: updatedCollaborator.Id,
      projectId: updatedCollaborator.ProjectId,
      userId: updatedCollaborator.UserId,
      role: updatedCollaborator.Role,
      createdAt: updatedCollaborator.CreatedAt.toISOString(),
      updatedAt: updatedCollaborator.UpdatedAt.toISOString(),
      user: {
        id: updatedCollaborator.User.Id,
        email: updatedCollaborator.User.Email,
        firstName: updatedCollaborator.User.FirstName,
        lastName: updatedCollaborator.User.LastName,
        imageUrl: updatedCollaborator.User.ImageUrl,
      },
    };

    return NextResponse.json(formattedCollaborator);
  } catch (error: any) {
    console.error("[Collaborators API] Error updating role:", error);

    if (error.status === 403) {
      return NextResponse.json(
        { error: error.message || "Forbidden" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update collaborator role" },
      { status: 500 },
    );
  }
}
