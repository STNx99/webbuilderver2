// Backend API endpoints (used with GetUrl)
export const API_ENDPOINTS = {
  ELEMENTS: {
    GET: (projectId: string) => `/api/v1/elements/${projectId}`,
    GET_PUBLIC: (projectId: string) => `/api/v1/elements/public/${projectId}`,
    CREATE: (projectId: string) => `/api/v1/elements/${projectId}`,
    UPDATE: (id: string) => `/api/v1/elements/${id}`,
    DELETE: (id: string) => `/api/v1/elements/${id}`,
    INSERT: (projectId: string, previousID: string) =>
      `/api/v1/elements/${projectId}/insert/${previousID}`,
    SWAP: (projectId: string) => `/api/v1/elements/${projectId}/swap`,
  },
  PROJECTS: {
    GET_PUBLIC: "/api/v1/projects/public",
    GET_USER: "/api/v1/projects/user",
    GET_BY_ID: (id: string) => `/api/v1/projects/${id}`,
    GET_PAGES: (id: string) => `/api/v1/projects/${id}/pages`,
    CREATE: "/api/v1/projects",
    UPDATE: (id: string) => `/api/v1/projects/${id}`,
    DELETE: (id: string) => `/api/v1/projects/${id}`,
    DELETE_PAGE: (projectId: string, pageId: string) =>
      `/api/v1/projects/${projectId}/pages/${pageId}`,
  },
  SNAPSHOTS: {
    SAVE: (projectId: string) => `/api/v1/snapshots/${projectId}/save`,
  },
};

export const NEXT_API_ENDPOINTS = {
  ELEMENTS: {
    UPDATE: (id: string) => `/api/elements/${id}`,
    DELETE: (id: string) => `/api/elements/${id}`,
  },
  PROJECTS: {
    DELETE: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE_PAGE: (projectId: string, pageId: string) =>
      `/api/projects/${projectId}/pages/${pageId}`,
  },
  TOKEN: {
    GET: "/api/gettoken",
  },
};
