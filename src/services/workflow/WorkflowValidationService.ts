/**
 * WorkflowValidationService
 * Provides comprehensive validation for workflows and event handlers
 * with user-friendly error messages and detailed error reporting
 */

import {
  EventHandler,
  validateEventHandler,
  validateEventHandlers,
  EventActionConfig,
} from "@/schema/eventSchemas";
import {
  WorkflowNode,
  WorkflowData,
  NodeType,
} from "@/components/editor/sidebar/eventworkflow/types/workflow.types";
import { z } from "zod";

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  nodeId?: string;
  nodeLabel?: string;
  handlerId?: string;
  field?: string;
  message: string;
  code: string;
  path?: string[];
}

export interface ValidationWarning {
  nodeId?: string;
  nodeLabel?: string;
  message: string;
}

export interface NodeValidationResult {
  nodeId: string;
  nodeLabel: string;
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Main validation service for workflows
 */
export class WorkflowValidationService {
  /**
   * Validate complete workflow structure and handlers
   */
  static validateWorkflow(workflow: WorkflowData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate workflow structure
    const structureResult = this.validateWorkflowStructure(workflow);
    errors.push(...structureResult.errors);
    warnings.push(...structureResult.warnings);

    // Validate individual nodes
    workflow.nodes.forEach((node) => {
      const nodeResult = this.validateNode(node);
      errors.push(...nodeResult.errors);
      warnings.push(...nodeResult.warnings);
    });

    // Validate connections
    const connectionResult = this.validateConnections(workflow);
    errors.push(...connectionResult.errors);
    warnings.push(...connectionResult.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate workflow structure (trigger, actions, etc.)
   */
  static validateWorkflowStructure(workflow: WorkflowData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check for nodes
    if (!workflow.nodes || workflow.nodes.length === 0) {
      errors.push({
        code: "NO_NODES",
        message: "Workflow must have at least one node",
      });
      return { valid: false, errors, warnings };
    }

    // Check for trigger node
    const triggerNodes = workflow.nodes.filter(
      (n) => n.type === NodeType.TRIGGER,
    );
    if (triggerNodes.length === 0) {
      errors.push({
        code: "NO_TRIGGER",
        message:
          "Workflow must have at least one TRIGGER node to define the event type",
      });
    } else if (triggerNodes.length > 1) {
      warnings.push({
        message: `Workflow has ${triggerNodes.length} TRIGGER nodes. Only the first one will be used for the event type.`,
      });
    }

    // Check for action nodes
    const actionNodes = workflow.nodes.filter(
      (n) => n.type === NodeType.ACTION,
    );
    if (actionNodes.length === 0) {
      errors.push({
        code: "NO_ACTIONS",
        message:
          "Workflow must have at least one ACTION node to perform operations",
      });
    }

    // Check for isolated nodes
    const connectedNodeIds = new Set<string>();
    workflow.connections?.forEach((conn) => {
      connectedNodeIds.add(conn.source);
      connectedNodeIds.add(conn.target);
    });

    workflow.nodes.forEach((node) => {
      // TRIGGER nodes don't need incoming connections
      if (node.type === NodeType.TRIGGER) return;

      // Check if node is connected
      if (!connectedNodeIds.has(node.id)) {
        warnings.push({
          nodeId: node.id,
          nodeLabel: node.data.label || "Unknown",
          message: `Node "${node.data.label || node.id}" is not connected to any other nodes`,
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a single workflow node
   */
  static validateNode(node: WorkflowNode): NodeValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate node has required data
    if (!node.data) {
      errors.push({
        nodeId: node.id,
        nodeLabel: "Unknown",
        code: "NO_DATA",
        message: "Node is missing data",
      });
      return {
        nodeId: node.id,
        nodeLabel: "Unknown",
        valid: false,
        errors,
        warnings,
      };
    }

    // Validate node label
    if (!node.data.label || node.data.label.trim() === "") {
      warnings.push({
        nodeId: node.id,
        nodeLabel: node.id,
        message: "Node has no label",
      });
    }

    // Validate based on node type
    switch (node.type) {
      case NodeType.TRIGGER:
        this.validateTriggerNode(node, errors, warnings);
        break;
      case NodeType.ACTION:
        this.validateActionNode(node, errors, warnings);
        break;
      case NodeType.CONDITION:
        this.validateConditionNode(node, errors, warnings);
        break;
      case NodeType.OUTPUT:
        // OUTPUT nodes don't require specific validation
        break;
      default:
        errors.push({
          nodeId: node.id,
          nodeLabel: node.data.label || "Unknown",
          code: "INVALID_TYPE",
          message: `Unknown node type: ${node.type}`,
        });
    }

    return {
      nodeId: node.id,
      nodeLabel: node.data.label || "Unknown",
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate TRIGGER node configuration
   */
  private static validateTriggerNode(
    node: WorkflowNode,
    errors: ValidationError[],
    warnings: ValidationWarning[],
  ): void {
    if (!node.data.config?.eventType) {
      errors.push({
        nodeId: node.id,
        nodeLabel: node.data.label || "Unknown",
        field: "eventType",
        code: "MISSING_EVENT_TYPE",
        message: "TRIGGER node must have an event type configured",
      });
    }

    // Validate eventType is valid
    const validEventTypes = [
      "onClick",
      "onDoubleClick",
      "onMouseEnter",
      "onMouseLeave",
      "onMouseDown",
      "onMouseUp",
      "onFocus",
      "onBlur",
      "onChange",
      "onSubmit",
      "onKeyDown",
      "onKeyUp",
      "onScroll",
      "onLoad",
      "onError",
    ];

    if (
      node.data.config?.eventType &&
      !validEventTypes.includes(node.data.config.eventType)
    ) {
      errors.push({
        nodeId: node.id,
        nodeLabel: node.data.label || "Unknown",
        field: "eventType",
        code: "INVALID_EVENT_TYPE",
        message: `Invalid event type: ${node.data.config.eventType}`,
      });
    }
  }

  /**
   * Validate ACTION node configuration
   */
  private static validateActionNode(
    node: WorkflowNode,
    errors: ValidationError[],
    warnings: ValidationWarning[],
  ): void {
    if (!node.data.config?.actionType) {
      errors.push({
        nodeId: node.id,
        nodeLabel: node.data.label || "Unknown",
        field: "actionType",
        code: "MISSING_ACTION_TYPE",
        message: "ACTION node must have an action type configured",
      });
      return;
    }

    const actionType = node.data.config.actionType;

    // Validate action-specific required fields
    switch (actionType) {
      case "navigate":
        if (!node.data.config.value || node.data.config.value.trim() === "") {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "value",
            code: "MISSING_VALUE",
            message: "Navigate action requires a URL or page value",
          });
        }
        break;

      case "showElement":
      case "hideElement":
      case "toggleElement":
      case "playAnimation":
      case "toggleClass":
      case "addClass":
      case "removeClass":
        if (
          !node.data.config.elementId ||
          node.data.config.elementId.trim() === ""
        ) {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "elementId",
            code: "MISSING_ELEMENT_ID",
            message: `${actionType} action requires an element ID`,
          });
        }
        break;

      case "apiCall":
        if (!node.data.config.url || node.data.config.url.trim() === "") {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "url",
            code: "MISSING_URL",
            message: "API call action requires a URL",
          });
        } else {
          // Validate URL format
          try {
            new URL(node.data.config.url);
          } catch {
            errors.push({
              nodeId: node.id,
              nodeLabel: node.data.label || "Unknown",
              field: "url",
              code: "INVALID_URL",
              message: "API call URL is not valid",
            });
          }
        }
        break;

      case "setData":
        if (
          !node.data.config.dataPath ||
          node.data.config.dataPath.trim() === ""
        ) {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "dataPath",
            code: "MISSING_DATA_PATH",
            message: "Set data action requires a data path",
          });
        }
        break;

      case "customCode":
        if (!node.data.config.code || node.data.config.code.trim() === "") {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "code",
            code: "MISSING_CODE",
            message: "Custom code action requires code to execute",
          });
        }
        break;

      case "scrollTo":
        if (
          !node.data.config.value &&
          node.data.config.value !== 0 &&
          !node.data.config.elementId
        ) {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "value",
            code: "MISSING_VALUE",
            message: "Scroll action requires a target element or position",
          });
        }
        break;

