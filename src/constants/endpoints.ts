// Backend API endpoints (used with GetUrl)
export const API_ENDPOINTS = {
  ELEMENTS: {
    GET: (projectId: string) => `/elements/${projectId}`,
    GET_PUBLIC: (projectId: string) => `/elements/public/${projectId}`,
    CREATE: (projectId: string) => `/elements/${projectId}`,
    INSERT: (projectId: string, previousID: string) => `/elements/${projectId}/insert/${previousID}`,
  },
  PROJECTS: {
    GET_PUBLIC: "/projects/public",
    GET_USER: "/projects/user",
    GET_BY_ID: (id: string) => `/projects/${id}`,
    GET_PAGES: (id: string) => `/projects/${id}/pages`,
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
