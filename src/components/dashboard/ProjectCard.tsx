"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Calendar,
  BarChart3,
  Trash2,
  Edit,
  Settings,
  Globe,
  EyeOff,
  Upload,
} from "lucide-react";
import type { Project } from "@/interfaces/project.interface";
import { useRouter } from "next/navigation";
import { CreateMarketplaceItemDialog } from "../marketplace/CreateMarketplaceItemDialog";
import { marketplaceService } from "@/services/marketplace";
import { useDeleteMarketplaceItem } from "@/hooks";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
  onPublish: (projectId: string, currentlyPublished: boolean) => void;
}

export function ProjectCard({
  project,
  onDelete,
  onPublish,
}: ProjectCardProps) {
  const router = useRouter();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: marketplaceItems, isLoading: isMarketplaceLoading } = useQuery({
    queryKey: ["marketplaceItems"],
    queryFn: () => marketplaceService.getMarketplaceItems({}),
  });

  const [marketplaceItemId, setMarketplaceItemId] = useState<
    string | undefined
  >();
  const deleteItem = useDeleteMarketplaceItem();

  useEffect(() => {
    if (marketplaceItems) {
      const item = marketplaceItems.find((i) => i.projectId === project.id);
      setMarketplaceItemId(item?.id);
    }
  }, [marketplaceItems, project.id]);

  const handleCardClick = () => {
    router.push(`/analytics/${project.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/editor/${project.id}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer p-0">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            width={400}
            height={200}
            src={"/placeholder.svg"}
            alt={project.name ?? "Project thumbnail"}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            onClick={handleCardClick}
            unoptimized
          />
          <div className="absolute top-2 right-2">
            <Badge variant={project.published ? "default" : "secondary"}>
              {project.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-semibold text-lg truncate pr-2 cursor-pointer hover:text-primary"
            onClick={handleCardClick}
          >
            {project.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/analytics/${project.id}`);
                }}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/projectsettings/${project.id}`);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Project Settings
              </DropdownMenuItem>
              {marketplaceItemId ? (
                <DropdownMenuItem
                  className="text-destructive"
                  disabled={deleteItem.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete from Marketplace
                </DropdownMenuItem>
              ) : project.published ? (
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowUploadDialog(true);
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload to Marketplace
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onPublish(project.id ?? "", !!project.published);
                }}
              >
                {project.published ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id ?? "");
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {project.description || "No description provided"}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Eye className="mr-1 h-4 w-4" />
            {(((project as any).views ?? 0) as number).toLocaleString()} views
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {project.updatedAt
              ? new Date(String(project.updatedAt)).toLocaleDateString()
              : "—"}
          </div>
        </div>
      </CardContent>
      <CreateMarketplaceItemDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        defaultProjectId={project.id}
        itemId={marketplaceItemId}
      />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete from Marketplace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item from the marketplace?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteItem.isPending}
              onClick={async () => {
                try {
                  await deleteItem.mutateAsync(marketplaceItemId!);
                  setShowDeleteDialog(false);
                } catch (error) {
                  console.error("Failed to delete marketplace item:", error);
                }
              }}
            >
              {deleteItem.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
