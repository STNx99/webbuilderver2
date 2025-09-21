import { Page } from "@/generated/prisma";
import { EditorElement } from "@/types/global.type";
import { Project } from "./project.interface";

// Service interfaces describing operations for communicating with backend APIs.
//
// These interfaces define the contract that concrete service implementations
// should follow. They focus on high-level operations (CRUD and list-style
// retrievals) and return Promises so callers can await results or handle
// errors appropriately.
//
// Note: Implementations should handle authentication, request/response parsing,
// error normalization, and any necessary retries or backoff logic.

/**
 * Element service interface.
 *
 * Provides methods to retrieve, create, update, and delete editor elements associated
 * with a Project. Element payloads use the `EditorElement` shape defined in
 * `@/types/global.type`.
 */
interface IElementService {
  /**
   * Retrieve all elements for a given project.
   *
   * @param projectId - The ID of the project whose elements should be returned.
   * @returns A Promise that resolves to an array of `EditorElement`.
   *          Implementations should reject the promise on network or server errors.
   */
  getElements: (projectId: string) => Promise<EditorElement[]>;

  /**
   * Retrieve publicly visible elements for a given project.
   *
   * This method is intended for unauthenticated/public access (e.g. rendering a
   * published page).
   *
   * @param projectId - The ID of the project whose public elements should be returned.
   * @returns A Promise that resolves to an array of `EditorElement`.
   */
  getElementsPublic: (projectId: string) => Promise<EditorElement[]>;

  /**
   * Create one or more elements for a project.
   *
   * The rest parameter enables callers to pass one or many elements:
   *   createElement(projectId, el1)
   *   createElement(projectId, el1, el2, el3)
   *
   * Implementations may perform batching or multiple requests depending on the API.
   *
   * @param projectId - The ID of the project to create elements in.
   * @param elements - One or more `EditorElement` objects to create.
   * @returns A Promise that resolves when creation is complete. The Promise
   *          should reject if the backend reports an error.
   */
  createElement: (
    projectId: string,
    ...elements: EditorElement[]
  ) => Promise<void>;

  /**
   * Update an existing element.
   *
   * Implementations should persist the provided element to the backend.
   * Optionally, a `settings` payload can be passed if the backend stores element
   * settings in a separate resource.
   *
   * @param element - The element to update. Must contain a valid `id`.
   * @param settings - Optional settings payload (string or null) to be stored
   *                   alongside the element.
   * @returns A Promise that resolves with the updated `EditorElement`.
   */
  updateElement: (
    element: EditorElement,
    settings?: string | null,
  ) => Promise<EditorElement>;

  /**
   * Delete an element by its ID.
   *
   * @param id - The ID of the element to delete.
   * @returns A Promise that resolves to a boolean indicating success. Implementations
   *          might resolve `true` on success and either throw or resolve `false`
   *          (depending on convention) on failure; callers should rely on rejections
   *          for exceptional conditions.
   */
  deleteElement: (id: string) => Promise<boolean>;
  
  insertElement: (projectId: string, targetId: string, elementToBeInserted : EditorElement) => Promise<void>;
}

/**
 * Project service interface.
 *
 * Operations for listing and managing projects, pages within projects, and
 * other project-scoped resources (e.g. fonts).
 */
interface IProjectService {
  /**
   * Get all projects visible to the current user (or system).
   *
   * @returns A Promise that resolves to an array of `Project`.
   */
  getProjects: () => Promise<Project[]>;

  /**
   * Get projects that belong specifically to the currently authenticated user.
   *
   * @returns A Promise that resolves to an array of `Project` for the user.
   */
  getUserProjects: () => Promise<Project[]>;

  /**
   * Get a project by its ID.
   *
   * @param id - The project ID to retrieve.
   * @returns A Promise that resolves to the requested `Project`.
   */
  getProjectById: (id: string) => Promise<Project>;
  

  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  /**
   * Delete a project by its ID.
   *
   * @param id - The ID of the project to delete.
   * @returns A Promise that resolves to `true` on success, or rejects on error.
   */
  deleteProject: (id: string) => Promise<boolean>;

  /**
   * Retrieve pages belonging to a specific project.
   *
   * @param id - The project ID whose pages should be returned.
   * @returns A Promise that resolves to an array of `Page` records.
   */
  getProjectPages: (id: string) => Promise<Page[]>;

  /**
   * Delete a page from a project.
   *
   * @param projectId - The ID of the project that owns the page.
   * @param pageId - The ID of the page to delete.
   * @returns A Promise that resolves to `true` on success.
   */
  deleteProjectPage: (projectId: string, pageId: string) => Promise<boolean>;

  /**
   * Retrieve available fonts for the application or project context.
   *
   * @returns A Promise that resolves to an array of font identifiers or names.
   */
  getFonts: () => Promise<string[]>;
}

export type { IElementService, IProjectService };
