"use client";

import { useState } from "react";
import {
  useInvitationManager,
  useCollaboratorManager,
} from "@/hooks";
import { CollaboratorRole } from "@/interfaces/collaboration.interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Mail,
  Trash2,
  Crown,
  Edit,
  Eye,
  Loader2,
  Clock,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CollaborationManagerProps {
  projectId: string;
  currentUserId: string;
  isOwner: boolean;
}

export default function CollaborationManager({
  projectId,
  currentUserId,
  isOwner,
}: CollaborationManagerProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>(
    CollaboratorRole.VIEWER
  );
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [deleteCollaboratorId, setDeleteCollaboratorId] = useState<
    string | null
  >(null);
  const [deleteInvitationId, setDeleteInvitationId] = useState<string | null>(
    null
  );

  const invitations = useInvitationManager(projectId);
  const collaborators = useCollaboratorManager(projectId);

  const handleInvite = async () => {
    if (!inviteEmail || !inviteRole) return;

    try {
      await invitations.createInvitationAsync({
        projectId,
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      setInviteRole(CollaboratorRole.VIEWER);
      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  const handleUpdateRole = async (collaboratorId: string, role: CollaboratorRole) => {
    try {
      await collaborators.updateCollaboratorRoleAsync(collaboratorId, { role });
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleRemoveCollaborator = async () => {
    if (!deleteCollaboratorId) return;

    try {
      await collaborators.removeCollaboratorAsync(deleteCollaboratorId);
      setDeleteCollaboratorId(null);
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
    }
  };

  const handleDeleteInvitation = async () => {
    if (!deleteInvitationId) return;

    try {
      await invitations.deleteInvitationAsync(deleteInvitationId);
      setDeleteInvitationId(null);
    } catch (error) {
      console.error("Failed to delete invitation:", error);
    }
  };

  const handleLeaveProject = async () => {
    try {
      await collaborators.leaveProjectAsync(projectId);
    } catch (error) {
      console.error("Failed to leave project:", error);
    }
  };

  const getRoleIcon = (role: CollaboratorRole) => {
    switch (role) {
      case CollaboratorRole.OWNER:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case CollaboratorRole.EDITOR:
        return <Edit className="h-4 w-4 text-blue-500" />;
      case CollaboratorRole.VIEWER:
        return <Eye className="h-4 w-4 text-gray-500" />;
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

  return (
    <div className="space-y-6">
      {/* Collaborators Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to this project
              </CardDescription>
            </div>
            {isOwner && (
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to collaborate on this project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={inviteRole}
                        onValueChange={(value) =>
                          setInviteRole(value as CollaboratorRole)
                        }
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CollaboratorRole.VIEWER}>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              <span>Viewer - Can view only</span>
                            </div>
                          </SelectItem>
                          <SelectItem value={CollaboratorRole.EDITOR}>
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              <span>Editor - Can view and edit</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsInviteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleInvite}
                      disabled={
                        !inviteEmail || !inviteRole || invitations.isCreating
                      }
                    >
                      {invitations.isCreating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {collaborators.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : collaborators.collaborators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No team members yet. Invite someone to collaborate!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collaborators.collaborators.map((collaborator) => {
                  const isCurrentUser = collaborator.userId === currentUserId;
                  const canModify = isOwner && collaborator.role !== CollaboratorRole.OWNER;

                  return (
                    <TableRow key={collaborator.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            {collaborator.user?.name?.charAt(0).toUpperCase() ||
                              collaborator.user?.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">
                              {collaborator.user?.name || "Unknown User"}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (You)
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {collaborator.user?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {canModify ? (
                          <Select
                            value={collaborator.role}
                            onValueChange={(value) =>
                              handleUpdateRole(
                                collaborator.id,
                                value as CollaboratorRole
                              )
                            }
                            disabled={collaborators.isUpdatingRole}
                          >
                            <SelectTrigger className="w-[140px]">
                              <div className="flex items-center gap-2">
                                {getRoleIcon(collaborator.role)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={CollaboratorRole.VIEWER}>
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>Viewer</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={CollaboratorRole.EDITOR}>
                                <div className="flex items-center gap-2">
                                  <Edit className="h-4 w-4" />
                                  <span>Editor</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant={getRoleBadgeVariant(collaborator.role)}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(collaborator.role)}
                              <span className="capitalize">{collaborator.role}</span>
                            </div>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(collaborator.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {isCurrentUser && collaborator.role !== CollaboratorRole.OWNER ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteCollaboratorId(collaborator.id)}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Leave
                          </Button>
                        ) : canModify ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteCollaboratorId(collaborator.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations Section */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Invitations sent but not yet accepted
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitations.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : invitations.invitations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending invitations
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.invitations.map((invitation) => {
                    const isExpired = new Date(invitation.expiresAt) < new Date();
                    const isAccepted = !!invitation.acceptedAt;

                    return (
                      <TableRow key={invitation.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{invitation.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(invitation.role)}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(invitation.role)}
                              <span className="capitalize">{invitation.role}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isAccepted ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Accepted
                            </Badge>
                          ) : isExpired ? (
                            <Badge variant="destructive">
                              <Clock className="mr-1 h-3 w-3" />
                              Expired
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(invitation.createdAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {!isAccepted && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteInvitationId(invitation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Collaborator Confirmation */}
      <AlertDialog
        open={!!deleteCollaboratorId}
        onOpenChange={(open) => !open && setDeleteCollaboratorId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {collaborators.collaborators.find(
                (c) => c.id === deleteCollaboratorId
              )?.userId === currentUserId
                ? "Leave Project"
                : "Remove Team Member"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {collaborators.collaborators.find(
                (c) => c.id === deleteCollaboratorId
              )?.userId === currentUserId
                ? "Are you sure you want to leave this project? You will lose access to all project resources."
                : "Are you sure you want to remove this team member? They will lose access to the project."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveCollaborator}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {collaborators.isRemoving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {collaborators.collaborators.find(
                (c) => c.id === deleteCollaboratorId
              )?.userId === currentUserId
                ? "Leave Project"
                : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Invitation Confirmation */}
      <AlertDialog
        open={!!deleteInvitationId}
        onOpenChange={(open) => !open && setDeleteInvitationId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke this invitation? The recipient will
              no longer be able to use the invitation link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvitation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {invitations.isDeleting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
