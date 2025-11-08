/**
 * Authorization Helpers
 *
 * This module provides functions to check if a user has access to perform
 * specific actions on projects and their resources.
 */

import { CollaboratorRole } from "@/interfaces/collaboration.interface";
import { Permission, hasPermission, getRoleHierarchy } from "./permissions";
import prisma from "@/lib/prisma";

/**
 * Result of an authorization check
 */
export interface AuthorizationResult {
  authorized: boolean;
  role?: CollaboratorRole;
  reason?: string;
}

/**
 * User access information for a project
 */
export interface UserProjectAccess {
  userId: string;
  projectId: string;
  role: CollaboratorRole;
  isOwner: boolean;
  isCollaborator: boolean;
}

/**
 * Get user's role and access level for a project
 */
export async function getUserProjectAccess(
  userId: string,
  projectId: string
): Promise<UserProjectAccess | null> {
  try {
    // First check if user is the project owner
    const project = await prisma.project.findUnique({
      where: { Id: projectId },
      select: { OwnerId: true, DeletedAt: true },
    });

    if (!project) {
      return null;
    }

    // Don't allow access to deleted projects
    if (project.DeletedAt !== null) {
      return null;
    }

    // User is the owner
    if (project.OwnerId === userId) {
      return {
        userId,
        projectId,
        role: CollaboratorRole.OWNER,
        isOwner: true,
        isCollaborator: false,
      };
    }

    // Check if user is a collaborator
    const collaborator = await prisma.collaborator.findUnique({
      where: {
        UserId_ProjectId: {
          UserId: userId,
          ProjectId: projectId,
        },
      },
      select: { Role: true },
    });

    if (collaborator) {
      return {
        userId,
        projectId,
        role: collaborator.Role as CollaboratorRole,
        isOwner: false,
        isCollaborator: true,
      };
    }

    // User has no access
    return null;
  } catch (error) {
    console.error("[Authorization] Error getting user project access:", error);
    return null;
  }
}

/**
 * Check if user has permission to perform an action on a project
 */
export async function authorizeUserAction(
  userId: string,
  projectId: string,
  permission: Permission
): Promise<AuthorizationResult> {
  const access = await getUserProjectAccess(userId, projectId);

  if (!access) {
    return {
      authorized: false,
      reason: "User does not have access to this project",
    };
  }

  const hasRequiredPermission = hasPermission(access.role, permission);

  if (!hasRequiredPermission) {
    return {
      authorized: false,
      role: access.role,
      reason: `User role '${access.role}' does not have permission '${permission}'`,
    };
  }

  return {
    authorized: true,
    role: access.role,
  };
}

/**
 * Check if user has any of the specified permissions
 */
export async function authorizeUserAnyPermission(
  userId: string,
  projectId: string,
  permissions: Permission[]
): Promise<AuthorizationResult> {
  const access = await getUserProjectAccess(userId, projectId);

  if (!access) {
    return {
      authorized: false,
      reason: "User does not have access to this project",
    };
  }

  const hasAnyPermission = permissions.some((permission) =>
    hasPermission(access.role, permission)
  );

  if (!hasAnyPermission) {
    return {
      authorized: false,
      role: access.role,
      reason: `User role '${access.role}' does not have any of the required permissions`,
    };
  }

  return {
    authorized: true,
    role: access.role,
  };
}

/**
 * Check if user can modify another collaborator
 */
export async function canModifyCollaborator(
  userId: string,
  projectId: string,
  targetCollaboratorId: string
): Promise<AuthorizationResult> {
  const userAccess = await getUserProjectAccess(userId, projectId);

  if (!userAccess) {
    return {
      authorized: false,
      reason: "User does not have access to this project",
    };
  }

  // Only owners can modify collaborators
  if (userAccess.role !== CollaboratorRole.OWNER) {
    return {
      authorized: false,
      role: userAccess.role,
      reason: "Only project owners can modify collaborators",
    };
  }

  // Get target collaborator info
  const targetCollaborator = await prisma.collaborator.findUnique({
    where: { Id: targetCollaboratorId },
    select: { UserId: true, Role: true, ProjectId: true },
  });

  if (!targetCollaborator) {
    return {
      authorized: false,
      role: userAccess.role,
      reason: "Target collaborator not found",
    };
  }

  // Verify the target collaborator belongs to this project
  if (targetCollaborator.ProjectId !== projectId) {
    return {
      authorized: false,
      role: userAccess.role,
      reason: "Target collaborator does not belong to this project",
    };
  }

  // Can't modify yourself through the collaborator API
  // (Owners should use project transfer instead)
  if (targetCollaborator.UserId === userId) {
    return {
      authorized: false,
      role: userAccess.role,
      reason: "Cannot modify your own access level",
    };
  }

  return {
    authorized: true,
    role: userAccess.role,
  };
}

