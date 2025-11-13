"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { WorkflowList } from "./WorkflowList";
import { WorkflowCreator } from "./WorkflowCreator";
import { WorkflowConnector } from "./WorkflowConnector";
import { WorkflowEditor } from "./WorkflowEditor";
import {
  WorkflowData,
  WorkflowNode,
  NodeType,
  Connection,
} from "./types/workflow.types";
import {
  useUpdateEventWorkflow,
  useEventWorkflow,
} from "@/hooks/editor/eventworkflow/useEventWorkflows";
import { toast } from "sonner";
import type { EventHandler } from "@/schema/eventSchemas";
import { WorkflowTransformService } from "@/services/workflow/WorkflowTransformService";
import { WorkflowValidationService } from "@/services/workflow/WorkflowValidationService";

interface EventWorkflowManagerDialogProps {
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type ViewState =
  | { type: "list" }
  | { type: "create" }
  | {
      type: "edit";
      workflowId: string;
      workflowName: string;
      initialData?: WorkflowData;
    }
  | { type: "connect"; workflowId?: string };

export const EventWorkflowManagerDialog = ({
  projectId,
  isOpen,
  onOpenChange,
}: EventWorkflowManagerDialogProps) => {
  const [viewState, setViewState] = useState<ViewState>({ type: "list" });
  const [workflowData, setWorkflowData] = useState<WorkflowData>({
    nodes: [],
    connections: [],
  });

  const updateMutation = useUpdateEventWorkflow();

  // Query for loading workflow data when editing
  const workflowQuery = useEventWorkflow(
    projectId,
    viewState.type === "edit" ? viewState.workflowId : "",
    viewState.type === "edit",
  );

  // Reset to list view when dialog opens
  useEffect(() => {
    if (isOpen) {
      setViewState({ type: "list" });
    }
  }, [isOpen]);

  // Load canvas data when workflow is fetched
  useEffect(() => {
    if (
      viewState.type === "edit" &&
      workflowQuery.data?.canvasData &&
      !viewState.initialData
    ) {
      console.log(
        "Loading canvas data from API:",
        workflowQuery.data.canvasData,
      );
      setViewState({
        ...viewState,
        initialData: workflowQuery.data.canvasData,
      });
      setWorkflowData(workflowQuery.data.canvasData);
    }
  }, [workflowQuery.data, viewState]);

  const handleCreateWorkflow = () => {
    setViewState({ type: "create" });
  };

  const handleWorkflowCreated = (workflowId: string) => {
    // Automatically open editor after creation
    setViewState({
      type: "edit",
      workflowId,
      workflowName: "New Workflow",
    });
  };

  const handleEditWorkflow = (workflowId: string, workflowName: string) => {
    console.log("Opening workflow for edit:", { workflowId, workflowName });
    setViewState({
      type: "edit",
      workflowId,
      workflowName,
      initialData: undefined,
    });
    // Data will be loaded via useEffect when query completes
  };

  const handleConnectWorkflow = (workflowId?: string) => {
    setViewState({ type: "connect", workflowId });
  };

  const handleSaveWorkflow = (workflow: WorkflowData) => {
    if (viewState.type !== "edit") return;

    console.log("Saving workflow:", {
      projectId,
      workflowId: viewState.workflowId,
      nodeCount: workflow.nodes.length,
      connectionCount: workflow.connections.length,
    });

    // Validate workflow structure before saving
    const validation = WorkflowValidationService.validateWorkflow(workflow);
    if (!validation.valid) {
      const errorMsg = WorkflowValidationService.formatErrorsForDisplay(
        validation.errors,
      );
      toast.error(`Workflow validation failed:\n${errorMsg}`);
      console.error("Validation errors:", validation.errors);
      return;
    }

    if (validation.warnings.length > 0) {
      const warningMsg = WorkflowValidationService.formatWarningsForDisplay(
        validation.warnings,
      );
      toast.warning(`Workflow warnings:\n${warningMsg}`);
    }

    // Transform workflow to handlers for execution
    const transformResult = WorkflowTransformService.transform(workflow);

    if (transformResult.errors.length > 0) {
      const errorMsg = WorkflowValidationService.formatErrorsForDisplay(
        transformResult.errors,
      );
      toast.error(`Failed to transform workflow:\n${errorMsg}`);
      console.error("Transform errors:", transformResult.errors);
      return;
    }

    console.log("Transformation successful:", {
      handlerCount: transformResult.handlers.length,
      warnings: transformResult.warnings,
    });

    // Save both canvas data and transformed handlers
    updateMutation.mutate(
      {
        projectId,
        workflowId: viewState.workflowId,
        input: {
          name: workflow.metadata?.name,
          description: workflow.metadata?.description,
          canvasData: workflow, // Save the complete canvas state
          handlers: transformResult.handlers, // Save transformed handlers
          enabled: true,
        },
      },
      {
        onSuccess: () => {
          toast.success("Workflow saved successfully!");
          console.log("Workflow saved with canvas data and handlers");
        },
        onError: (error: any) => {
          console.error("Workflow update error:", error);
          console.error("Error response:", error?.response?.data);

          // Format error message from API
          let errorMessage = "Failed to save workflow";
          if (error?.response?.data?.details) {
            const details = error.response.data.details;
            if (Array.isArray(details)) {
              errorMessage = details
                .map((d: any) => `${d.nodeLabel || "Node"}: ${d.message}`)
                .join("\n");
            } else {
              errorMessage = JSON.stringify(details);
            }
          } else if (error?.message) {
            errorMessage = error.message;
          }

          toast.error(`Error saving workflow:\n${errorMessage}`);
        },
      },
    );
  };

  const handleBackToList = () => {
    setViewState({ type: "list" });
  };

  const handleClose = () => {
    setViewState({ type: "list" });
    onOpenChange(false);
  };

  const isFullScreenView = viewState.type === "edit";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          isFullScreenView
            ? "max-w-[95vw]! h-[95vh] p-0"
            : "max-w-4xl! max-h-[90vh]"
        }
      >
        <VisuallyHidden>
          <DialogTitle>Workflow Manager</DialogTitle>
        </VisuallyHidden>
        <div
          className={
            isFullScreenView
              ? "h-full"
              : "max-h-[calc(90vh-2rem)] overflow-y-auto p-6"
          }
        >
          {viewState.type === "list" && (
            <WorkflowList
              projectId={projectId}
              onEdit={handleEditWorkflow}
              onConnect={handleConnectWorkflow}
              onCreate={handleCreateWorkflow}
            />
          )}

          {viewState.type === "create" && (
            <WorkflowCreator
              projectId={projectId}
              onSuccess={handleWorkflowCreated}
              onCancel={handleBackToList}
            />
          )}

          {viewState.type === "edit" && (
            <div className="h-full">
              {workflowQuery.isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading workflow...</p>
                  </div>
                </div>
              ) : (
                <WorkflowEditor
                  workflowName={viewState.workflowName}
                  initialWorkflow={viewState.initialData || workflowData}
                  onSave={handleSaveWorkflow}
                  onNameChange={(name) => {
                    setWorkflowData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, name },
                    }));
                  }}
                  onBack={handleBackToList}
                  className="h-full"
                />
              )}
            </div>
          )}

          {viewState.type === "connect" && (
            <WorkflowConnector
              projectId={projectId}
              workflowId={viewState.workflowId}
              onBack={handleBackToList}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventWorkflowManagerDialog;
