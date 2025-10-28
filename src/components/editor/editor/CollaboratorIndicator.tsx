"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Crown, Eye, Edit, LogOut } from "lucide-react";
import { useProjectCollaborators } from "@/hooks";
import { CollaboratorRole } from "@/interfaces/collaboration.interface";
import { useAuth } from "@clerk/nextjs";
import { useLeaveProject } from "@/hooks";

interface CollaboratorIndicatorProps {
  projectId: string;
}

export default function CollaboratorIndicator({
  projectId,
}: CollaboratorIndicatorProps) {
  const { userId } = useAuth();
  const { data: collaborators = [], isLoading } =
    useProjectCollaborators(projectId);
  const leaveProject = useLeaveProject();

  const currentUserCollaborator = collaborators.find(
    (c) => c.userId === userId,
  );
  const otherCollaborators = collaborators.filter((c) => c.userId !== userId);

  const getRoleIcon = (role: CollaboratorRole) => {
    switch (role) {
      case CollaboratorRole.OWNER:
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case CollaboratorRole.EDITOR:
        return <Edit className="h-3 w-3 text-blue-500" />;
      case CollaboratorRole.VIEWER:
        return <Eye className="h-3 w-3 text-gray-500" />;
      default:
        return null;
    }
  };

  const getRoleBadgeVariant = (role: CollaboratorRole) => {
    switch (role) {
      case CollaboratorRole.OWNER:
        return "default";
      case CollaboratorRole.EDITOR:
        return "secondary";
      case CollaboratorRole.VIEWER:
        return "outline";
      default:
        return "outline";
    }
  };

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

  if (isLoading || collaborators.length === 0) {
    return null;
  }

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
            {collaborators.length} collaborator
            {collaborators.length !== 1 ? "s" : ""}
          </span>
          {currentUserCollaborator && (
            <Badge
              variant={getRoleBadgeVariant(currentUserCollaborator.role)}
              className="ml-1 text-xs"
            >
              {currentUserCollaborator.role}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-3">Project Team</h4>

            {/* Current user */}
            {currentUserCollaborator && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {currentUserCollaborator.user?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        currentUserCollaborator.user?.email
                          ?.charAt(0)
                          ?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">You</div>
                    <div className="text-xs text-muted-foreground">
                      {currentUserCollaborator.user?.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getRoleBadgeVariant(currentUserCollaborator.role)}
                    className="text-xs"
                  >
                    <div className="flex items-center gap-1">
                      {getRoleIcon(currentUserCollaborator.role)}
                      <span className="capitalize">
                        {currentUserCollaborator.role}
                      </span>
                    </div>
                  </Badge>
                  {currentUserCollaborator.role !== CollaboratorRole.OWNER && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLeaveProject}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <LogOut className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Other collaborators */}
            {otherCollaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {collaborator.user?.name?.charAt(0)?.toUpperCase() ||
                        collaborator.user?.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">
                      {collaborator.user?.name || "Unknown User"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {collaborator.user?.email}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={getRoleBadgeVariant(collaborator.role)}
                  className="text-xs"
                >
                  <div className="flex items-center gap-1">
                    {getRoleIcon(collaborator.role)}
                    <span className="capitalize">{collaborator.role}</span>
                  </div>
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
