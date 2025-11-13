"use client";

import React, { useState } from "react";
import { useEventWorkflows } from "@/hooks/editor/eventworkflow/useEventWorkflows";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementStore } from "@/globalstore/elementstore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Trash2,
  Link as LinkIcon,
  Zap,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

const EVENT_TYPES = [
  {
    value: "onClick",
    label: "On Click",
    description: "When element is clicked",
  },
  {
    value: "onDoubleClick",
    label: "On Double Click",
    description: "When element is double-clicked",
  },
  {
    value: "onMouseEnter",
    label: "On Mouse Enter",
    description: "When mouse enters element",
  },
  {
    value: "onMouseLeave",
    label: "On Mouse Leave",
    description: "When mouse leaves element",
  },
  {
    value: "onSubmit",
    label: "On Submit",
    description: "When form is submitted",
  },
  {
    value: "onChange",
    label: "On Change",
    description: "When input value changes",
  },
  {
    value: "onFocus",
    label: "On Focus",
    description: "When element receives focus",
  },
  {
    value: "onBlur",
    label: "On Blur",
    description: "When element loses focus",
  },
];

interface WorkflowConnectorProps {
  projectId: string;
  workflowId?: string;
  onBack: () => void;
}

export const WorkflowConnector = ({
  projectId,
  workflowId,
  onBack,
}: WorkflowConnectorProps) => {
  const { data: workflows = [] } = useEventWorkflows(projectId);
  const { selectedElement } = useSelectionStore();
  const { updateElement } = useElementStore();
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const element = selectedElement as any;
  const elementWorkflows = element?.eventWorkflows || {};

  // Find the specific workflow if workflowId is provided
  const targetWorkflow = workflowId
    ? workflows.find((w) => w.id === workflowId)
    : null;

  const handleConnect = (eventType: string, workflowId: string) => {
    if (!element) {
      toast.error("Please select an element first");
      return;
    }

    const updatedWorkflows = { ...elementWorkflows };
    if (!updatedWorkflows[eventType]) {
      updatedWorkflows[eventType] = [];
    }

    if (updatedWorkflows[eventType].includes(workflowId)) {
      toast.info("Workflow already connected to this event");
      return;
    }

    updatedWorkflows[eventType].push(workflowId);
    updateElement(element.id, { eventWorkflows: updatedWorkflows });
    toast.success("Workflow connected successfully!");
    setSelectedEvent("");
  };

  const handleDisconnect = (eventType: string, workflowId: string) => {
    if (!element) return;

    const updatedWorkflows = { ...elementWorkflows };
    if (updatedWorkflows[eventType]) {
      updatedWorkflows[eventType] = updatedWorkflows[eventType].filter(
        (id: string) => id !== workflowId,
      );
      if (updatedWorkflows[eventType].length === 0) {
        delete updatedWorkflows[eventType];
      }
    }
    updateElement(element.id, { eventWorkflows: updatedWorkflows });
    toast.success("Workflow disconnected");
  };

  const getConnectedWorkflows = (eventType: string) => {
    return (elementWorkflows[eventType] || [])
      .map((id: string) => workflows.find((w) => w.id === id))
      .filter(Boolean);
  };

  const isWorkflowConnected = (workflowId: string) => {
    return Object.values(elementWorkflows).some((ids: any) =>
      ids.includes(workflowId),
    );
  };

  const getWorkflowConnections = (workflowId: string) => {
    return EVENT_TYPES.filter((event) =>
      elementWorkflows[event.value]?.includes(workflowId),
    );
  };

  if (!selectedElement) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Workflows
        </Button>

        <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-100 mb-1">
                  No Element Selected
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please select an element from the canvas to connect workflows
                  to its events.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Workflows
      </Button>

      {/* Element Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Connect to Element Events
          </CardTitle>
          <CardDescription>
            Selected:{" "}
            <span className="font-semibold">
              {element.name || "Unnamed Element"}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Connect for Specific Workflow */}
      {targetWorkflow && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {targetWorkflow.name}
            </CardTitle>
            <CardDescription>
              {isWorkflowConnected(targetWorkflow.id)
                ? `Connected to ${getWorkflowConnections(targetWorkflow.id).length} event(s)`
                : "Not connected yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Select
                  value={selectedEvent}
                  onValueChange={(value) => {
                    setSelectedEvent(value);
                    handleConnect(value, targetWorkflow.id);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event to connect..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((event) => (
                      <SelectItem
                        key={event.value}
                        value={event.value}
                        disabled={elementWorkflows[event.value]?.includes(
                          targetWorkflow.id,
                        )}
                      >
                        <div>
                          <div className="font-medium">{event.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {getWorkflowConnections(targetWorkflow.id).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Currently connected to:</p>
                  {getWorkflowConnections(targetWorkflow.id).map((event) => (
                    <div
                      key={event.value}
                      className="flex items-center justify-between p-2 bg-background rounded-md border"
                    >
                      <span className="text-sm">{event.label}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleDisconnect(event.value, targetWorkflow.id)
                        }
                        className="h-7 w-7 p-0 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Events</CardTitle>
          <CardDescription>
            Manage all event connections for this element
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-500px)]">
            <div className="space-y-3">
              {EVENT_TYPES.map((event) => {
                const connectedWorkflows = getConnectedWorkflows(event.value);
                const hasConnections = connectedWorkflows.length > 0;

                return (
                  <Card
                    key={event.value}
                    className={clsx(
                      "transition-colors",
                      hasConnections
                        ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                        : "border-dashed",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">
                              {event.label}
                            </h4>
                            {hasConnections && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {connectedWorkflows.length}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Connected Workflows */}
                      {hasConnections && (
                        <div className="space-y-2 mb-3 pl-3 border-l-2 border-green-300 dark:border-green-700">
                          {connectedWorkflows.map((workflow: any) => (
                            <div
                              key={workflow.id}
                              className="flex items-center justify-between p-2 bg-background rounded"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Zap className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                                <span className="text-sm truncate">
                                  {workflow.name}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDisconnect(event.value, workflow.id)
                                }
                                className="h-7 w-7 p-0 hover:text-destructive shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Workflow Dropdown */}
                      <Select
                        onValueChange={(workflowId) =>
                          handleConnect(event.value, workflowId)
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="+ Add workflow" />
                        </SelectTrigger>
                        <SelectContent>
                          {workflows
                            .filter(
                              (w) =>
                                !connectedWorkflows.some(
                                  (cw: any) => cw.id === w.id,
                                ),
                            )
                            .map((workflow) => (
                              <SelectItem key={workflow.id} value={workflow.id}>
                                <div className="flex items-center gap-2">
                                  <Zap className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                                  <span>{workflow.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowConnector;
