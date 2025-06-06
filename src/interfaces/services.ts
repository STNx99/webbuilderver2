import { Project } from "@/services/project";
import { EditorElement } from "@/types/global.type";

// interfaces for services
interface IElementService { 
    getElements: (projectId: string) => Promise<EditorElement[]>;
    getElementsPublic: (projectId: string) => Promise<EditorElement[]>;
}

interface IProjectService {
    getProjects: () => Promise<Project[]>;
    getUserProjects: () => Promise<Project[]>;
    getProjectById: (id: string) => Promise<Project>;
}

export type { IElementService, IProjectService };
