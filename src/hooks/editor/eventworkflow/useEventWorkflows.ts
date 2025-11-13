"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventWorkflowService } from "@/services/eventWorkflow.service";
import {
  EventWorkflow,
  CreateEventWorkflowInput,
  UpdateEventWorkflowInput,
} from "@/interfaces/eventWorkflow.interface";

const QUERY_KEYS = {
  all: ["eventWorkflows"] as const,
  lists: () => [...QUERY_KEYS.all, "list"] as const,
  list: (projectId: string) => [...QUERY_KEYS.lists(), projectId] as const,
  details: () => [...QUERY_KEYS.all, "detail"] as const,
  detail: (projectId: string, workflowId: string) =>
    [...QUERY_KEYS.details(), projectId, workflowId] as const,
};

export function useEventWorkflows(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.list(projectId),
    queryFn: () => eventWorkflowService.getEventWorkflows(projectId),
    enabled: !!projectId,
  });
}

export function useEventWorkflow(
  projectId: string,
  workflowId: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(projectId, workflowId),
    queryFn: () =>
      eventWorkflowService.getEventWorkflowById(projectId, workflowId),
    enabled: enabled && !!projectId && !!workflowId,
  });
}

export function useCreateEventWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      input,
    }: {
      projectId: string;
      input: CreateEventWorkflowInput;
    }) => eventWorkflowService.createEventWorkflow(projectId, input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.list(variables.projectId),
      });
    },
    onError: (error: Error) => {
      console.error("Failed to create workflow:", error.message);
    },
  });
}

export function useUpdateEventWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      workflowId,
      input,
    }: {
      projectId: string;
      workflowId: string;
      input: UpdateEventWorkflowInput;
    }) =>
      eventWorkflowService.updateEventWorkflow(projectId, workflowId, input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.list(variables.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.detail(variables.projectId, variables.workflowId),
      });
    },
    onError: (error: Error) => {
      console.error("Failed to update workflow:", error.message);
    },
  });
}

export function useDeleteEventWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      workflowId,
    }: {
      projectId: string;
      workflowId: string;
    }) => eventWorkflowService.deleteEventWorkflow(projectId, workflowId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.list(variables.projectId),
      });
    },
    onError: (error: Error) => {
      console.error("Failed to delete workflow:", error.message);
    },
  });
}