/**
 * Check if user can remove a collaborator
 */
export async function canRemoveCollaborator(
  userId: string,
  projectId: string,
  targetUserId: string
): Promise<AuthorizationResult> {
  const userAccess = await getUserProjectAccess(userId, projectId);

  if (!userAccess) {
    return {
      authorized: false,
      reason: "User does not have access to this project",
    };
  }

  // Users can remove themselves (leave project)
  if (targetUserId === userId) {
    // Owner can't leave if they're the only owner
    if (userAccess.isOwner) {
      const ownerCount = await prisma.project.count({
        where: { Id: projectId, OwnerId: userId },
      });

      if (ownerCount > 0) {
        return {
          authorized: false,
          role: userAccess.role,
          reason: "Project owner must transfer ownership before leaving",
        };
      }
    }

    return {
      authorized: true,
      role: userAccess.role,
    };
  }

  // Only owners can remove other collaborators
  if (userAccess.role !== CollaboratorRole.OWNER) {
    return {
      authorized: false,
      role: userAccess.role,
      reason: "Only project owners can remove collaborators",
    };
  }

  return {
    authorized: true,
    role: userAccess.role,
  };
}

/**
 * Check if user owns a specific resource (e.g., comment)
 */
export async function userOwnsResource(
  userId: string,
  resourceType: "comment",
  resourceId: string
): Promise<boolean> {
  try {
    switch (resourceType) {
      case "comment": {
        const comment = await prisma.comment.findUnique({
          where: { Id: resourceId },
          select: { AuthorId: true },
        });
        return comment?.AuthorId === userId;
      }
      default:
        return false;
    }
  } catch (error) {
    console.error("[Authorization] Error checking resource ownership:", error);
    return false;
  }
}

/**
 * Middleware-friendly authorization check
 * Throws an error if authorization fails
 */
export async function requirePermission(
  userId: string,
  projectId: string,
  permission: Permission
): Promise<UserProjectAccess> {
  const result = await authorizeUserAction(userId, projectId, permission);

  if (!result.authorized) {
    const error = new Error(result.reason || "Unauthorized");
    (error as any).status = 403;
    throw error;
  }

  const access = await getUserProjectAccess(userId, projectId);
  if (!access) {
    const error = new Error("Failed to get user access information");
    (error as any).status = 500;
    throw error;
  }

  return access;
}

/**
 * Get all projects where user has a specific permission
 */
export async function getUserProjectsWithPermission(
  userId: string,
  permission: Permission
): Promise<string[]> {
  try {
    // Get owned projects (owners have all permissions)
    const ownedProjects = await prisma.project.findMany({
      where: {
        OwnerId: userId,
        DeletedAt: null,
      },
      select: { Id: true },
    });

    // Get collaborated projects where user has the permission
    const collaborations = await prisma.collaborator.findMany({
      where: {
        UserId: userId,
      },
      select: { ProjectId: true, Role: true },
    });

    const collaboratedProjects = collaborations
      .filter((collab) =>
        hasPermission(collab.Role as CollaboratorRole, permission)
      )
      .map((collab) => collab.ProjectId);

    // Combine and deduplicate
    const allProjectIds = [
      ...ownedProjects.map((p) => p.Id),
      ...collaboratedProjects,
    ];

    return [...new Set(allProjectIds)];
  } catch (error) {
    console.error(
      "[Authorization] Error getting user projects with permission:",
      error
    );
    return [];
  }
}

/**
 * Check if user has permission to access realtime collaboration features
 */
export async function canAccessRealtimeCollab(
  userId: string,
  projectId: string
): Promise<boolean> {
  const access = await getUserProjectAccess(userId, projectId);
  if (!access) return false;

  // All roles with project access can use realtime features
  // Viewers can see cursors but can't edit
  return hasPermission(access.role, Permission.PROJECT_VIEW);
}

/**
 * Get user's effective permissions for a project
 */
export async function getUserPermissions(
  userId: string,
  projectId: string
): Promise<Permission[]> {
  const access = await getUserProjectAccess(userId, projectId);
  if (!access) return [];

  const { ROLE_PERMISSIONS } = await import("./permissions");
  return ROLE_PERMISSIONS[access.role];
}
