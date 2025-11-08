"use client";

import React from "react";
import { useProjectPermissions, Permission } from "@/hooks/useProjectPermissions";
import { CollaboratorRole } from "@/interfaces/collaboration.interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Settings,
  Users,
  Trash2,
  Eye,
  Edit,
  Upload,
  Download,
  Lock,
  MoreVertical,
  Share2,
} from "lucide-react";

interface RoleBasedActionsProps {
  projectId: string;
  onAction?: (action: string) => void;
}

/**
 * Example component demonstrating role-based access control
 *
 * This component shows different actions based on the user's role in the project.
 * It's a complete example of how to implement permission-based UI.
 */
export function RoleBasedActions({ projectId, onAction }: RoleBasedActionsProps) {
  const {
    role,
    isOwner,
    isEditor,
    isViewer,
    canEdit,
    canDelete,
    canManageCollaborators,
    canPublish,
    canExport,
    hasPermission,
    isLoading,
  } = useProjectPermissions(projectId);

  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action} by role: ${role}`);
    onAction?.(action);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No access</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Role Badge */}
      <Badge
        variant={isOwner ? "default" : isEditor ? "secondary" : "outline"}
        className="capitalize"
      >
        {role}
      </Badge>

      {/* View Action - All roles have this */}
      {hasPermission(Permission.PROJECT_VIEW) && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("view")}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>All users can view the project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Edit Action - Editors and Owners */}
      {canEdit && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAction("edit")}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editors and owners can modify content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Publish Action - Owners Only */}
      {canPublish && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAction("publish")}
              >
                <Upload className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Only owners can publish the project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Export Action - Editors and Owners */}
      {canExport && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("export")}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export project code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Share - Available to all */}
          <DropdownMenuItem onClick={() => handleAction("share")}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Link
          </DropdownMenuItem>

          {/* Team Management - Owners Only */}
          {canManageCollaborators && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction("manage-team")}>
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </DropdownMenuItem>
            </>
          )}

          {/* Settings - Owners Only */}
          {hasPermission(Permission.PROJECT_SETTINGS) && (
            <DropdownMenuItem onClick={() => handleAction("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Setting2s
            </DropdownMenuItem>
          )}

          {/* Delete - Owners Only */}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAction("delete")}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * Permission Checker Component
 * Shows which permissions the current user has
 */
interface PermissionCheckerProps {
  projectId: string;
}

export function PermissionChecker({ projectId }: PermissionCheckerProps) {
  const { role, hasPermission, isLoading } = useProjectPermissions(projectId);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading permissions...</div>;
  }

  if (!role) {
    return <div className="text-sm text-destructive">No access to this project</div>;
  }

  const permissionsToCheck = [
    { permission: Permission.PROJECT_VIEW, label: "View Project" },
    { permission: Permission.PROJECT_EDIT, label: "Edit Project" },
    { permission: Permission.PROJECT_DELETE, label: "Delete Project" },
    { permission: Permission.PROJECT_PUBLISH, label: "Publish Project" },
    { permission: Permission.ELEMENT_CREATE, label: "Create Elements" },
    { permission: Permission.PAGE_CREATE, label: "Create Pages" },
    { permission: Permission.COLLABORATOR_INVITE, label: "Invite Collaborators" },
    { permission: Permission.COLLABORATOR_EDIT, label: "Edit Collaborators" },
    { permission: Permission.COMMENT_CREATE, label: "Create Comments" },
    { permission: Permission.COMMENT_EDIT_ALL, label: "Edit All Comments" },
    { permission: Permission.SNAPSHOT_CREATE, label: "Create Snapshots" },
    { permission: Permission.SNAPSHOT_RESTORE, label: "Restore Snapshots" },
    { permission: Permission.EXPORT_CODE, label: "Export Code" },
    { permission: Permission.CMS_EDIT, label: "Edit CMS Content" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Your Role:</span>
        <Badge variant="default" className="capitalize">
          {role}
        </Badge>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Your Permissions:</h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {permissionsToCheck.map(({ permission, label }) => {
            const hasAccess = hasPermission(permission);
            return (
              <div
                key={permission}
                className={`flex items-center gap-2 rounded-md border p-2 text-sm ${
                  hasAccess
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                    : "border-muted bg-muted/50 text-muted-foreground"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    hasAccess ? "bg-green-500" : "bg-muted-foreground/50"
                  }`}
                />
                <span className="flex-1">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Role Description Component
 * Shows what each role can do
 */
export function RoleDescriptions() {
  const roles = [
    {
      role: CollaboratorRole.OWNER,
      description: "Full access to all project features",
      permissions: [
        "Manage project settings",
        "Invite and manage team members",
        "Edit all content",
        "Publish project",
        "Delete project",
        "Export code",
        "Manage snapshots",
      ],
    },
    {
      role: CollaboratorRole.EDITOR,
      description: "Can edit content but not manage settings",
      permissions: [
        "Edit project content",
        "Create and edit pages",
        "Manage elements",
        "Create snapshots",
        "Export code",
        "Add and manage own comments",
      ],
    },
    {
      role: CollaboratorRole.VIEWER,
      description: "Read-only access with commenting",
      permissions: [
        "View project content",
        "View pages and elements",
        "Add comments",
        "Edit own comments",
        "View team members",
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {roles.map(({ role, description, permissions }) => (
        <div
          key={role}
          className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <Badge
              variant={
                role === CollaboratorRole.OWNER
                  ? "default"
                  : role === CollaboratorRole.EDITOR
                  ? "secondary"
                  : "outline"
              }
              className="capitalize"
            >
              {role}
            </Badge>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{description}</p>
          <div className="space-y-1">
            {permissions.map((permission) => (
              <div key={permission} className="flex items-start gap-2 text-xs">
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{permission}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
