"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAcceptInvitation, useDeleteInvitation } from "@/hooks";
import { Invitation } from "@/interfaces/collaboration.interface";

interface InvitationNotificationProps {
  invitations: Invitation[];
  compact?: boolean;
}

export default function InvitationNotification({
  invitations,
  compact = false,
}: InvitationNotificationProps) {
  const [expanded, setExpanded] = useState(false);
  const acceptInvitation = useAcceptInvitation();
  const deleteInvitation = useDeleteInvitation();

  const pendingInvitations = invitations.filter((inv) => !inv.acceptedAt);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return "👑";
      case "editor":
        return "✏️";
      case "viewer":
        return "👁️";
      default:
        return "❓";
    }
  };

  const handleAccept = async (token: string) => {
    try {
      await acceptInvitation.mutateAsync({ token });
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const handleDecline = async (invitationId: string) => {
    try {
      await deleteInvitation.mutateAsync(invitationId);
    } catch (error) {
      console.error("Failed to decline invitation:", error);
    }
  };

  if (pendingInvitations.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">
                  {pendingInvitations.length} pending invitation
                  {pendingInvitations.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  You have been invited to collaborate
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Hide" : "View"}
            </Button>
          </div>

          {expanded && (
            <div className="mt-4 space-y-3">
              {pendingInvitations.slice(0, 3).map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {getRoleIcon(invitation.role)}
                      </span>
                      <span className="font-medium text-sm capitalize">
                        {invitation.role}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Invited by project owner
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAccept(invitation.token)}
                      disabled={acceptInvitation.isPending}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDecline(invitation.id)}
                      disabled={deleteInvitation.isPending}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
              {pendingInvitations.length > 3 && (
                <p className="text-xs text-center text-muted-foreground">
                  And {pendingInvitations.length - 3} more...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Collaboration Invitations
        </CardTitle>
        <CardDescription>
          You have {pendingInvitations.length} pending invitation
          {pendingInvitations.length !== 1 ? "s" : ""} to join projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingInvitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getRoleIcon(invitation.role)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium capitalize">
                      {invitation.role}
                    </span>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Invited recently
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have been invited to collaborate on a project
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={() => handleAccept(invitation.token)}
                  disabled={acceptInvitation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDecline(invitation.id)}
                  disabled={deleteInvitation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
