import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { validateEventHandler } from "@/schema/eventSchemas";
import { WorkflowTransformService } from "@/services/workflow/WorkflowTransformService";
import { WorkflowValidationService } from "@/services/workflow/WorkflowValidationService";

const transformWorkflow = (workflow: any) => ({
  id: workflow.Id,
  projectId: workflow.ProjectId,
  name: workflow.Name,
  description: workflow.Description,
  handlers: workflow.Handlers,
  canvasData: workflow.CanvasData || null,
  enabled: workflow.Enabled,
  createdAt: workflow.CreatedAt,
  updatedAt: workflow.UpdatedAt,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; workflowId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, workflowId } = await params;

    const workflow = await prisma.eventWorkflow.findFirst({
      where: {
        Id: workflowId,
        ProjectId: projectId,
        Project: {
          OwnerId: userId,
        },
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(transformWorkflow(workflow));
  } catch (error) {
    console.error("Error fetching event workflow:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; workflowId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, workflowId } = await params;
    const body = await req.json();

    const existingWorkflow = await prisma.eventWorkflow.findFirst({
      where: {
        Id: workflowId,
        ProjectId: projectId,
        Project: {
          OwnerId: userId,
        },
      },
    });

    if (!existingWorkflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 },
      );
    }

    let handlersToSave = body.handlers;
    let canvasDataToSave = body.canvasData;

    // If canvasData is provided, transform it to handlers
    if (body.canvasData) {
      console.log("Transforming canvas data to handlers...");

      // Validate canvas data first
      const canvasValidation = WorkflowValidationService.validateWorkflow(
        body.canvasData,
      );
      if (!canvasValidation.valid) {
        console.error("Canvas validation failed:", canvasValidation.errors);
        return NextResponse.json(
          {
            error: "Invalid workflow structure",
            details: canvasValidation.errors,
            warnings: canvasValidation.warnings,
          },
          { status: 400 },
        );
      }

      // Transform nodes to handlers
      const transformResult = WorkflowTransformService.transform(
        body.canvasData,
      );

      if (transformResult.errors.length > 0) {
        console.error("Transformation failed:", transformResult.errors);
        return NextResponse.json(
          {
            error: "Failed to transform workflow",
            details: transformResult.errors,
            warnings: transformResult.warnings,
          },
          { status: 400 },
        );
      }

      handlersToSave = transformResult.handlers;

      // Log transformation info
      console.log("Transformation successful:", {
        nodeCount: body.canvasData.nodes.length,
        handlerCount: handlersToSave.length,
        warnings: transformResult.warnings,
      });
    }

    // Validate handlers if provided
    if (handlersToSave && handlersToSave.length > 0) {
      const handlersValidation =
        WorkflowValidationService.validateHandlers(handlersToSave);

      if (!handlersValidation.valid) {
        console.error("Handler validation failed:", handlersValidation.errors);
        return NextResponse.json(
          {
            error: "Invalid handler configuration",
            details: handlersValidation.errors,
          },
          { status: 400 },
        );
      }
    }

    // Clean undefined values from handlers
    const cleanHandlers = handlersToSave
      ? handlersToSave.map((handler: any) => {
          const cleanHandler: any = {};
          Object.entries(handler).forEach(([key, value]) => {
            if (value !== undefined) {
              cleanHandler[key] = value;
            }
          });
          return cleanHandler;
        })
      : existingWorkflow.Handlers;

    // Build update data object
    const updateData: any = {
      Name: body.name || existingWorkflow.Name,
      Description:
        body.description !== undefined
          ? body.description
          : existingWorkflow.Description,
      Handlers: cleanHandlers,
      Enabled:
        body.enabled !== undefined ? body.enabled : existingWorkflow.Enabled,
    };

    // Only include CanvasData if it was provided and is not undefined
    if (canvasDataToSave !== undefined && canvasDataToSave !== null) {
      updateData.CanvasData = canvasDataToSave;
    } else if (canvasDataToSave === null) {
      // Explicitly set to null if needed
      updateData.CanvasData = null;
    }

    // Update workflow in database
    const updatedWorkflow = await prisma.eventWorkflow.update({
      where: { Id: workflowId },
      data: updateData,
    });

    console.log("Workflow updated successfully:", {
      workflowId,
      hasCanvasData: !!updatedWorkflow.CanvasData,
      handlerCount: Array.isArray(updatedWorkflow.Handlers)
        ? updatedWorkflow.Handlers.length
        : 0,
    });

    return NextResponse.json(transformWorkflow(updatedWorkflow));
  } catch (error) {
    const { projectId, workflowId } = await params;
    console.error("Error updating event workflow:", {
      error,
      workflowId,
      projectId,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to update workflow",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; workflowId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, workflowId } = await params;

    const workflow = await prisma.eventWorkflow.findFirst({
      where: {
        Id: workflowId,
        ProjectId: projectId,
        Project: {
          OwnerId: userId,
        },
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 },
      );
    }

    await prisma.eventWorkflow.delete({
      where: { Id: workflowId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event workflow:", error);
    return NextResponse.json(
      { error: "Failed to delete workflow" },
      { status: 500 },
    );
  }
}
