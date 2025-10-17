"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/project";
import type { Project } from "@/interfaces/project.interface";
import { toast } from "sonner";

// Query keys
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  userProjects: () => [...projectKeys.all, "user"] as const,
};

// Hook to get all user projects
export function useUserProjects() {
  return useQuery({
    queryKey: projectKeys.userProjects(),
    queryFn: projectService.getUserProjects,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get a specific project by ID
export function useProject(projectId: string | null) {
  return useQuery({
    queryKey: projectKeys.detail(projectId || ""),
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      return await projectService.getProjectById(projectId);
    },
    enabled: !!projectId,
  });
}

// Hook to create a new project
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      return await projectService.createProject(project);
    },
    onSuccess: (data) => {
      // Invalidate and refetch user projects
      queryClient.invalidateQueries({ queryKey: projectKeys.userProjects() });

      // Optimistically add to cache
      queryClient.setQueryData<Project[]>(
        projectKeys.userProjects(),
        (old) => {
          return old ? [data, ...old] : [data];
        }
      );

      toast.success("Project created successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project"
      );
    },
  });
}

// Hook to update a project
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      updates,
    }: {
      projectId: string;
      updates: Partial<Project>;
    }) => {
      return await projectService.updateProjectPartial(projectId, updates);
    },
    onMutate: async ({ projectId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: projectKeys.detail(projectId),
      });
      await queryClient.cancelQueries({
        queryKey: projectKeys.userProjects(),
      });

      // Snapshot the previous values
      const previousProject = queryClient.getQueryData<Project>(
        projectKeys.detail(projectId)
      );
      const previousProjects = queryClient.getQueryData<Project[]>(
        projectKeys.userProjects()
      );

      // Optimistically update the project
      if (previousProject) {
        queryClient.setQueryData<Project>(projectKeys.detail(projectId), {
          ...previousProject,
          ...updates,
        });
      }

      // Optimistically update in the list
      if (previousProjects) {
        queryClient.setQueryData<Project[]>(
          projectKeys.userProjects(),
          previousProjects.map((p) =>
            p.id === projectId ? { ...p, ...updates } : p
          )
        );
      }

      return { previousProject, previousProjects };
    },
    onSuccess: (data, { projectId }) => {
      // Update with server data
      queryClient.setQueryData(projectKeys.detail(projectId), data);
      queryClient.invalidateQueries({ queryKey: projectKeys.userProjects() });

      toast.success("Project updated successfully!");
    },
    onError: (error, { projectId }, context) => {
      // Rollback on error
      if (context?.previousProject) {
        queryClient.setQueryData(
          projectKeys.detail(projectId),
          context.previousProject
        );
      }
      if (context?.previousProjects) {
        queryClient.setQueryData(
          projectKeys.userProjects(),
          context.previousProjects
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to update project"
      );
    },
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.userProjects() });
    },
  });
}

// Hook to delete a project
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      await projectService.deleteProject(projectId);
      return projectId;
    },
    onMutate: async (projectId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: projectKeys.userProjects() });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<Project[]>(
        projectKeys.userProjects()
      );

      // Optimistically remove the project
      queryClient.setQueryData<Project[]>(
        projectKeys.userProjects(),
        (old) => (old ? old.filter((p) => p.id !== projectId) : [])
      );

      return { previousProjects };
    },
    onSuccess: () => {
      toast.success("Project deleted successfully!");
    },
    onError: (error, projectId, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(
          projectKeys.userProjects(),
          context.previousProjects
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: projectKeys.userProjects() });
    },
  });
}

// Hook to publish/unpublish a project
export function usePublishProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      publish,
    }: {
      projectId: string;
      publish: boolean;
    }) => {
      return await projectService.updateProjectPartial(projectId, {
        published: publish,
      });
    },
    onMutate: async ({ projectId, publish }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: projectKeys.detail(projectId),
      });
      await queryClient.cancelQueries({
        queryKey: projectKeys.userProjects(),
      });

      // Snapshot the previous values
      const previousProject = queryClient.getQueryData<Project>(
        projectKeys.detail(projectId)
      );
      const previousProjects = queryClient.getQueryData<Project[]>(
        projectKeys.userProjects()
      );

      // Optimistically update
      if (previousProject) {
        queryClient.setQueryData<Project>(projectKeys.detail(projectId), {
          ...previousProject,
          published: publish,
        });
      }

      if (previousProjects) {
        queryClient.setQueryData<Project[]>(
          projectKeys.userProjects(),
          previousProjects.map((p) =>
            p.id === projectId ? { ...p, published: publish } : p
          )
        );
      }

      return { previousProject, previousProjects };
    },
    onSuccess: (data, { projectId, publish }) => {
      // Update with server data
      queryClient.setQueryData(projectKeys.detail(projectId), data);
      queryClient.invalidateQueries({ queryKey: projectKeys.userProjects() });

      toast.success(
        publish
          ? "Project published successfully!"
          : "Project unpublished successfully!"
      );
    },
    onError: (error, { projectId }, context) => {
      // Rollback on error
      if (context?.previousProject) {
        queryClient.setQueryData(
          projectKeys.detail(projectId),
          context.previousProject
        );
      }
      if (context?.previousProjects) {
        queryClient.setQueryData(
          projectKeys.userProjects(),
          context.previousProjects
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to update project"
      );
    },
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.userProjects() });
    },
  });
}
