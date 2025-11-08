/**
 * Role-Based Access Control (RBAC) System
 *
 * This module defines permissions, roles, and utilities for managing
 * access control in collaborative projects.
 */

import { CollaboratorRole } from "@/interfaces/collaboration.interface";

/**
 * Granular permissions for project resources
 */
export enum Permission {
  // Project-level permissions
  PROJECT_VIEW = "project:view",
  PROJECT_EDIT = "project:edit",
  PROJECT_DELETE = "project:delete",
  PROJECT_PUBLISH = "project:publish",
  PROJECT_SETTINGS = "project:settings",

  // Element permissions
  ELEMENT_VIEW = "element:view",
  ELEMENT_CREATE = "element:create",
  ELEMENT_EDIT = "element:edit",
  ELEMENT_DELETE = "element:delete",
  ELEMENT_REORDER = "element:reorder",

  // Page permissions
  PAGE_VIEW = "page:view",
  PAGE_CREATE = "page:create",
  PAGE_EDIT = "page:edit",
  PAGE_DELETE = "page:delete",

  // Collaboration permissions
  COLLABORATOR_VIEW = "collaborator:view",
  COLLABORATOR_INVITE = "collaborator:invite",
  COLLABORATOR_EDIT = "collaborator:edit",
  COLLABORATOR_REMOVE = "collaborator:remove",

  // Comment permissions
  COMMENT_VIEW = "comment:view",
  COMMENT_CREATE = "comment:create",
  COMMENT_EDIT_OWN = "comment:edit:own",
  COMMENT_EDIT_ALL = "comment:edit:all",
  COMMENT_DELETE_OWN = "comment:delete:own",
  COMMENT_DELETE_ALL = "comment:delete:all",
  COMMENT_RESOLVE = "comment:resolve",

  // Snapshot/Version permissions
  SNAPSHOT_VIEW = "snapshot:view",
  SNAPSHOT_CREATE = "snapshot:create",
  SNAPSHOT_RESTORE = "snapshot:restore",
  SNAPSHOT_DELETE = "snapshot:delete",

  // Export permissions
  EXPORT_CODE = "export:code",
  EXPORT_TEMPLATE = "export:template",

  // CMS permissions
  CMS_VIEW = "cms:view",
  CMS_EDIT = "cms:edit",
  CMS_PUBLISH = "cms:publish",
}

/**
 * Role definitions with their associated permissions
 */
export const ROLE_PERMISSIONS: Record<CollaboratorRole, Permission[]> = {
  [CollaboratorRole.OWNER]: [
    // Owners have all permissions
    Permission.PROJECT_VIEW,
    Permission.PROJECT_EDIT,
    Permission.PROJECT_DELETE,
    Permission.PROJECT_PUBLISH,
    Permission.PROJECT_SETTINGS,
    Permission.ELEMENT_VIEW,
    Permission.ELEMENT_CREATE,
    Permission.ELEMENT_EDIT,
    Permission.ELEMENT_DELETE,
    Permission.ELEMENT_REORDER,
    Permission.PAGE_VIEW,
    Permission.PAGE_CREATE,
    Permission.PAGE_EDIT,
    Permission.PAGE_DELETE,
    Permission.COLLABORATOR_VIEW,
    Permission.COLLABORATOR_INVITE,
    Permission.COLLABORATOR_EDIT,
    Permission.COLLABORATOR_REMOVE,
    Permission.COMMENT_VIEW,
    Permission.COMMENT_CREATE,
    Permission.COMMENT_EDIT_OWN,
    Permission.COMMENT_EDIT_ALL,
    Permission.COMMENT_DELETE_OWN,
    Permission.COMMENT_DELETE_ALL,
    Permission.COMMENT_RESOLVE,
    Permission.SNAPSHOT_VIEW,
    Permission.SNAPSHOT_CREATE,
    Permission.SNAPSHOT_RESTORE,
    Permission.SNAPSHOT_DELETE,
    Permission.EXPORT_CODE,
    Permission.EXPORT_TEMPLATE,
    Permission.CMS_VIEW,
    Permission.CMS_EDIT,
    Permission.CMS_PUBLISH,
  ],

  [CollaboratorRole.EDITOR]: [
    // Editors can modify content but not project settings or collaborators
    Permission.PROJECT_VIEW,
    Permission.PROJECT_EDIT,
    Permission.ELEMENT_VIEW,
    Permission.ELEMENT_CREATE,
    Permission.ELEMENT_EDIT,
    Permission.ELEMENT_DELETE,
    Permission.ELEMENT_REORDER,
    Permission.PAGE_VIEW,
    Permission.PAGE_CREATE,
    Permission.PAGE_EDIT,
    Permission.PAGE_DELETE,
    Permission.COLLABORATOR_VIEW,
    Permission.COMMENT_VIEW,
    Permission.COMMENT_CREATE,
    Permission.COMMENT_EDIT_OWN,
    Permission.COMMENT_DELETE_OWN,
    Permission.COMMENT_RESOLVE,
    Permission.SNAPSHOT_VIEW,
    Permission.SNAPSHOT_CREATE,
    Permission.EXPORT_CODE,
    Permission.CMS_VIEW,
    Permission.CMS_EDIT,
  ],

  [CollaboratorRole.VIEWER]: [
    // Viewers can only view content and add comments
    Permission.PROJECT_VIEW,
    Permission.ELEMENT_VIEW,
    Permission.PAGE_VIEW,
    Permission.COLLABORATOR_VIEW,
    Permission.COMMENT_VIEW,
    Permission.COMMENT_CREATE,
    Permission.COMMENT_EDIT_OWN,
    Permission.COMMENT_DELETE_OWN,
    Permission.SNAPSHOT_VIEW,
    Permission.CMS_VIEW,
  ],
};

