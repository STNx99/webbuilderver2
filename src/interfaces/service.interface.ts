import { Page } from "@/generated/prisma";
import { EditorElement } from "@/types/global.type";
import { Project } from "./project.interface";

// interfaces for services
interface IElementService {
  getElements: (projectId: string) => Promise<EditorElement[]>;
  getElementsPublic: (projectId: string) => Promise<EditorElement[]>;
  createElement: (projectId: string, element: EditorElement) => Promise<void>;
}

interface IProjectService {
  getProjects: () => Promise<Project[]>;
  getUserProjects: () => Promise<Project[]>;
  getProjectById: (id: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectPages: (id: string) => Promise<Page[]>;
  deleteProjectPage: (projectId: string, pageId: string) => Promise<boolean>;
  getFonts: () => Promise<string[]>;
}

export type { IElementService, IProjectService };
