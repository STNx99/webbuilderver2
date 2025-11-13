import Get, { GetNextJSURL } from "@/lib/utils/geturl";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  EventWorkflow,
  CreateEventWorkflowInput,
  UpdateEventWorkflowInput,
} from "@/interfaces/eventWorkflow.interface";

interface IEventWorkflowService {
  getEventWorkflows(projectId: string): Promise<EventWorkflow[]>;
  getEventWorkflowById(
    projectId: string,
    workflowId: string,
  ): Promise<EventWorkflow>;
  createEventWorkflow(
    projectId: string,
    data: CreateEventWorkflowInput,
  ): Promise<EventWorkflow>;
  updateEventWorkflow(
    projectId: string,
    workflowId: string,
    data: UpdateEventWorkflowInput,
  ): Promise<EventWorkflow>;
  deleteEventWorkflow(projectId: string, workflowId: string): Promise<boolean>;
}

export const eventWorkflowService: IEventWorkflowService = {
  getEventWorkflows: async (projectId: string): Promise<EventWorkflow[]> => {
    return apiClient.get(
      GetNextJSURL(API_ENDPOINTS.EVENT_WORKFLOWS.GET_BY_PROJECT(projectId)),
    );
  },

  getEventWorkflowById: async (
    projectId: string,
    workflowId: string,
  ): Promise<EventWorkflow> => {
    return apiClient.get(
      GetNextJSURL(
        API_ENDPOINTS.EVENT_WORKFLOWS.GET_BY_ID(projectId, workflowId),
      ),
    );
  },

  createEventWorkflow: async (
    projectId: string,
    data: CreateEventWorkflowInput,
  ): Promise<EventWorkflow> => {
    return apiClient.post(
      GetNextJSURL(API_ENDPOINTS.EVENT_WORKFLOWS.CREATE(projectId)),
      data,
    );
  },

  updateEventWorkflow: async (
    projectId: string,
    workflowId: string,
    data: UpdateEventWorkflowInput,
  ): Promise<EventWorkflow> => {
    // Log the data being sent for debugging
    console.log("Updating workflow with data:", {
      name: data.name,
      hasHandlers: !!data.handlers,
      handlerCount: data.handlers?.length || 0,
      hasCanvasData: !!data.canvasData,
      canvasNodeCount: data.canvasData?.nodes?.length || 0,
      canvasConnectionCount: data.canvasData?.connections?.length || 0,
    });

    return apiClient.put(
      GetNextJSURL(API_ENDPOINTS.EVENT_WORKFLOWS.UPDATE(projectId, workflowId)),
      data as any,
    );
  },

  deleteEventWorkflow: async (
    projectId: string,
    workflowId: string,
  ): Promise<boolean> => {
    return apiClient.delete(
      GetNextJSURL(API_ENDPOINTS.EVENT_WORKFLOWS.DELETE(projectId, workflowId)),
    );
  },
};
