"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, UserPlus } from "lucide-react";
import { CollaborationManager } from "@/components/collaboration";
import { useAuth } from "@clerk/nextjs";
import { useProjectStore } from "@/globalstore/projectstore";

interface CollaborationButtonProps {
  projectId: string;
}

export default function CollaborationButton({ projectId }: CollaborationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { userId } = useAuth();
  const { project } = useProjectStore();

  // Only show collaboration button if user is the project owner
  const isOwner = project?.ownerId === userId;

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Collaborators</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Project Collaboration
          </DialogTitle>
        </DialogHeader>
        <CollaborationManager
          projectId={projectId}
          currentUserId={userId || ""}
          isOwner={isOwner}
        />
      </DialogContent>
    </Dialog>
  );
}
