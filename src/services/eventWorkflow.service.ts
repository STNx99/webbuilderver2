import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  EventWorkflow,
  CreateEventWorkflowInput,
  UpdateEventWorkflowInput,
} from "@/interfaces/eventWorkflow.interface";
import GetUrl from "@/lib/utils/geturl";

interface IEventWorkflowService {
  getEventWorkflows(projectId: string): Promise<EventWorkflow[]>;
  getEventWorkflowById(workflowId: string): Promise<EventWorkflow>;
  createEventWorkflow(
    projectId: string,
    data: CreateEventWorkflowInput,
  ): Promise<EventWorkflow>;
  updateEventWorkflow(
    workflowId: string,
    data: UpdateEventWorkflowInput,
  ): Promise<EventWorkflow>;
  updateEventWorkflowEnabled(
    workflowId: string,
    enabled: boolean,
  ): Promise<EventWorkflow>;
  deleteEventWorkflow(workflowId: string): Promise<boolean>;
}

export const eventWorkflowService: IEventWorkflowService = {
  getEventWorkflows: async (projectId: string): Promise<EventWorkflow[]> => {
    const response = await apiClient.get<
      { data: EventWorkflow[] } | EventWorkflow[]
    >(GetUrl(API_ENDPOINTS.EVENT_WORKFLOWS.GET_BY_PROJECT(projectId)));
    return Array.isArray(response) ? response : response?.data || [];
  },

  getEventWorkflowById: async (workflowId: string): Promise<EventWorkflow> => {
    return apiClient.get(
      GetUrl(API_ENDPOINTS.EVENT_WORKFLOWS.GET_BY_ID(workflowId)),
    );
  },

  createEventWorkflow: async (
    projectId: string,
    data: CreateEventWorkflowInput,
  ): Promise<EventWorkflow> => {
    return apiClient.post(GetUrl(API_ENDPOINTS.EVENT_WORKFLOWS.CREATE), {
      ...data,
      projectId,
    });
  },

  updateEventWorkflow: async (
    workflowId: string,
    data: UpdateEventWorkflowInput,
  ): Promise<EventWorkflow> => {
    console.log("Updating workflow with data:", {
      name: data.name,
      hasCanvasData: !!data.canvasData,
      canvasNodeCount: data.canvasData?.nodes?.length || 0,
      canvasConnectionCount: data.canvasData?.connections?.length || 0,
    });
    console.log(data);
    return apiClient.patch(
      GetUrl(API_ENDPOINTS.EVENT_WORKFLOWS.UPDATE(workflowId)),
      data as any,
    );
  },

  updateEventWorkflowEnabled: async (
    workflowId: string,
    enabled: boolean,
  ): Promise<EventWorkflow> => {
    return apiClient.patch(
      GetUrl(API_ENDPOINTS.EVENT_WORKFLOWS.UPDATE_ENABLED(workflowId)),
      { enabled } as any,
    );
  },

  deleteEventWorkflow: async (workflowId: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.EVENT_WORKFLOWS.DELETE(workflowId)),
    );
  },
};
