"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { usePageStore } from "@/globalstore/pagestore";
import { useProjectStore } from "@/globalstore/projectstore";
import { projectService } from "@/services/project";
import { elementService } from "@/services/element";
import { elementHelper } from "@/utils/element/elementhelper";
import { customComps } from "@/lib/customcomponents/customComponents";
import { EditorElement, ElementType } from "@/types/global.type";
import { SectionElement } from "@/interfaces/elements.interface";
import type { Project } from "@/interfaces/project.interface";

export type Viewport = "mobile" | "tablet" | "desktop";

export const useEditor = (id: string, pageId: string) => {
  const [currentView, setCurrentView] = useState<Viewport>("desktop");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const router = useRouter();

  const { addElement, loadElements } = useElementStore();
  const { selectedElement } = useSelectionStore();
  const { pages, loadPages, setCurrentPage } = usePageStore();
  const { loadProject } = useProjectStore();

  const { data: projectPages, isLoading: isLoadingPages } = useQuery({
    queryKey: ["pages", id],
    queryFn: () => projectService.getProjectPages(id),
  });

  const { data: fetchedElements, isLoading: isLoadingElements } = useQuery<
    EditorElement[]
  >({
    queryKey: ["elements", id],
    queryFn: () => elementService.getElements(id),
  });

  const { data: project, isLoading: isLoadingProject } =
    useQuery<Project | null>({
      queryKey: ["project", id],
      queryFn: () => projectService.getProjectById(id),
      enabled: Boolean(id),
    });

  useEffect(() => {
    if (projectPages && projectPages.length > 0) {
      loadPages(projectPages);
    }
  }, [projectPages, loadPages]);

  useEffect(() => {
    if (fetchedElements && fetchedElements.length > 0) {
      loadElements(fetchedElements);
    }
  }, [fetchedElements, loadElements]);

  useEffect(() => {
    if (project) {
      if (!project || project.deletedAt) {
        router.push("/dashboard");
        return;
      }
      loadProject(project as Project);
    }
  }, [project, loadProject]);

  const filteredElements = elementHelper.filterElementByPageId(pageId);

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

  const isLoading = isLoadingElements || isLoadingPages || isLoadingProject;

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
  };
};
