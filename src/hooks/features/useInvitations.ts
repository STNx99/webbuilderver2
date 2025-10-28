"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationService } from "@/services/invitation";
import type {
  Invitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
} from "@/interfaces/collaboration.interface";
import { toast } from "sonner";

// Query keys for invitations
export const invitationKeys = {
  all: ["invitations"] as const,
  lists: () => [...invitationKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...invitationKeys.lists(), filters] as const,
  byProject: (projectId: string) =>
    [...invitationKeys.all, "project", projectId] as const,
};

/**
 * Hook to get all invitations for a specific project
 * @param projectId - The project ID
 * @param enabled - Whether the query should be enabled (default: true)
 */
export function useProjectInvitations(
  projectId: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: invitationKeys.byProject(projectId || ""),
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const invitations =
        await invitationService.getProjectInvitations(projectId);
      return invitations || [];
    },
    enabled: !!projectId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to create a new invitation
 * Automatically invalidates project invitations cache on success
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvitationRequest) => {
      return await invitationService.createInvitation(data);
    },
    onMutate: async (data) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: invitationKeys.byProject(data.projectId),
      });

      // Snapshot the previous value
      const previousInvitations = queryClient.getQueryData<Invitation[]>(
        invitationKeys.byProject(data.projectId),
      );

      return { previousInvitations, projectId: data.projectId };
    },
    onSuccess: (newInvitation, variables) => {
      // Optimistically add to cache
      queryClient.setQueryData<Invitation[]>(
        invitationKeys.byProject(variables.projectId),
        (old) => {
          return old ? [newInvitation, ...old] : [newInvitation];
        },
      );

      toast.success(`Invitation sent to ${variables.email}!`);
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousInvitations) {
        queryClient.setQueryData(
          invitationKeys.byProject(context.projectId),
          context.previousInvitations,
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to send invitation",
      );
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: invitationKeys.byProject(variables.projectId),
      });
    },
  });
}

/**
 * Hook to accept an invitation
 * Invalidates both invitations and collaborators caches
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AcceptInvitationRequest) => {
      return await invitationService.acceptInvitation(data);
    },
    onSuccess: () => {
      // Invalidate all invitation and collaborator queries
      // since we don't know which project this invitation was for
      queryClient.invalidateQueries({
        queryKey: invitationKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["collaborators"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      toast.success("Invitation accepted! You are now a collaborator.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept invitation",
      );
    },
  });
}

/**
 * Hook to delete/revoke an invitation
 * @param projectId - Optional project ID for optimistic updates
 */
export function useDeleteInvitation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      return await invitationService.deleteInvitation(invitationId);
    },
    onMutate: async (invitationId) => {
      if (!projectId) return {};

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: invitationKeys.byProject(projectId),
      });

      // Snapshot the previous value
      const previousInvitations = queryClient.getQueryData<Invitation[]>(
        invitationKeys.byProject(projectId),
      );

      // Optimistically remove the invitation
      queryClient.setQueryData<Invitation[]>(
        invitationKeys.byProject(projectId),
        (old) => (old ? old.filter((inv) => inv.id !== invitationId) : []),
      );

      return { previousInvitations, projectId };
    },
    onSuccess: (_, __, context) => {
      toast.success("Invitation deleted successfully!");

      // If we have a projectId, invalidate that specific query
      if (context?.projectId) {
        queryClient.invalidateQueries({
          queryKey: invitationKeys.byProject(context.projectId),
        });
      }
    },
    onError: (error, invitationId, context) => {
      // Rollback on error
      if (context?.previousInvitations && context?.projectId) {
        queryClient.setQueryData(
          invitationKeys.byProject(context.projectId),
          context.previousInvitations,
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to delete invitation",
      );
    },
    onSettled: (_, __, ___, context) => {
      // Always refetch after error or success
      if (context?.projectId) {
        queryClient.invalidateQueries({
          queryKey: invitationKeys.byProject(context.projectId),
        });
      } else {
        // If no projectId, invalidate all invitation queries
        queryClient.invalidateQueries({
          queryKey: invitationKeys.all,
        });
      }
    },
  });
}

/**
 * Combined hook for invitation management
 * Provides all invitation operations in a single hook
 */
export function useInvitationManager(projectId: string | null) {
  const invitations = useProjectInvitations(projectId);
  const createInvitation = useCreateInvitation();
  const acceptInvitation = useAcceptInvitation();
  const deleteInvitation = useDeleteInvitation(projectId || undefined);

  return {
    // Query states
    invitations: invitations.data || [],
    isLoading: invitations.isLoading,
    isError: invitations.isError,
    error: invitations.error,

    // Mutations
    createInvitation: createInvitation.mutate,
    createInvitationAsync: createInvitation.mutateAsync,
    isCreating: createInvitation.isPending,

    acceptInvitation: acceptInvitation.mutate,
    acceptInvitationAsync: acceptInvitation.mutateAsync,
    isAccepting: acceptInvitation.isPending,

    deleteInvitation: deleteInvitation.mutate,
    deleteInvitationAsync: deleteInvitation.mutateAsync,
    isDeleting: deleteInvitation.isPending,

    // Refetch
    refetch: invitations.refetch,
  };
}