/**
 * Human-readable descriptions for roles
 */
export const ROLE_DESCRIPTIONS: Record<CollaboratorRole, string> = {
  [CollaboratorRole.OWNER]: "Full access to all project features including deletion and team management",
  [CollaboratorRole.EDITOR]: "Can edit project content, pages, and elements but cannot manage team or delete project",
  [CollaboratorRole.VIEWER]: "Read-only access with ability to comment",
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: CollaboratorRole,
  permission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(
  role: CollaboratorRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(
  role: CollaboratorRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: CollaboratorRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if a role can perform an action on a resource
 * This is a convenience function that maps common actions to permissions
 */
export function canPerformAction(
  role: CollaboratorRole,
  action: "view" | "create" | "edit" | "delete",
  resource: "project" | "element" | "page" | "collaborator" | "comment" | "snapshot" | "cms"
): boolean {
  const permissionKey = `${resource}:${action}` as Permission;

  // Special case for comments - check "own" permissions for editors/viewers
  if (resource === "comment" && (action === "edit" || action === "delete")) {
    const ownPermission = `${resource}:${action}:own` as Permission;
    const allPermission = `${resource}:${action}:all` as Permission;
    return hasPermission(role, allPermission) || hasPermission(role, ownPermission);
  }

  return hasPermission(role, permissionKey);
}

/**
 * Get the hierarchy level of a role (higher = more permissions)
 */
export function getRoleHierarchy(role: CollaboratorRole): number {
  const hierarchy: Record<CollaboratorRole, number> = {
    [CollaboratorRole.VIEWER]: 1,
    [CollaboratorRole.EDITOR]: 2,
    [CollaboratorRole.OWNER]: 3,
  };
  return hierarchy[role];
}

/**
 * Check if one role has higher privileges than another
 */
export function isHigherRole(role1: CollaboratorRole, role2: CollaboratorRole): boolean {
  return getRoleHierarchy(role1) > getRoleHierarchy(role2);
}

/**
 * Get available roles that can be assigned by a user with a given role
 * For example, owners can assign any role, but editors cannot assign roles
 */
export function getAssignableRoles(userRole: CollaboratorRole): CollaboratorRole[] {
  if (userRole === CollaboratorRole.OWNER) {
    return [CollaboratorRole.OWNER, CollaboratorRole.EDITOR, CollaboratorRole.VIEWER];
  }
  return [];
}

/**
 * Validate if a role change is allowed
 */
export function canChangeRole(
  currentUserRole: CollaboratorRole,
  targetCurrentRole: CollaboratorRole,
  targetNewRole: CollaboratorRole
): boolean {
  // Only owners can change roles
  if (currentUserRole !== CollaboratorRole.OWNER) {
    return false;
  }

  // Can't demote yourself from owner if you're the last owner
  // (This check should be done at the application level with database query)

  return true;
}
