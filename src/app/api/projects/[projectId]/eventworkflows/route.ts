import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { validateEventHandler } from "@/schema/eventSchemas";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const workflows = await prisma.eventWorkflow.findMany({
      where: {
        ProjectId: projectId,
        Project: {
          OwnerId: userId,
        },
      },
      orderBy: { CreatedAt: "desc" },
    });

    // Transform Prisma response to match TypeScript interface
    const transformedWorkflows = workflows.map((workflow) => ({
      id: workflow.Id,
      projectId: workflow.ProjectId,
      name: workflow.Name,
      description: workflow.Description,
      handlers: workflow.Handlers,
      enabled: workflow.Enabled,
      createdAt: workflow.CreatedAt,
      updatedAt: workflow.UpdatedAt,
    }));

    return NextResponse.json(transformedWorkflows);
  } catch (error) {
    console.error("Error fetching event workflows:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflows" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();

    // Validate handlers
    const handlers = body.handlers || [];
    for (const handler of handlers) {
      const validation = validateEventHandler(handler);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Invalid handler configuration" },
          { status: 400 },
        );
      }
    }

    const workflow = await prisma.eventWorkflow.create({
      data: {
        ProjectId: projectId,
        Name: body.name,
        Description: body.description,
        Handlers: handlers,
        Enabled: body.enabled !== false,
      },
    });

    // Transform Prisma response to match TypeScript interface
    const transformedWorkflow = {
      id: workflow.Id,
      projectId: workflow.ProjectId,
      name: workflow.Name,
      description: workflow.Description,
      handlers: workflow.Handlers,
      enabled: workflow.Enabled,
      createdAt: workflow.CreatedAt,
      updatedAt: workflow.UpdatedAt,
    };

    return NextResponse.json(transformedWorkflow, { status: 201 });
  } catch (error) {
    console.error("Error creating event workflow:", error);
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 },
    );
  }
}
