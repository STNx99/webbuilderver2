import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
  canModifyCollaborator,
  requirePermission,
  Permission,
} from "@/lib/rbac";

/**
 * DELETE /api/v1/collaborators/[id]
 * Remove a collaborator from a project
 * Only project owners can remove collaborators
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: collaboratorId } = params;

    if (!collaboratorId) {
      return NextResponse.json(
        { error: "Collaborator ID is required" },
        { status: 400 }
      );
    }

    // Get the collaborator to find the project
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
        { status: 404 }
      );
    }

    // Check if user has permission to remove collaborators
    const canModify = await canModifyCollaborator(
      userId,
      collaborator.ProjectId,
      collaboratorId
    );

    if (!canModify.authorized) {
      return NextResponse.json(
        { error: canModify.reason || "Forbidden" },
        { status: 403 }
      );
    }

    // Delete the collaborator
    await prisma.collaborator.delete({
      where: { Id: collaboratorId },
    });

    return NextResponse.json({
      success: true,
      message: "Collaborator removed successfully",
    });
  } catch (error: any) {
    console.error("[Collaborators API] Error removing collaborator:", error);

    if (error.status === 403) {
      return NextResponse.json(
        { error: error.message || "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}
