/**
 * WorkflowTransformService
 * Handles transformation of workflow nodes and connections to event handlers
 * Provides clean, maintainable API for converting visual workflow to executable handlers
 */

import {
  WorkflowNode,
  WorkflowData,
  Connection,
  NodeType,
} from "@/components/editor/sidebar/eventworkflow/types/workflow.types";
import {
  EventHandler,
  EventType,
  ActionType,
  EventActionConfig,
} from "@/schema/eventSchemas";
import { buildActionConfig } from "@/lib/utils/workflowUtils";

export interface TransformResult {
  handlers: EventHandler[];
  errors: TransformError[];
  warnings: TransformWarning[];
}

export interface TransformError {
  nodeId: string;
  nodeLabel: string;
  message: string;
  field?: string;
  code: string;
}

export interface TransformWarning {
  nodeId: string;
  nodeLabel: string;
  message: string;
}

/**
 * Main service class for workflow transformations
 */
export class WorkflowTransformService {
  /**
   * Transform workflow data to event handlers with validation
   */
  static transform(workflow: WorkflowData): TransformResult {
    const errors: TransformError[] = [];
    const warnings: TransformWarning[] = [];

    // Step 1: Validate workflow structure
    const structureValidation = this.validateWorkflowStructure(workflow);
    if (!structureValidation.valid) {
      errors.push(...structureValidation.errors);
      return { handlers: [], errors, warnings };
    }

    // Step 2: Extract event type from TRIGGER node
    const triggerNode = workflow.nodes.find(
      (node) => node.type === NodeType.TRIGGER,
    );

    if (!triggerNode) {
      errors.push({
        nodeId: "workflow",
        nodeLabel: "Workflow",
        message: "Workflow must have at least one TRIGGER node",
        code: "NO_TRIGGER",
      });
      return { handlers: [], errors, warnings };
    }

    const eventType = (triggerNode.data?.config?.eventType ||
      "onClick") as EventType;

    // Step 3: Build connection map for nextHandlers
    const connectionMap = this.buildConnectionMap(workflow.connections);

    // Step 4: Transform ACTION nodes to handlers
    const actionNodes = workflow.nodes.filter(
      (node) => node.type === NodeType.ACTION,
    );

    const handlers = actionNodes
      .map((node) => {
        const transformResult = this.transformNodeToHandler(
          node,
          eventType,
          connectionMap,
        );

        if (transformResult.error) {
          errors.push(transformResult.error);
          return null;
        }

        if (transformResult.warnings) {
          warnings.push(...transformResult.warnings);
        }

        return transformResult.handler;
      })
      .filter((h): h is EventHandler => h !== null);

    // Step 5: Populate nextHandlers references
    const handlersWithNext = this.populateNextHandlers(
      handlers,
      connectionMap,
      workflow.nodes,
    );

    return {
      handlers: handlersWithNext,
      errors,
      warnings,
    };
  }

