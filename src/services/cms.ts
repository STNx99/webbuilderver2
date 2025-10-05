import GetUrl from "@/lib/utils/geturl";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  ContentType,
  ContentField,
  ContentFieldValue,
  ContentItem,
} from "../interfaces/cms.interface";

interface ICmsService<TContext = any> {
  getContentTypes(): Promise<ContentType[]>;
  createContentType(data: Partial<ContentType>): Promise<ContentType>;
  getContentTypeById(id: string): Promise<ContentType>;
  updateContentType(
    id: string,
    data: Partial<ContentType>,
  ): Promise<ContentType>;
  deleteContentType(id: string): Promise<boolean>;
  getContentFieldsByContentType(contentTypeId: string): Promise<ContentField[]>;
  createContentField(
    contentTypeId: string,
    data: Partial<ContentField>,
  ): Promise<ContentField>;
  getContentFieldById(
    contentTypeId: string,
    fieldId: string,
  ): Promise<ContentField>;
  updateContentField(
    contentTypeId: string,
    fieldId: string,
    data: Partial<ContentField>,
  ): Promise<ContentField>;
  deleteContentField(contentTypeId: string, fieldId: string): Promise<boolean>;
  getContentItemsByContentType(contentTypeId: string): Promise<ContentItem[]>;
  createContentItem(
    contentTypeId: string,
    data: Partial<ContentItem>,
  ): Promise<ContentItem>;
  getContentItemById(
    contentTypeId: string,
    itemId: string,
  ): Promise<ContentItem>;
  updateContentItem(
    contentTypeId: string,
    itemId: string,
    data: Partial<ContentItem>,
  ): Promise<ContentItem>;
  deleteContentItem(contentTypeId: string, itemId: string): Promise<boolean>;
  getPublicContent(params?: {
    contentTypeId?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ContentItem[]>;
  getPublicContentItem(
    contentTypeId: string,
    slug: string,
  ): Promise<ContentItem>;
}

export const cmsService: ICmsService = {
  getContentTypes: async (): Promise<ContentType[]> => {
    return apiClient.get(GetUrl(API_ENDPOINTS.CMS.CONTENT_TYPES.GET));
  },

  createContentType: async (
    data: Partial<ContentType>,
  ): Promise<ContentType> => {
    return apiClient.post(GetUrl(API_ENDPOINTS.CMS.CONTENT_TYPES.CREATE), data);
  },

  getContentTypeById: async (id: string): Promise<ContentType> => {
    return apiClient.get(GetUrl(API_ENDPOINTS.CMS.CONTENT_TYPES.GET_BY_ID(id)));
  },

  updateContentType: async (
    id: string,
    data: Partial<ContentType>,
  ): Promise<ContentType> => {
    return apiClient.patch(
      GetUrl(API_ENDPOINTS.CMS.CONTENT_TYPES.UPDATE(id)),
      data,
    );
  },

  deleteContentType: async (id: string): Promise<boolean> => {
    return apiClient.delete(GetUrl(API_ENDPOINTS.CMS.CONTENT_TYPES.DELETE(id)));
  },

  // Content Fields
  getContentFieldsByContentType: async (
    contentTypeId: string,
  ): Promise<ContentField[]> => {
    return apiClient.get(
      GetUrl(
        API_ENDPOINTS.CMS.CONTENT_FIELDS.GET_BY_CONTENT_TYPE(contentTypeId),
      ),
    );
  },

  createContentField: async (
    contentTypeId: string,
    data: Partial<ContentField>,
  ): Promise<ContentField> => {
    return apiClient.post(
      GetUrl(API_ENDPOINTS.CMS.CONTENT_FIELDS.CREATE(contentTypeId)),
      data,
    );
  },

  getContentFieldById: async (
    contentTypeId: string,
    fieldId: string,
  ): Promise<ContentField> => {
    return apiClient.get(
      GetUrl(
        API_ENDPOINTS.CMS.CONTENT_FIELDS.GET_BY_ID(contentTypeId, fieldId),
      ),
    );
  },

  updateContentField: async (
    contentTypeId: string,
    fieldId: string,
    data: Partial<ContentField>,
  ): Promise<ContentField> => {
    return apiClient.patch(
      GetUrl(API_ENDPOINTS.CMS.CONTENT_FIELDS.UPDATE(contentTypeId, fieldId)),
      data,
    );
  },

  deleteContentField: async (
    contentTypeId: string,
    fieldId: string,
  ): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.CMS.CONTENT_FIELDS.DELETE(contentTypeId, fieldId)),
    );
  },

  // Content Items
  getContentItemsByContentType: async (
    contentTypeId: string,
  ): Promise<ContentItem[]> => {
    return apiClient.get(
      GetUrl(
        API_ENDPOINTS.CMS.CONTENT_ITEMS.GET_BY_CONTENT_TYPE(contentTypeId),
      ),
    );
  },

  createContentItem: async (
    contentTypeId: string,
    data: Partial<ContentItem>,
  ): Promise<ContentItem> => {
    return apiClient.post(
      GetUrl(API_ENDPOINTS.CMS.CONTENT_ITEMS.CREATE(contentTypeId)),
      data,
    );
  },

  getContentItemById: async (
    contentTypeId: string,
    itemId: string,
  ): Promise<ContentItem> => {
    return apiClient.get(
      GetUrl(API_ENDPOINTS.CMS.CONTENT_ITEMS.GET_BY_ID(contentTypeId, itemId)),
    );
  },

  updateContentItem: async (
    contentTypeId: string,
    itemId: string,
    data: Partial<ContentItem>,
  ): Promise<ContentItem> => {
    return apiClient.patch(
      GetUrl(API_ENDPOINTS.CMS.CONTENT_ITEMS.UPDATE(contentTypeId, itemId)),
      data,
    );
  },

  deleteContentItem: async (
    contentTypeId: string,
    itemId: string,
  ): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.CMS.CONTENT_ITEMS.DELETE(contentTypeId, itemId)),
    );
  },

  // Public Content
  getPublicContent: async (params?: {
    contentTypeId?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ContentItem[]> => {
    const query = new URLSearchParams();
    if (params?.contentTypeId)
      query.append("contentTypeId", params.contentTypeId);
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.sortBy) query.append("sortBy", params.sortBy);
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
    return apiClient.get(
      GetUrl(`${API_ENDPOINTS.CMS.PUBLIC_CONTENT.GET}?${query.toString()}`),
    );
  },

  getPublicContentItem: async (
    contentTypeId: string,
    slug: string,
  ): Promise<ContentItem> => {
    return apiClient.get(
      GetUrl(API_ENDPOINTS.CMS.PUBLIC_CONTENT.GET_ITEM(contentTypeId, slug)),
    );
  },
};
