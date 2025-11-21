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
  detail: (workflowId: string) =>
    [...QUERY_KEYS.details(), workflowId] as const,
};

export function useEventWorkflows(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.list(projectId),
    queryFn: async () => {
      const result = await eventWorkflowService.getEventWorkflows(projectId);
      if (!Array.isArray(result)) {
        console.error("Expected array from getEventWorkflows, got:", result);
        return [];
      }
      return result;
    },
    enabled: !!projectId,
  });
}

export function useEventWorkflow(workflowId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(workflowId),
    queryFn: () => eventWorkflowService.getEventWorkflowById(workflowId),
    enabled: enabled && !!workflowId,
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
      workflowId,
      input,
    }: {
      workflowId: string;
      input: UpdateEventWorkflowInput;
    }) => eventWorkflowService.updateEventWorkflow(workflowId, input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.detail(variables.workflowId),
      });
    },
    onError: (error: Error) => {
      console.error("Failed to update workflow:", error.message);
    },
  });
}

export function useUpdateEventWorkflowEnabled() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workflowId,
      enabled,
    }: {
      workflowId: string;
      enabled: boolean;
    }) => eventWorkflowService.updateEventWorkflowEnabled(workflowId, enabled),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.detail(variables.workflowId),
      });
    },
    onError: (error: Error) => {
      console.error("Failed to update workflow enabled status:", error.message);
    },
  });
}

export function useDeleteEventWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workflowId }: { workflowId: string }) =>
      eventWorkflowService.deleteEventWorkflow(workflowId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.lists(),
      });
    },
    onError: (error: Error) => {
      console.error("Failed to delete workflow:", error.message);
    },
  });
}