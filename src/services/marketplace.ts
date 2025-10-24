import GetUrl from "@/lib/utils/geturl";
import {
  MarketplaceItem,
  CreateMarketplaceItemRequest,
  UpdateMarketplaceItemRequest,
  MarketplaceItemWithRelations,
  MarketplaceFilters,
  Category,
  Tag,
} from "@/interfaces/market.interface";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface IMarketplaceService {
  // Marketplace Items
  createMarketplaceItem: (
    data: CreateMarketplaceItemRequest,
  ) => Promise<MarketplaceItem>;
  getMarketplaceItems: (
    filters?: MarketplaceFilters,
  ) => Promise<MarketplaceItemWithRelations[]>;
  getMarketplaceItemByID: (id: string) => Promise<MarketplaceItemWithRelations>;
  updateMarketplaceItem: (
    id: string,
    data: UpdateMarketplaceItemRequest,
  ) => Promise<MarketplaceItem>;
  deleteMarketplaceItem: (id: string) => Promise<boolean>;
  downloadMarketplaceItem: (id: string) => Promise<any>;
  incrementDownloads: (id: string) => Promise<boolean>;
  incrementLikes: (id: string) => Promise<boolean>;

  // Categories
  createCategory: (name: string) => Promise<Category>;
  getCategories: () => Promise<Category[]>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Tags
  createTag: (name: string) => Promise<Tag>;
  getTags: () => Promise<Tag[]>;
  deleteTag: (id: string) => Promise<boolean>;
}

export const marketplaceService: IMarketplaceService = {
  createMarketplaceItem: async (
    data: CreateMarketplaceItemRequest,
  ): Promise<MarketplaceItem> => {
    return apiClient.post<MarketplaceItem>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.CREATE),
      data,
    );
  },

  getMarketplaceItems: async (
    filters?: MarketplaceFilters,
  ): Promise<MarketplaceItemWithRelations[]> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.templateType)
        queryParams.append("templateType", filters.templateType);
      if (filters.featured !== undefined)
        queryParams.append("featured", String(filters.featured));
      if (filters.categoryId)
        queryParams.append("categoryId", filters.categoryId);
      if (filters.tags && filters.tags.length > 0)
        queryParams.append("tags", filters.tags.join(","));
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.authorId) queryParams.append("authorId", filters.authorId);
    }

    const url = queryParams.toString()
      ? `${GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.GET_ALL)}?${queryParams.toString()}`
      : GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.GET_ALL);

    const response = await apiClient.get<any>(url);

    // Handle potential response wrapping
    // Backend might return { data: [...] } or just [...]
    if (response && typeof response === "object") {
      if (Array.isArray(response)) {
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.items && Array.isArray(response.items)) {
        return response.items;
      }
    }

    // Fallback to empty array if structure is unexpected
    console.warn("Unexpected marketplace items response structure:", response);
    return [];
  },

  getMarketplaceItemByID: async (
    id: string,
  ): Promise<MarketplaceItemWithRelations> => {
    return apiClient.get<MarketplaceItemWithRelations>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.GET_BY_ID(id)),
    );
  },

  updateMarketplaceItem: async (
    id: string,
    data: UpdateMarketplaceItemRequest,
  ): Promise<MarketplaceItem> => {
    return apiClient.patch<MarketplaceItem>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.UPDATE(id)),
      data,
    );
  },

  deleteMarketplaceItem: async (id: string): Promise<boolean> => {
    return apiClient.delete(GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.DELETE(id)));
  },

  incrementDownloads: async (id: string): Promise<boolean> => {
    return apiClient.post<boolean>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.INCREMENT_DOWNLOADS(id)),
      {},
    );
  },

  incrementLikes: async (id: string): Promise<boolean> => {
    return apiClient.post<boolean>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.INCREMENT_LIKES(id)),
      {},
    );
  },


  createCategory: async (name: string): Promise<Category> => {
    return apiClient.post<Category>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.CATEGORIES.CREATE),
      { name },
    );
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<any>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.CATEGORIES.GET_ALL),
    );

    if (response && typeof response === "object") {
      if (Array.isArray(response)) {
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.categories && Array.isArray(response.categories)) {
        return response.categories;
      }
    }

    return [];
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.MARKETPLACE.CATEGORIES.DELETE(id)),
    );
  },

  createTag: async (name: string): Promise<Tag> => {
    return apiClient.post<Tag>(GetUrl(API_ENDPOINTS.MARKETPLACE.TAGS.CREATE), {
      name,
    });
  },

  getTags: async (): Promise<Tag[]> => {
    const response = await apiClient.get<any>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.TAGS.GET_ALL),
    );

    if (response && typeof response === "object") {
      if (Array.isArray(response)) {
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.tags && Array.isArray(response.tags)) {
        return response.tags;
      }
    }

    return [];
  },

  deleteTag: async (id: string): Promise<boolean> => {
    return apiClient.delete(GetUrl(API_ENDPOINTS.MARKETPLACE.TAGS.DELETE(id)));
  },

  downloadMarketplaceItem: async (marketplaceItemId: string) => {
    return apiClient.post(
      GetUrl(API_ENDPOINTS.MARKETPLACE.ITEMS.DOWNLOAD(marketplaceItemId)),
      {},
    );
  },
};
