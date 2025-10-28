/**
 * Collaboration Service
 *
 * This module provides a unified interface for managing project collaborations,
 * including invitations and collaborator management.
 *
 * Features:
 * - Send and manage invitations
 * - Accept invitations via token
 * - Manage collaborator roles and permissions
 * - Remove collaborators or leave projects
 */

export { invitationService } from "./invitation";
export { collaboratorService } from "./collaborator";

export type {
  Invitation,
  Collaborator,
  CreateInvitationRequest,
  AcceptInvitationRequest,
  UpdateCollaboratorRoleRequest,
  InvitationListResponse,
  CollaboratorListResponse,
  CollaboratorRole,
} from "@/interfaces/collaboration.interface";

