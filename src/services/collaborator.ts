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
  getProjectCollaborators: async (
    projectId: string,
  ): Promise<Collaborator[]> => {
    try {
      const response = await apiClient.get<CollaboratorListResponse>(
        GetUrl(API_ENDPOINTS.COLLABORATORS.GET_BY_PROJECT(projectId)),
      );
      return Array.isArray(response?.collaborators)
        ? response.collaborators
        : [];
    } catch (error) {
      console.warn(
        `Failed to fetch collaborators for project ${projectId}:`,
        error,
      );
      return [];
    }
  },

  updateCollaboratorRole: async (
    collaboratorId: string,
    data: UpdateCollaboratorRoleRequest,
  ): Promise<Collaborator> => {
    return apiClient.patch<Collaborator>(
      GetUrl(API_ENDPOINTS.COLLABORATORS.UPDATE_ROLE(collaboratorId)),
      data,
    );
  },

  removeCollaborator: async (collaboratorId: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.COLLABORATORS.REMOVE(collaboratorId)),
    );
  },

  leaveProject: async (projectId: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.COLLABORATORS.REMOVE_SELF(projectId)),
    );
  },
};