      case "showNotification":
        if (
          !node.data.config.message ||
          node.data.config.message.trim() === ""
        ) {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "message",
            code: "MISSING_MESSAGE",
            message: "Notification action requires a message",
          });
        }
        break;

      case "copyToClipboard":
        if (!node.data.config.text || node.data.config.text.trim() === "") {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "text",
            code: "MISSING_TEXT",
            message: "Copy to clipboard action requires text",
          });
        }
        break;

      case "downloadFile":
        if (!node.data.config.url || node.data.config.url.trim() === "") {
          errors.push({
            nodeId: node.id,
            nodeLabel: node.data.label || "Unknown",
            field: "url",
            code: "MISSING_URL",
            message: "Download file action requires a file URL",
          });
        }
        break;
    }
  }

  /**
   * Validate CONDITION node configuration
   */
  private static validateConditionNode(
    node: WorkflowNode,
    errors: ValidationError[],
    warnings: ValidationWarning[],
  ): void {
    if (!node.data.config?.conditionType) {
      errors.push({
        nodeId: node.id,
        nodeLabel: node.data.label || "Unknown",
        field: "conditionType",
        code: "MISSING_CONDITION_TYPE",
        message: "CONDITION node must have a condition type configured",
      });
    }

    // Validate condition-specific fields
    if (
      node.data.config?.conditionType === "customCode" &&
      (!node.data.config.customCode ||
        node.data.config.customCode.trim() === "")
    ) {
      errors.push({
        nodeId: node.id,
        nodeLabel: node.data.label || "Unknown",
        field: "customCode",
        code: "MISSING_CUSTOM_CODE",
        message: "Custom code condition requires code",
      });
    }
  }

  /**
   * Validate workflow connections
   */
  static validateConnections(workflow: WorkflowData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!workflow.connections || workflow.connections.length === 0) {
      warnings.push({
        message: "Workflow has no connections between nodes",
      });
      return { valid: true, errors, warnings };
    }

    const nodeIds = new Set(workflow.nodes.map((n) => n.id));

    workflow.connections.forEach((conn) => {
      // Check source node exists
      if (!nodeIds.has(conn.source)) {
        errors.push({
          code: "INVALID_CONNECTION",
          message: `Connection references non-existent source node: ${conn.source}`,
        });
      }

      // Check target node exists
      if (!nodeIds.has(conn.target)) {
        errors.push({
          code: "INVALID_CONNECTION",
          message: `Connection references non-existent target node: ${conn.target}`,
        });
      }

      // Check for self-connections
      if (conn.source === conn.target) {
        errors.push({
          code: "SELF_CONNECTION",
          message: "Node cannot connect to itself",
        });
      }
    });

    // Check for circular dependencies
    const circularResult = this.detectCircularDependencies(workflow);
    if (!circularResult.valid) {
      errors.push(...circularResult.errors);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Detect circular dependencies in workflow
   */
  private static detectCircularDependencies(
    workflow: WorkflowData,
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const adjacencyList = new Map<string, string[]>();
    workflow.connections?.forEach((conn) => {
      const sources = adjacencyList.get(conn.source) || [];
      sources.push(conn.target);
      adjacencyList.set(conn.source, sources);
    });

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = adjacencyList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of workflow.nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          errors.push({
            code: "CIRCULAR_DEPENDENCY",
            message:
              "Workflow contains circular dependencies. Actions would loop infinitely.",
          });
          break;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  /**
   * Validate array of event handlers against schema
   */
  static validateHandlers(handlers: EventHandler[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const result = validateEventHandlers(handlers);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push({
          handlerId: issue.path[0]?.toString(),
          field: issue.path.slice(1).join("."),
          path: issue.path.map(String),
          code: issue.code,
          message: issue.message,
        });
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Format validation errors for user display
   */
  static formatErrorsForDisplay(errors: ValidationError[]): string {
    if (errors.length === 0) return "";

    const grouped = new Map<string, ValidationError[]>();

    errors.forEach((error) => {
      const key = error.nodeId || error.handlerId || "workflow";
      const existing = grouped.get(key) || [];
      existing.push(error);
      grouped.set(key, existing);
    });

    const lines: string[] = [];
    grouped.forEach((nodeErrors, nodeKey) => {
      const label =
        nodeErrors[0]?.nodeLabel || nodeErrors[0]?.handlerId || "Workflow";
      lines.push(`\n${label}:`);
      nodeErrors.forEach((err) => {
        lines.push(`  • ${err.message}`);
      });
    });

    return lines.join("\n");
  }

  /**
   * Format warnings for user display
   */
  static formatWarningsForDisplay(warnings: ValidationWarning[]): string {
    if (warnings.length === 0) return "";

    return warnings.map((w) => `• ${w.message}`).join("\n");
  }
}

export default WorkflowValidationService;
