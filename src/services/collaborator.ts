import GetUrl from "@/lib/utils/geturl";
import { API_ENDPOINTS } from "@/constants/endpoints";
import apiClient from "./apiclient";
import {
  Collaborator,
  UpdateCollaboratorRoleRequest,
  CollaboratorListResponse,
} from "@/interfaces/collaboration.interface";

interface ICollaboratorService {
  getProjectCollaborators: (projectId: string) => Promise<Collaborator[]>;
  updateCollaboratorRole: (
    collaboratorId: string,
    data: UpdateCollaboratorRoleRequest,
  ) => Promise<Collaborator>;
  removeCollaborator: (collaboratorId: string) => Promise<boolean>;
  leaveProject: (projectId: string) => Promise<boolean>;
}

export const collaboratorService: ICollaboratorService = {
  /**
   * Get all collaborators for a specific project
   * @param projectId - The project ID
   * @returns Promise<Collaborator[]> - Array of collaborators with user details
   */
  getProjectCollaborators: async (
    projectId: string,
  ): Promise<Collaborator[]> => {
    try {
      const response = await apiClient.get<CollaboratorListResponse>(
        GetUrl(API_ENDPOINTS.COLLABORATORS.GET_BY_PROJECT(projectId)),
      );
      // Ensure we always return an array, even if the response is malformed
      return Array.isArray(response?.collaborators)
        ? response.collaborators
        : [];
    } catch (error) {
      console.warn(
        `Failed to fetch collaborators for project ${projectId}:`,
        error,
      );
      // Return empty array on error to prevent undefined return
      return [];
    }
  },

  /**
   * Update a collaborator's role (owner only)
   * @param collaboratorId - The collaborator ID
   * @param data - New role data
   * @returns Promise<Collaborator> - Updated collaborator
   */
  updateCollaboratorRole: async (
    collaboratorId: string,
    data: UpdateCollaboratorRoleRequest,
  ): Promise<Collaborator> => {
    return apiClient.patch<Collaborator>(
      GetUrl(API_ENDPOINTS.COLLABORATORS.UPDATE_ROLE(collaboratorId)),
      data,
    );
  },

  /**
   * Remove a collaborator from a project (owner only)
   * @param collaboratorId - The collaborator ID to remove
   * @returns Promise<boolean> - Success status
   */
  removeCollaborator: async (collaboratorId: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.COLLABORATORS.REMOVE(collaboratorId)),
    );
  },

  /**
   * Leave a project (remove self as collaborator)
   * @param projectId - The project ID to leave
   * @returns Promise<boolean> - Success status
   */
  leaveProject: async (projectId: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.COLLABORATORS.REMOVE_SELF(projectId)),
    );
  },
};
