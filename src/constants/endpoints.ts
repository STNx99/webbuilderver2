// Backend API endpoints (used with GetUrl)
export const API_ENDPOINTS = {
  ELEMENTS: {
    GET: (projectId: string) => `/api/v1/elements/${projectId}`,
    GET_PUBLIC: (projectId: string) => `/api/v1/elements/public/${projectId}`,
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
    GET_PUBLIC_BY_ID: (id: string) => `/api/v1/projects/public/${id}`,
  },
  SNAPSHOTS: {
    SAVE: (projectId: string) => `/api/v1/snapshots/${projectId}/save`,
    GET: (projectId: string) => `/api/v1/snapshots/${projectId}`,
    LOAD: (projectId: string, snapshotId: string) =>
      `/api/v1/snapshots/${projectId}/${snapshotId}`,
  },
  CMS: {
    CONTENT_TYPES: {
      GET: "/api/v1/content-types",
      CREATE: "/api/v1/content-types",
      GET_BY_ID: (id: string) => `/api/v1/content-types/${id}`,
      UPDATE: (id: string) => `/api/v1/content-types/${id}`,
      DELETE: (id: string) => `/api/v1/content-types/${id}`,
    },
    CONTENT_FIELDS: {
      GET_BY_CONTENT_TYPE: (contentTypeId: string) =>
        `/api/v1/content-types/${contentTypeId}/fields`,
      CREATE: (contentTypeId: string) =>
        `/api/v1/content-types/${contentTypeId}/fields`,
      GET_BY_ID: (contentTypeId: string, fieldId: string) =>
        `/api/v1/content-types/${contentTypeId}/fields/${fieldId}`,
      UPDATE: (contentTypeId: string, fieldId: string) =>
        `/api/v1/content-types/${contentTypeId}/fields/${fieldId}`,
      DELETE: (contentTypeId: string, fieldId: string) =>
        `/api/v1/content-types/${contentTypeId}/fields/${fieldId}`,
    },
    CONTENT_ITEMS: {
      GET_BY_CONTENT_TYPE: (contentTypeId: string) =>
        `/api/v1/content-types/${contentTypeId}/items`,
      CREATE: (contentTypeId: string) =>
        `/api/v1/content-types/${contentTypeId}/items`,
      GET_BY_ID: (contentTypeId: string, itemId: string) =>
        `/api/v1/content-types/${contentTypeId}/items/${itemId}`,
      UPDATE: (contentTypeId: string, itemId: string) =>
        `/api/v1/content-types/${contentTypeId}/items/${itemId}`,
      DELETE: (contentTypeId: string, itemId: string) =>
        `/api/v1/content-types/${contentTypeId}/items/${itemId}`,
    },
    PUBLIC_CONTENT: {
      GET: "/api/v1/public/content",
      GET_ITEM: (contentTypeId: string, slug: string) =>
        `/api/v1/public/content/${contentTypeId}/${slug}`,
    },
  },
  IMAGES: {
    UPLOAD: "/api/v1/images",
    UPLOAD_BASE64: "/api/v1/images/base64",
    GET_USER: "/api/v1/images",
    GET_BY_ID: (id: string) => `/api/v1/images/${id}`,
    UPDATE: (id: string) => `/api/v1/images/${id}`,
    DELETE: (id: string) => `/api/v1/images/${id}`,
  },
  MARKETPLACE: {
    ITEMS: {
      CREATE: "/api/v1/marketplace/items",
      GET_ALL: "/api/v1/marketplace/items",
      GET_BY_ID: (id: string) => `/api/v1/marketplace/items/${id}`,
      UPDATE: (id: string) => `/api/v1/marketplace/items/${id}`,
      DELETE: (id: string) => `/api/v1/marketplace/items/${id}`,
      DOWNLOAD: (id: string) => `/api/v1/marketplace/items/${id}/download`,
      INCREMENT_DOWNLOADS: (id: string) =>
        `/api/v1/marketplace/items/${id}/increment-download`,
      INCREMENT_LIKES: (id: string) => `/api/v1/marketplace/items/${id}/like`,
    },
    CATEGORIES: {
      CREATE: "/api/v1/marketplace/categories",
      GET_ALL: "/api/v1/marketplace/categories",
      DELETE: (id: string) => `/api/v1/marketplace/categories/${id}`,
    },
    TAGS: {
      CREATE: "/api/v1/marketplace/tags",
      GET_ALL: "/api/v1/marketplace/tags",
      DELETE: (id: string) => `/api/v1/marketplace/tags/${id}`,
    },
  },
  INVITATIONS: {
    CREATE: "/api/v1/invitations",
    GET_BY_PROJECT: (projectId: string) =>
      `/api/v1/invitations/project/${projectId}`,
    ACCEPT: "/api/v1/invitations/accept",
    DELETE: (id: string) => `/api/v1/invitations/${id}`,
  },
  COLLABORATORS: {
    GET_BY_PROJECT: (projectId: string) =>
      `/api/v1/collaborators/project/${projectId}`,
    UPDATE_ROLE: (id: string) => `/api/v1/collaborators/${id}/role`,
    REMOVE: (id: string) => `/api/v1/collaborators/${id}`,
    REMOVE_SELF: (projectId: string) =>
      `/api/v1/collaborators/project/${projectId}/leave`,
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