  /**
   * Validate the workflow structure before transformation
   */
  private static validateWorkflowStructure(workflow: WorkflowData): {
    valid: boolean;
    errors: TransformError[];
  } {
    const errors: TransformError[] = [];

    // Check for at least one trigger
    const triggerNodes = workflow.nodes.filter(
      (n) => n.type === NodeType.TRIGGER,
    );
    if (triggerNodes.length === 0) {
      errors.push({
        nodeId: "workflow",
        nodeLabel: "Workflow",
        message: "Workflow must have at least one TRIGGER node",
        code: "NO_TRIGGER",
      });
    }

    // Check for at least one action
    const actionNodes = workflow.nodes.filter(
      (n) => n.type === NodeType.ACTION,
    );
    if (actionNodes.length === 0) {
      errors.push({
        nodeId: "workflow",
        nodeLabel: "Workflow",
        message: "Workflow must have at least one ACTION node",
        code: "NO_ACTIONS",
      });
    }

    // Check for orphaned nodes (except TRIGGER)
    const connectedNodeIds = new Set<string>();
    workflow.connections.forEach((conn) => {
      connectedNodeIds.add(conn.source);
      connectedNodeIds.add(conn.target);
    });

    workflow.nodes.forEach((node) => {
      if (node.type !== NodeType.TRIGGER && !connectedNodeIds.has(node.id)) {
        errors.push({
          nodeId: node.id,
          nodeLabel: node.data.label || "Unknown",
          message: "Node is not connected to the workflow",
          code: "DISCONNECTED_NODE",
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Transform a single node to an event handler
   */
  private static transformNodeToHandler(
    node: WorkflowNode,
    eventType: EventType,
    connectionMap: Map<string, string[]>,
  ): {
    handler?: EventHandler;
    error?: TransformError;
    warnings?: TransformWarning[];
  } {
    const warnings: TransformWarning[] = [];

    try {
      const actionType = node.data?.config?.actionType;

      if (!actionType) {
        return {
          error: {
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            message: "Action type is not configured",
            field: "actionType",
            code: "MISSING_ACTION_TYPE",
          },
        };
      }

      // Build schema-compliant config
      const config = buildActionConfig(
        actionType,
        node.data?.config || {},
      ) as EventActionConfig;

      // Build handler
      const handler: EventHandler = {
        id: node.id,
        eventType,
        actionType: actionType as ActionType,
        enabled: node.data?.config?.enabled !== false,
        config,
        delay: node.data?.config?.delay
          ? Number(node.data.config.delay)
          : undefined,
        preventDefault: node.data?.config?.preventDefault || undefined,
        stopPropagation: node.data?.config?.stopPropagation || undefined,
        conditions: node.data?.config?.conditions || undefined,
        nextHandlers: [], // Will be populated later
      };

      // Check for missing required fields
      if (
        actionType === "navigate" &&
        config.type === "navigate" &&
        !config.value
      ) {
        warnings.push({
          nodeId: node.id,
          nodeLabel: node.data.label || "Unknown",
          message: "Navigate action should have a URL/page configured",
        });
      }

      return { handler, warnings };
    } catch (error) {
      return {
        error: {
          nodeId: node.id,
          nodeLabel: node.data.label || "Unknown",
          message: `Failed to transform node: ${error instanceof Error ? error.message : "Unknown error"}`,
          code: "TRANSFORM_ERROR",
        },
      };
    }
  }

  /**
   * Build a map of source node ID to target node IDs
   */
  private static buildConnectionMap(
    connections: Connection[],
  ): Map<string, string[]> {
    const map = new Map<string, string[]>();

    connections.forEach((conn) => {
      const targets = map.get(conn.source) || [];
      targets.push(conn.target);
      map.set(conn.source, targets);
    });

    return map;
  }

  /**
   * Populate nextHandlers array for each handler based on connections
   */
  private static populateNextHandlers(
    handlers: EventHandler[],
    connectionMap: Map<string, string[]>,
    allNodes: WorkflowNode[],
  ): EventHandler[] {
    const handlerMap = new Map<string, EventHandler>();
    handlers.forEach((h) => handlerMap.set(h.id, h));

    return handlers.map((handler) => {
      const targetNodeIds = connectionMap.get(handler.id) || [];

      // Filter to only include targets that are ACTION nodes (handlers)
      const nextHandlerIds = targetNodeIds.filter((targetId) => {
        const targetNode = allNodes.find((n) => n.id === targetId);
        return targetNode?.type === NodeType.ACTION;
      });

      // Get the actual handler objects for next handlers
      const nextHandlers = nextHandlerIds
        .map((id) => handlerMap.get(id))
        .filter((h): h is EventHandler => h !== undefined);

      return {
        ...handler,
        nextHandlers: nextHandlers.length > 0 ? nextHandlers : undefined,
      };
    });
  }

  /**
   * Extract event type from workflow
   */
  static extractEventType(workflow: WorkflowData): EventType | null {
    const triggerNode = workflow.nodes.find(
      (node) => node.type === NodeType.TRIGGER,
    );

    if (!triggerNode?.data?.config?.eventType) {
      return null;
    }

    return triggerNode.data.config.eventType as EventType;
  }

  /**
   * Get workflow statistics for debugging
   */
  static getWorkflowStats(workflow: WorkflowData) {
    const nodesByType = {
      trigger: 0,
      action: 0,
      condition: 0,
      output: 0,
    };

    workflow.nodes.forEach((node) => {
      if (node.type === NodeType.TRIGGER) nodesByType.trigger++;
      else if (node.type === NodeType.ACTION) nodesByType.action++;
      else if (node.type === NodeType.CONDITION) nodesByType.condition++;
      else if (node.type === NodeType.OUTPUT) nodesByType.output++;
    });

    return {
      totalNodes: workflow.nodes.length,
      totalConnections: workflow.connections.length,
      nodesByType,
      hasValidStructure: nodesByType.trigger > 0 && nodesByType.action > 0,
    };
  }
}

export default WorkflowTransformService;
