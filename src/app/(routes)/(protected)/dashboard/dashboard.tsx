"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectListItem } from "@/components/dashboard/ProjectListItem";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DeleteProjectDialog } from "@/components/dashboard/DeleteProjectDialog";
import { PublishProjectDialog } from "@/components/dashboard/PublishProjectDialog";
import CreateProjectDialog from "@/components/dashboard/CreateProjectDialog";
import { useUserProjects, useDeleteProject, usePublishProject } from "@/hooks";
import type {
  SortOption,
  ViewMode,
} from "@/components/dashboard/DashboardFilters";

export default function Dashboard() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    name?: string;
  } | null>(null);
  const [projectToPublish, setProjectToPublish] = useState<{
    id: string;
    name?: string;
    published: boolean;
  } | null>(null);

  // Hooks
  const { data: projects, isLoading } = useUserProjects();
  const deleteProjectMutation = useDeleteProject();
  const publishProjectMutation = usePublishProject();

  // Filter and sort projects
  const filteredAndSortedProjects = (projects ?? [])
    .filter((project) => {
      const matchesSearch =
        (project.name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (project.description ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesPublished = !showPublishedOnly || !!project.published;
      return matchesSearch && matchesPublished;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "views":
          aValue = ((a as any).views ?? 0) as number;
          bValue = ((b as any).views ?? 0) as number;
          break;
        case "name":
          aValue = (a.name ?? "").toLowerCase();
          bValue = (b.name ?? "").toLowerCase();
          break;
        case "created":
          aValue = a.createdAt ? new Date(String(a.createdAt)).getTime() : 0;
          bValue = b.createdAt ? new Date(String(b.createdAt)).getTime() : 0;
          break;
        case "modified":
          aValue = a.updatedAt ? new Date(String(a.updatedAt)).getTime() : 0;
          bValue = b.updatedAt ? new Date(String(b.updatedAt)).getTime() : 0;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Handlers
  const handleDeleteProject = (projectId: string) => {
    const project = projects?.find((p) => p.id === projectId);
    setProjectToDelete({
      id: projectId,
      name: project?.name,
    });
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const handlePublishProject = (
    projectId: string,
    currentlyPublished: boolean,
  ) => {
    const project = projects?.find((p) => p.id === projectId);
    setProjectToPublish({
      id: projectId,
      name: project?.name,
      published: currentlyPublished,
    });
  };

  const handleConfirmPublish = () => {
    if (projectToPublish) {
      publishProjectMutation.mutate({
        projectId: projectToPublish.id,
        publish: !projectToPublish.published,
      });
      setProjectToPublish(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with Sidebar Trigger and Breadcrumbs */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your project performance
            </p>
          </div>

          {/* Create Project Dialog */}
          <CreateProjectDialog
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
          />
        </div>

        {/* Filters and Controls */}
        <DashboardFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={() =>
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          }
          showPublishedOnly={showPublishedOnly}
          onPublishedFilterToggle={() =>
            setShowPublishedOnly(!showPublishedOnly)
          }
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Projects Display */}
        {filteredAndSortedProjects.length === 0 ? (
          <EmptyState
            hasSearchQuery={!!searchQuery || showPublishedOnly}
            onCreateProject={() => setIsCreateDialogOpen(true)}
          />
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredAndSortedProjects.map((project) =>
              viewMode === "grid" ? (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                  onPublish={handlePublishProject}
                />
              ) : (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                  onPublish={handlePublishProject}
                />
              ),
            )}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteProjectDialog
          open={!!projectToDelete}
          onOpenChange={(open) => !open && setProjectToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteProjectMutation.isPending}
          projectName={projectToDelete?.name}
        />

        {/* Publish/Unpublish Confirmation Dialog */}
        <PublishProjectDialog
          open={!!projectToPublish}
          onOpenChange={(open) => !open && setProjectToPublish(null)}
          onConfirm={handleConfirmPublish}
          isPublishing={publishProjectMutation.isPending}
          projectName={projectToPublish?.name}
          currentlyPublished={!!projectToPublish?.published}
        />
      </div>
    </>
  );
}
