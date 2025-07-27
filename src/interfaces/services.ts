import { EditorElement } from "@/types/global.type";
import { Project } from "./project";

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
    getFonts: () => Promise<string[]>;
}

export type { IElementService, IProjectService };
