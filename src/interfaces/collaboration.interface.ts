export enum CollaboratorRole {
  OWNER = "owner",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export interface Invitation {
  id: string;
  projectId: string;
  email: string;
  role: CollaboratorRole;
  token: string;
  expiresAt: string;
  acceptedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Collaborator {
  id: string;
  projectId: string;
  userId: string;
  role: CollaboratorRole;
  invitedBy: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export interface CreateInvitationRequest {
  projectId: string;
  email: string;
  role: CollaboratorRole;
}

export interface AcceptInvitationRequest {
  token: string;
}

export interface UpdateCollaboratorRoleRequest {
  role: CollaboratorRole;
}

export interface InvitationListResponse {
  invitations: Invitation[];
}

export interface CollaboratorListResponse {
  collaborators: Collaborator[];
}
