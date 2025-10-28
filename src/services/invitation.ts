import GetUrl from "@/lib/utils/geturl";
import { API_ENDPOINTS } from "@/constants/endpoints";
import apiClient from "./apiclient";
import {
  Invitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
  InvitationListResponse,
} from "@/interfaces/collaboration.interface";

interface IInvitationService {
  createInvitation: (data: CreateInvitationRequest) => Promise<Invitation>;
  getProjectInvitations: (projectId: string) => Promise<Invitation[]>;
  acceptInvitation: (data: AcceptInvitationRequest) => Promise<void>;
  deleteInvitation: (invitationId: string) => Promise<boolean>;
}

export const invitationService: IInvitationService = {
  /**
   * Create a new invitation for a project
   * @param data - Invitation creation data (projectId, email, role)
   * @returns Promise<Invitation> - The created invitation
   */
  createInvitation: async (
    data: CreateInvitationRequest,
  ): Promise<Invitation> => {
    return apiClient.post<Invitation>(
      GetUrl(API_ENDPOINTS.INVITATIONS.CREATE),
      data,
    );
  },

  /**
   * Get all invitations for a specific project
   * @param projectId - The project ID
   * @returns Promise<Invitation[]> - Array of invitations
   */
  getProjectInvitations: async (projectId: string): Promise<Invitation[]> => {
    try {
      const response = await apiClient.get<InvitationListResponse>(
        GetUrl(API_ENDPOINTS.INVITATIONS.GET_BY_PROJECT(projectId)),
      );
      // Ensure we always return an array, even if the response is malformed
      return Array.isArray(response?.invitations) ? response.invitations : [];
    } catch (error) {
      console.warn(
        `Failed to fetch invitations for project ${projectId}:`,
        error,
      );
      // Return empty array on error to prevent undefined return
      return [];
    }
  },

  /**
   * Accept an invitation using a token
   * @param data - Acceptance data containing the invitation token
   * @returns Promise<void>
   */
  acceptInvitation: async (data: AcceptInvitationRequest): Promise<void> => {
    await apiClient.post<void>(GetUrl(API_ENDPOINTS.INVITATIONS.ACCEPT), data);
  },

  /**
   * Delete an invitation (only for project owners)
   * @param invitationId - The invitation ID to delete
   * @returns Promise<boolean> - Success status
   */
  deleteInvitation: async (invitationId: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.INVITATIONS.DELETE(invitationId)),
    );
  },
};
