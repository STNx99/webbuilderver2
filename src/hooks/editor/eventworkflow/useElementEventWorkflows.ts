"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { elementEventWorkflowService } from "@/services/elementEventWorkflow";
import { EVENT_TYPES } from "@/constants/eventWorkflows";
import { EventWorkflow } from "@/interfaces/eventWorkflow.interface";
import { toast } from "sonner";
import {
  CreateElementEventWorkflowSchema,
  DisconnectElementEventWorkflowSchema,
  getFirstError,
  validateCreateConnection,
  validateDisconnectConnection,
} from "@/schema/elementEventWorkflowSchemas";

/**
 * Type definition for element-workflow event connections
 */
export interface IElementEventWorkflowConnection {
  id: string;
  elementId: string;
  eventName: string;
  workflowId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Query key factory for consistent cache management
 */
const QUERY_KEYS = {
  all: ["elementEventWorkflows"] as const,
  byElement: (elementId: string) =>
    [...QUERY_KEYS.all, "byElement", elementId] as const,
};

/**
 * Hook options
 */
interface UseElementEventWorkflowsOptions {
  elementId?: string;
}

/**
 * Validates connection input using Zod schemas
 * @param elementId - Element ID to validate
 * @param eventType - Event type to validate
 * @param workflowId - Workflow ID to validate
 * @returns Validation result with optional error message
 */
function validateConnectionInput(
  elementId: string,
  eventType: string,
  workflowId: string,
): { isValid: boolean; error?: string } {
  const result = validateCreateConnection({
    elementId,
    eventName: eventType,
    workflowId,
  });

  if (!result.success) {
    return {
      isValid: false,
      error: getFirstError(result) || "Invalid connection data",
    };
  }

  return { isValid: true };
}

/**
 * Validates disconnect input using Zod schemas
 * @param elementId - Element ID to validate
 * @param eventType - Event type to validate
 * @param workflowId - Workflow ID to validate
 * @returns Validation result with optional error message
 */
function validateDisconnectInput(
  elementId: string,
  eventType: string,
  workflowId: string,
): { isValid: boolean; error?: string } {
  const result = validateDisconnectConnection({
    elementId,
    eventName: eventType,
    workflowId,
  });

  if (!result.success) {
    return {
      isValid: false,
      error: getFirstError(result) || "Invalid disconnect data",
    };
  }

  return { isValid: true };
}

/**
 * Hook for managing element-to-workflow event connections
 * Provides queries and mutations for connecting/disconnecting workflows to elements
 */
export function useElementEventWorkflows(
  options: UseElementEventWorkflowsOptions = {},
) {
  const { elementId } = options;
  const queryClient = useQueryClient();

  /**
   * Query: Fetch all event workflow connections for the element
   */
  const {
    data: connections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.byElement(elementId || ""),
    queryFn: async () => {
      if (!elementId) return [];
      try {
        const result =
          await elementEventWorkflowService.getElementEventWorkflowsByElement(
            elementId,
          );
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error("Failed to fetch element event workflows:", error);
        return [];
      }
    },
    enabled: !!elementId,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });

  /**
   * Invalidate and refetch connection data
   */
  const invalidateConnections = useCallback(async () => {
    if (!elementId) return;
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.byElement(elementId),
    });
  }, [elementId, queryClient]);

  /**
   * Get workflows connected to a specific event
   * Memoized to avoid unnecessary recalculations
   */
  const getConnectedWorkflows = useCallback(
    (eventType: string, workflows: EventWorkflow[]) => {
      return connections
        .filter((conn) => conn.eventName === eventType)
        .map((conn) => workflows.find((w) => w.id === conn.workflowId))
        .filter(Boolean) as EventWorkflow[];
    },
    [connections],
  );

  /**
   * Check if a workflow is connected to any event
   */
  const isWorkflowConnected = useCallback(
    (workflowId: string) => {
      return connections.some((conn) => conn.workflowId === workflowId);
    },
    [connections],
  );

  /**
   * Get all event types that a workflow is connected to
   */
  const getWorkflowConnections = useCallback(
    (workflowId: string) => {
      return EVENT_TYPES.filter((event) =>
        connections.some(
          (conn) =>
            conn.workflowId === workflowId && conn.eventName === event.value,
        ),
      );
    },
    [connections],
  );

  /**
   * Check if a specific workflow is connected to an event
   */
  const isConnectedToEvent = useCallback(
    (eventType: string, workflowId: string) => {
      return connections.some(
        (conn) =>
          conn.eventName === eventType && conn.workflowId === workflowId,
      );
    },
    [connections],
  );

  /**
   * Connect a workflow to an element event
   */
  const handleConnect = useCallback(
    async (elementId: string, eventType: string, workflowId: string) => {
      // Validate input with Zod
      const validation = validateConnectionInput(
        elementId,
        eventType,
        workflowId,
      );
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid connection data");
        return false;
      }

      // Check for duplicate connection
      if (isConnectedToEvent(eventType, workflowId)) {
        toast.info("Workflow already connected to this event");
        return false;
      }

      try {
        // Parse with Zod to get typed data
        const validatedData = CreateElementEventWorkflowSchema.parse({
          elementId,
          eventName: eventType,
          workflowId,
        });

        const payload = {
          elementId: validatedData.elementId,
          workflowId: validatedData.workflowId,
          eventName: validatedData.eventName,
        };

        await elementEventWorkflowService.createElementEventWorkflow(payload);

        // Invalidate related caches
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.byElement(validatedData.elementId),
        });
        await queryClient.invalidateQueries({
          queryKey: ["eventWorkflows"],
        });

        toast.success("Workflow connected successfully!");
        return true;
      } catch (error) {
        console.error("Failed to connect workflow:", error);
        toast.error("Failed to connect workflow");
        return false;
      }
    },
    [isConnectedToEvent, queryClient],
  );

  /**
   * Disconnect a workflow from an element event
   */
  const handleDisconnect = useCallback(
    async (elementId: string, eventType: string, workflowId: string) => {
      // Validate input with Zod
      const validation = validateDisconnectInput(
        elementId,
        eventType,
        workflowId,
      );
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid disconnect data");
        return false;
      }

      // Find the connection
      const connection = connections.find(
        (conn) =>
          conn.eventName === eventType && conn.workflowId === workflowId,
      );

      if (!connection) {
        toast.error("Connection not found");
        return false;
      }

      try {
        // Parse with Zod to get typed data
        const validatedData = DisconnectElementEventWorkflowSchema.parse({
          elementId,
          eventName: eventType,
          workflowId,
        });

        await elementEventWorkflowService.deleteElementEventWorkflow(
          connection.id,
        );

        // Invalidate related caches
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.byElement(validatedData.elementId),
        });
        await queryClient.invalidateQueries({
          queryKey: ["eventWorkflows"],
        });

        toast.success("Workflow disconnected");
        return true;
      } catch (error) {
        console.error("Failed to disconnect workflow:", error);
        toast.error("Failed to disconnect workflow");
        return false;
      }
    },
    [connections, queryClient],
  );

  return {
    // Data
    connections,
    isLoading,
    error,

    // Query helpers
    invalidateConnections,

    // State checkers
    getConnectedWorkflows,
    isWorkflowConnected,
    getWorkflowConnections,
    isConnectedToEvent,

    // Mutations
    handleConnect,
    handleDisconnect,
  };
}
