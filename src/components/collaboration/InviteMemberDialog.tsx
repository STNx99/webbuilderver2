"use client";

import { useState } from "react";
import { CollaboratorRole } from "@/interfaces/collaboration.interface";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Eye, Edit, Loader2 } from "lucide-react";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: CollaboratorRole) => Promise<void>;
  isCreating: boolean;
}

export default function InviteMemberDialog({
  isOpen,
  onOpenChange,
  onInvite,
  isCreating,
}: InviteMemberDialogProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>(
    CollaboratorRole.VIEWER,
  );

  const handleInvite = async () => {
    if (!inviteEmail || !inviteRole) return;

    try {
      await onInvite(inviteEmail, inviteRole);
      setInviteEmail("");
      setInviteRole(CollaboratorRole.VIEWER);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={!inviteEmail || !inviteRole || isCreating}
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
