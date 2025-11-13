/**
 * Workflow Utilities
 * Helper functions for workflow node transformations and validations
 */

import { WorkflowNode, NodeType } from "../../components/editor/sidebar/eventworkflow/types/workflow.types";

/**
 * Builds a schema-compliant action config based on action type
 * Ensures all required fields are present with valid defaults
 */
export const buildActionConfig = (actionType: string, baseConfig: any) => {
  const config = { type: actionType, ...baseConfig };

  switch (actionType) {
    case "navigate":
      return {
        ...config,
        target: ["url", "page", "external"].includes(config.target)
          ? config.target
          : "url",
        value:
          config.value && String(config.value).trim()
            ? String(config.value)
            : "https://example.com",
        openInNewTab: config.openInNewTab ?? false,
        replaceHistory: config.replaceHistory ?? false,
      };

    case "showElement":
    case "hideElement":
    case "toggleElement":
      return {
        ...config,
        elementId:
          config.elementId && String(config.elementId).trim()
            ? String(config.elementId)
            : "element",
        animationDuration: Number(config.animationDuration) || 300,
      };

    case "apiCall":
      return {
        ...config,
        url:
          config.url && String(config.url).trim()
            ? String(config.url)
            : "https://api.example.com/endpoint",
        method: ["GET", "POST", "PUT", "DELETE", "PATCH"].includes(
          config.method,
        )
          ? config.method
          : "GET",
        timeout: Number(config.timeout) || 5000,
      };

    case "setData":
      return {
        ...config,
        dataPath:
          config.dataPath && String(config.dataPath).trim()
            ? String(config.dataPath)
            : "state.value",
        value: config.value ?? "",
      };

    case "customCode":
      return {
        ...config,
        code:
          config.code && String(config.code).trim()
            ? String(config.code)
            : "// Add custom code here",
      };

    case "scrollTo":
      return {
        ...config,
        target: ["elementId", "position"].includes(config.target)
          ? config.target
          : "elementId",
        value:
          config.value &&
          (String(config.value).trim() || Number(config.value))
            ? config.value
            : "element",
        behavior: ["smooth", "auto"].includes(config.behavior)
          ? config.behavior
          : "smooth",
        offsetY: Number(config.offsetY) || 0,
      };

    case "showNotification":
      return {
        ...config,
        message:
          config.message && String(config.message).trim()
            ? String(config.message)
            : "Notification",
        notificationType: ["success", "error", "info", "warning"].includes(
          config.notificationType,
        )
          ? config.notificationType
          : "info",
        duration: Number(config.duration) || 3000,
      };

    case "modal":
      return {
        ...config,
        action: ["open", "close"].includes(config.action)
          ? config.action
          : "open",
        modalId: config.modalId || undefined,
      };

    case "playAnimation":
      return {
        ...config,
        elementId:
          config.elementId && String(config.elementId).trim()
            ? String(config.elementId)
            : "element",
        animationType: [
          "fadeIn",
          "slideIn",
          "bounce",
          "pulse",
          "shake",
          "spin",
        ].includes(config.animationType)
          ? config.animationType
          : "fadeIn",
        duration: Number(config.duration) || 1000,
        delay: Number(config.delay) || 0,
      };

    case "submitForm":
    case "resetForm":
      return {
        ...config,
        formElementId: config.formElementId || undefined,
      };

    case "toggleClass":
    case "addClass":
    case "removeClass":
      return {
        ...config,
        elementId:
          config.elementId && String(config.elementId).trim()
            ? String(config.elementId)
            : "element",
        className:
          config.className && String(config.className).trim()
            ? String(config.className)
            : "active",
      };

    case "copyToClipboard":
      return {
        ...config,
        text:
          config.text && String(config.text).trim()
            ? String(config.text)
            : "Copied",
        successMessage: config.successMessage || undefined,
      };

    case "downloadFile":
      return {
        ...config,
        url:
          config.url && String(config.url).trim()
            ? String(config.url)
            : "https://example.com/file.pdf",
        filename: config.filename || undefined,
      };

    default:
      return config;
  }
};

/**
 * Validates that a workflow node has the required configuration for its type
 */
export const validateWorkflowNode = (node: WorkflowNode): boolean => {
  switch (node.type) {
    case NodeType.ACTION:
      return !!(node.data?.config?.actionType);
    case NodeType.TRIGGER:
      return !!(node.data?.config?.eventType);
    case NodeType.CONDITION:
      return !!(node.data?.config?.conditionType);
    case NodeType.OUTPUT:
      return true; // No specific config required
    default:
      return false;
  }
};

/**
 * Gets default configuration for a new node based on its type
 */
export const getDefaultNodeConfig = (nodeType: NodeType) => {
  switch (nodeType) {
    case NodeType.ACTION:
      return {
        actionType: "navigate",
        target: "url",
        value: "https://example.com",
        openInNewTab: false,
      };
    case NodeType.TRIGGER:
      return {
        eventType: "onClick",
      };
    case NodeType.CONDITION:
      return {
        conditionType: "always",
      };
    case NodeType.OUTPUT:
      return {};
    default:
      return {};
  }
};
