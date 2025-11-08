import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getUserProjectAccess } from "@/lib/rbac";

/**
 * DELETE /api/v1/collaborators/project/[projectId]/leave
 * Leave a project (remove self as collaborator)
 * Users can leave projects they collaborate on, but owners must transfer ownership first
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
    const deleted = await prisma.collaborator.deleteMany({
      where: {
        UserId: userId,
        ProjectId: projectId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }

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
