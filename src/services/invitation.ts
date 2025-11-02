import GetUrl from "@/lib/utils/geturl";
import { API_ENDPOINTS } from "@/constants/endpoints";
import apiClient from "./apiclient";
import {
  Invitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
  InvitationListResponse,
} from "@/interfaces/collaboration.interface";

export interface UpdateInvitationStatusRequest {
  status: string;
}

interface IInvitationService {
  createInvitation: (data: CreateInvitationRequest) => Promise<Invitation>;
  getProjectInvitations: (projectId: string) => Promise<Invitation[]>;
  getPendingInvitationsByProject: (projectId: string) => Promise<Invitation[]>;
  acceptInvitation: (data: AcceptInvitationRequest) => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<Invitation>;
  updateInvitationStatus: (
    invitationId: string,
    status: string,
  ) => Promise<Invitation>;
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
      const response = await apiClient.get<Invitation[]>(
        GetUrl(API_ENDPOINTS.INVITATIONS.GET_BY_PROJECT(projectId)),
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn(
        `Failed to fetch invitations for project ${projectId}:`,
        error,
      );
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
   * Get pending invitations for a specific project
   * @param projectId - The project ID
   * @returns Promise<Invitation[]> - Array of pending invitations
   */
  getPendingInvitationsByProject: async (
    projectId: string,
  ): Promise<Invitation[]> => {
    try {
      const response = await apiClient.get<Invitation[]>(
        GetUrl(API_ENDPOINTS.INVITATIONS.GET_PENDING_BY_PROJECT(projectId)),
      );
      const invitations = Array.isArray(response) ? response : [];
      return invitations;
    } catch (error) {
      return [];
    }
  },

  /**
   * Cancel an invitation
   * @param invitationId - The invitation ID to cancel
   * @returns Promise<Invitation> - The updated invitation
   */
  cancelInvitation: async (invitationId: string): Promise<Invitation> => {
    return apiClient.patch<Invitation>(
      GetUrl(API_ENDPOINTS.INVITATIONS.CANCEL(invitationId)),
      {},
    );
  },

  /**
   * Update the status of an invitation
   * @param invitationId - The invitation ID
   * @param status - The new status
   * @returns Promise<Invitation> - The updated invitation
   */
  updateInvitationStatus: async (
    invitationId: string,
    status: string,
  ): Promise<Invitation> => {
    return apiClient.patch<Invitation>(
      GetUrl(API_ENDPOINTS.INVITATIONS.UPDATE_STATUS(invitationId)),
      { status },
    );
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
