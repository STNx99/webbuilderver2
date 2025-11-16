import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import GetUrl from "@/lib/utils/geturl";

export interface IElementEventWorkflow {
  id: string;
  elementId: string;
  workflowId: string;
  eventName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateElementEventWorkflowInput {
  elementId: string;
  workflowId: string;
  eventName: string;
}

export interface UpdateElementEventWorkflowInput {
  eventName?: string;
  workflowId?: string;
}

interface IElementEventWorkflowService {
  createElementEventWorkflow(
    data: CreateElementEventWorkflowInput,
  ): Promise<IElementEventWorkflow>;
  getElementEventWorkflows(): Promise<IElementEventWorkflow[]>;
  getElementEventWorkflowsByElement(
    elementId: string,
  ): Promise<IElementEventWorkflow[]>;
  getElementEventWorkflowByID(id: string): Promise<IElementEventWorkflow>;
  updateElementEventWorkflow(
    id: string,
    data: UpdateElementEventWorkflowInput,
  ): Promise<IElementEventWorkflow>;
  deleteElementEventWorkflow(id: string): Promise<boolean>;
  deleteElementEventWorkflowsByElement(elementId: string): Promise<boolean>;
  deleteElementEventWorkflowsByWorkflow(workflowId: string): Promise<boolean>;
}

export const elementEventWorkflowService: IElementEventWorkflowService = {
  createElementEventWorkflow: async (
    data: CreateElementEventWorkflowInput,
  ): Promise<IElementEventWorkflow> => {
    return apiClient.post(
      GetUrl(API_ENDPOINTS.ELEMENT_EVENT_WORKFLOWS.CREATE),
      data,
    );
  },

  getElementEventWorkflows: async (): Promise<IElementEventWorkflow[]> => {
    return apiClient.get(GetUrl(API_ENDPOINTS.ELEMENT_EVENT_WORKFLOWS.GET_ALL));
  },

  getElementEventWorkflowsByElement: async (
    elementId: string,
  ): Promise<IElementEventWorkflow[]> => {
    const url = `${GetUrl(API_ENDPOINTS.ELEMENT_EVENT_WORKFLOWS.GET_ALL)}?elementId=${encodeURIComponent(elementId)}`;
    const response = await apiClient.get(url);

    // Handle response format with data property
    if (response && typeof response === "object" && "data" in response) {
      return Array.isArray(response.data) ? response.data : [];
    }

    return Array.isArray(response) ? response : [];
  },

  getElementEventWorkflowByID: async (
    id: string,
  ): Promise<IElementEventWorkflow> => {
    return apiClient.get(
      GetUrl(API_ENDPOINTS.ELEMENT_EVENT_WORKFLOWS.GET_BY_ID(id)),
    );
  },

  updateElementEventWorkflow: async (
    id: string,
    data: UpdateElementEventWorkflowInput,
  ): Promise<IElementEventWorkflow> => {
    console.log(data);
    return apiClient.patch(
      GetUrl(API_ENDPOINTS.ELEMENT_EVENT_WORKFLOWS.UPDATE(id)),
      data as any,
    );
  },

  deleteElementEventWorkflow: async (id: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.ELEMENT_EVENT_WORKFLOWS.DELETE(id)),
    );
  },

  deleteElementEventWorkflowsByElement: async (
    elementId: string,
  ): Promise<boolean> => {
    const url = `${GetUrl(API_ENDPOINTS.ELEMENT_EVENT_WORKFLOWS.GET_ALL)}?elementId=${encodeURIComponent(elementId)}`;
    return apiClient.delete(url);
  },

  deleteElementEventWorkflowsByWorkflow: async (
    workflowId: string,
  ): Promise<boolean> => {
    const url = `${GetUrl(API_ENDPOINTS.ELEMENT_EVENT_WORKFLOWS.GET_ALL)}?workflowId=${encodeURIComponent(workflowId)}`;
    return apiClient.delete(url);
  },
};
