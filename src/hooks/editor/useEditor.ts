"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { usePageStore } from "@/globalstore/pagestore";
import { useProjectStore } from "@/globalstore/projectstore";
import { projectService } from "@/services/project";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { customComps } from "@/lib/customcomponents/customComponents";
import { EditorElement, ElementType } from "@/types/global.type";
import { SectionElement } from "@/interfaces/elements.interface";
import type { Project } from "@/interfaces/project.interface";
import { useCollab } from "@/hooks/realtime/use-collab";
import { toast } from "sonner";

export type Viewport = "mobile" | "tablet" | "desktop";

export interface UseEditorOptions {
  enableCollab?: boolean;
  collabWsUrl?: string;
  userId?: string;
}

export const useEditor = (
  id: string,
  pageId: string,
  options?: UseEditorOptions,
) => {
  const [currentView, setCurrentView] = useState<Viewport>("desktop");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const router = useRouter();

  const { addElement, elements } = useElementStore();
  const { selectedElement } = useSelectionStore();
  const { pages, loadPages, setCurrentPage } = usePageStore();
  const { loadProject } = useProjectStore();

  const { data: projectPages, isLoading: isLoadingPages } = useQuery({
    queryKey: ["pages", id],
    queryFn: async () => projectService.getProjectPages(id),
  });

  const { data: project, isLoading: isLoadingProject } =
    useQuery<Project | null>({
      queryKey: ["project", id],
      queryFn: async () => projectService.getProjectById(id),
      enabled: Boolean(id),
    });

  const collab = useCollab({
    roomId: id,
    wsUrl:
      options?.collabWsUrl ||
      process.env.NEXT_PUBLIC_COLLAB_WS_URL ||
      "ws://localhost:8082",
    enabled: options?.enableCollab !== false,
    onSync: () => {
      toast.success("Live collaboration connected", {
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("[useEditor] Collaboration error:", error);
      toast.info("Working in offline mode", {
        description:
          "Collaboration server unavailable. Changes will be saved locally.",
        duration: 5000,
      });
    },
  });

  useEffect(() => {
    if (projectPages && projectPages.length > 0) {
      loadPages(projectPages);
    }
  }, [projectPages, loadPages]);

  useEffect(() => {
    if (project) {
      if (!project || project.deletedAt) {
        router.push("/dashboard");
        return;
      }
      loadProject(project as Project);
    }
  }, [project, loadProject]);

  const filteredElements = elementHelper.filterElementByPageId(
    elements,
    pageId,
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const elementType = e.dataTransfer.getData("elementType");
    const customElement = e.dataTransfer.getData("customComponentName");

    let newElement: EditorElement | undefined;

    if (elementType) {
      newElement = elementHelper.createElement.create(
        elementType as ElementType,
        id,
        "",
        pageId,
      );
    } else if (customElement) {
      const customComp = customComps[parseInt(customElement)];
      if (customComp) {
        newElement = elementHelper.createElement.createFromTemplate(
          customComp,
          id,
          pageId,
        );
      }
    }

    if (!newElement) return;
    addElement(newElement);
  };

  const handlePageNavigation = (e: React.FocusEvent<HTMLInputElement>) => {
    const pageName = e.currentTarget.value.slice(1);
    const page = pages.find((p) => p.Name === pageName);

    new Promise(() => setCurrentPage(page || null));
    if (page) {
      router.push(`/editor/${id}?page=${page.Id}`);
    } else {
      router.push(`/editor/${id}`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const addNewSection = () => {
    const newElement = elementHelper.createElement.create<SectionElement>(
      "Section",
      id,
      "",
      pageId,
    );
    if (newElement) addElement(newElement);
  };

  const isLoading = isLoadingPages || isLoadingProject;

  return {
    currentView,
    setCurrentView,
    isDraggingOver,
    isLoading,
    filteredElements,
    selectedElement,
    handleDrop,
    handlePageNavigation,
    handleDragOver,
    handleDragLeave,
    addNewSection,
    collab: {
      isConnected: collab.isConnected,
      connectionState: collab.connectionState,
      isSynced: collab.isSynced,
      error: collab.error,
      connect: collab.connect,
      disconnect: collab.disconnect,
      sendMessage: collab.sendMessage,
    },
  };
};
