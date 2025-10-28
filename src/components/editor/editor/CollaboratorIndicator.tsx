"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, LogOut } from "lucide-react";
import { useProjectCollaborators, useLeaveProject } from "@/hooks";
import {
  CollaboratorRole,
  Collaborator,
} from "@/interfaces/collaboration.interface";
import { useAuth } from "@clerk/nextjs";
import { useProjectStore } from "@/globalstore/projectstore";
import {
  getRoleIcon,
  getRoleBadgeVariant,
} from "@/components/collaboration/utils";

// Helper functions for user display
const getFullName = (user: Collaborator["user"]) => {
  if (!user) return "Unknown User";
  const { firstName, lastName } = user;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return "Unknown User";
};

const getAvatarInitial = (user: Collaborator["user"]) => {
  if (!user) return "";
  const { firstName, lastName, email } = user;
  if (firstName) return firstName.charAt(0).toUpperCase();
  if (lastName) return lastName.charAt(0).toUpperCase();
  if (email) return email.charAt(0).toUpperCase();
  return "";
};

interface CollaboratorIndicatorProps {
  projectId: string;
}

interface CollaboratorItemProps {
  collaborator: Collaborator;
  isCurrentUser?: boolean;
  onLeaveProject?: () => void;
}

function CollaboratorItem({
  collaborator,
  isCurrentUser = false,
  onLeaveProject,
}: CollaboratorItemProps) {
  const displayName = isCurrentUser ? "You" : getFullName(collaborator.user);
  const showLeaveButton =
    isCurrentUser && collaborator.role !== CollaboratorRole.OWNER;

  return (
    <div
      className={`flex items-center justify-between p-2 ${isCurrentUser ? "rounded-lg bg-muted/50 mb-2" : ""}`}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">
            {getAvatarInitial(collaborator.user)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{displayName}</div>
          <div className="text-xs text-muted-foreground">
            {collaborator.user?.email}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={getRoleBadgeVariant(collaborator.role)}
          className="text-xs"
        >
          <div className="flex items-center gap-1">
            {getRoleIcon(collaborator.role)}
            <span className="capitalize">{collaborator.role}</span>
          </div>
        </Badge>
        {showLeaveButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLeaveProject}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function CollaboratorIndicator({
  projectId,
}: CollaboratorIndicatorProps) {
  const { userId } = useAuth();
  const { project } = useProjectStore();
  const { data: collaborators = [], isLoading } =
    useProjectCollaborators(projectId);
  const leaveProject = useLeaveProject();

  const isOwner = project?.ownerId === userId;
  const currentUserCollaborator = collaborators.find(
    (c) => c.userId === userId,
  );
  const otherCollaborators = collaborators.filter((c) => c.userId !== userId);

  const handleLeaveProject = async () => {
    if (
      window.confirm(
        "Are you sure you want to leave this project? You will lose access to it.",
      )
    ) {
      try {
        await leaveProject.mutateAsync(projectId);
      } catch (error) {
        console.error("Failed to leave project:", error);
      }
    }
  };

  // Don't show indicator while loading
  if (isLoading) return null;

  // Don't show anything if not owner and no collaborators
  if (!isOwner && collaborators.length === 0) return null;

  const collaboratorCount = collaborators.length;
  const hasCollaborators = collaboratorCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">
            {hasCollaborators
              ? `${collaboratorCount} collaborator${collaboratorCount !== 1 ? "s" : ""}`
              : "Collaboration"}
          </span>
          {currentUserCollaborator && (
            <Badge
              variant={getRoleBadgeVariant(currentUserCollaborator.role)}
              className="ml-1 text-xs"
            >
              {currentUserCollaborator.role}
            </Badge>
          )}
          {isOwner && !hasCollaborators && (
            <Badge variant="outline" className="ml-1 text-xs">
              Owner
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-3">
              {hasCollaborators ? "Project Team" : "Collaboration Available"}
            </h4>
            {!hasCollaborators && isOwner && (
              <p className="text-xs text-muted-foreground mb-3">
                Invite team members to collaborate on this project.
              </p>
            )}

            {currentUserCollaborator && (
              <CollaboratorItem
                collaborator={currentUserCollaborator}
                isCurrentUser
                onLeaveProject={handleLeaveProject}
              />
            )}

            {otherCollaborators.map((collaborator) => (
              <CollaboratorItem
                key={collaborator.id}
                collaborator={collaborator}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
