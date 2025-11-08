/**
 * Role-Based Access Control (RBAC) Module
 *
 * This module provides a comprehensive authorization system for managing
 * collaborative access to projects.
 *
 * @example
 * ```typescript
 * import { requirePermission, Permission } from '@/lib/rbac';
 *
 * // In an API route
 * const access = await requirePermission(userId, projectId, Permission.PROJECT_EDIT);
 * ```
 */

export {
  // Permission enum
  Permission,
  // Role definitions
  ROLE_PERMISSIONS,
  ROLE_DESCRIPTIONS,
  // Permission checking functions
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canPerformAction,
  // Role hierarchy functions
  getRoleHierarchy,
  isHigherRole,
  getAssignableRoles,
  canChangeRole,
} from "./permissions";

export {
  // Authorization result types
  type AuthorizationResult,
  type UserProjectAccess,
  // Core authorization functions
  getUserProjectAccess,
  authorizeUserAction,
  authorizeUserAnyPermission,
  requirePermission,
  // Collaborator-specific authorization
  canModifyCollaborator,
  canRemoveCollaborator,
  // Resource ownership
  userOwnsResource,
  // Project queries
  getUserProjectsWithPermission,
  getUserPermissions,
  // Realtime collaboration
  canAccessRealtimeCollab,
} from "./authorization";

// Re-export CollaboratorRole from interfaces
export { CollaboratorRole } from "@/interfaces/collaboration.interface";
