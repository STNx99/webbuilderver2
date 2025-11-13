/**
 * Event Patterns & Utilities
 * Common event patterns and helper functions
 */

import {
  validateEventHandler,
  validateEventHandlers,
  validateEventCondition,
  extractErrorMessages,
  EventHandler,
  EventType,
  ActionType,
  EventCondition,
} from "@/schema/eventSchemas";
import { v4 as uuidv4 } from "uuid";

/**
 * Factory functions for creating common event patterns
 */
export const eventPatterns = {
  /**
   * Create a simple click-to-navigate handler
   */
  clickNavigate: (url: string, newTab: boolean = false): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "navigate" as const,
      enabled: true,
      config: {
        type: "navigate" as const,
        target: "url" as const,
        value: url,
        openInNewTab: newTab,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a toggle visibility handler
   */
  toggleVisibility: (elementId: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "toggleElement" as const,
      enabled: true,
      config: {
        type: "toggleElement" as const,
        elementId,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a show element handler
   */
  showElement: (elementId: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "showElement" as const,
      enabled: true,
      config: {
        type: "showElement" as const,
        elementId,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a hide element handler
   */
  hideElement: (elementId: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "hideElement" as const,
      enabled: true,
      config: {
        type: "hideElement" as const,
        elementId,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a form submission handler
   */
  submitForm: (
    apiUrl: string,
    method: "POST" | "PUT" = "POST",
  ): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onSubmit" as const,
      actionType: "apiCall" as const,
      enabled: true,
      config: {
        type: "apiCall" as const,
        url: apiUrl,
        method,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a show notification handler
   */
  showNotification: (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
  ): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "showNotification" as const,
      enabled: true,
      config: {
        type: "showNotification" as const,
        message,
        notificationType: type,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a hover animation handler
   */
  hoverAnimation: (
    elementId: string,
    animationType:
      | "fadeIn"
      | "slideIn"
      | "bounce"
      | "pulse"
      | "shake"
      | "spin" = "pulse",
  ): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onMouseEnter" as const,
      actionType: "playAnimation" as const,
      enabled: true,
      config: {
        type: "playAnimation" as const,
        elementId,
        animationType,
        duration: 1000,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a conditional show handler
   */
  conditionalShow: (
    elementId: string,
    condition: EventCondition,
  ): EventHandler => {
    const conditionResult = validateEventCondition(condition);
    if (!conditionResult.success) {
      throw new Error(
        `Invalid condition: ${extractErrorMessages(conditionResult).join(", ")}`,
      );
    }

    const handler = {
      id: uuidv4(),
      eventType: "onChange" as const,
      actionType: "showElement" as const,
      enabled: true,
      conditions: [conditionResult.data],
      config: {
        type: "showElement" as const,
        elementId,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a scroll to element handler
   */
  scrollToElement: (
    elementId: string,
    smooth: boolean = true,
  ): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "scrollTo" as const,
      enabled: true,
      config: {
        type: "scrollTo" as const,
        target: "elementId" as const,
        value: elementId,
        behavior: (smooth ? "smooth" : "auto") as "smooth" | "auto",
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a scroll to position handler
   */
  scrollToPosition: (
    position: number,
    smooth: boolean = true,
  ): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "scrollTo" as const,
      enabled: true,
      config: {
        type: "scrollTo" as const,
        target: "position" as const,
        value: position,
        behavior: (smooth ? "smooth" : "auto") as "smooth" | "auto",
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a copy-to-clipboard handler
   */
  copyText: (text: string, successMessage?: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "copyToClipboard" as const,
      enabled: true,
      config: {
        type: "copyToClipboard" as const,
        text,
        successMessage,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create an open modal handler
   */
  openModal: (modalId: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "modal" as const,
      enabled: true,
      config: {
        type: "modal" as const,
        action: "open" as const,
        modalId,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a close modal handler
   */
  closeModal: (modalId: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "modal" as const,
      enabled: true,
      config: {
        type: "modal" as const,
        action: "close" as const,
        modalId,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create an add class handler
   */
  addClass: (elementId: string, className: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "addClass" as const,
      enabled: true,
      config: {
        type: "addClass" as const,
        elementId,
        className,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a remove class handler
   */
  removeClass: (elementId: string, className: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "removeClass" as const,
      enabled: true,
      config: {
        type: "removeClass" as const,
        elementId,
        className,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a toggle class handler
   */
  toggleClass: (elementId: string, className: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "toggleClass" as const,
      enabled: true,
      config: {
        type: "toggleClass" as const,
        elementId,
        className,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a download file handler
   */
  downloadFile: (url: string, filename?: string): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onClick" as const,
      actionType: "downloadFile" as const,
      enabled: true,
      config: {
        type: "downloadFile" as const,
        url,
        filename,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a set data handler
   */
  setData: (dataPath: string, value: any): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType: "onChange" as const,
      actionType: "setData" as const,
      enabled: true,
      config: {
        type: "setData" as const,
        dataPath,
        value,
        valueType: "static" as const,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create a custom code handler
   */
  customCode: (
    code: string,
    eventType: EventType = "onClick",
  ): EventHandler => {
    const handler = {
      id: uuidv4(),
      eventType,
      actionType: "customCode" as const,
      enabled: true,
      config: {
        type: "customCode" as const,
        code,
      },
    };
    const result = validateEventHandler(handler);
    if (!result.success) {
      throw new Error(
        `Invalid handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },
};

/**
 * Condition builder helpers
 */
export const conditions = {
  /**
   * Create state equals condition
   */
  stateEquals: (key: string, value: any): EventCondition => {
    const condition = {
      id: uuidv4(),
      type: "stateEquals" as const,
      left: key,
      right: value,
    };
    const result = validateEventCondition(condition);
    if (!result.success) {
      throw new Error(
        `Invalid condition: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create state check condition with operator
   */
  stateCheck: (
    key: string,
    operator: "==" | "!=" | ">" | "<" | ">=" | "<=",
    value: any,
  ): EventCondition => {
    const condition = {
      id: uuidv4(),
      type: "stateCheck" as const,
      left: key,
      operator,
      right: value,
    };
    const result = validateEventCondition(condition);
    if (!result.success) {
      throw new Error(
        `Invalid condition: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create string includes condition
   */
  stringIncludes: (key: string, substring: string): EventCondition => {
    const condition = {
      id: uuidv4(),
      type: "stateCheck" as const,
      left: key,
      operator: "includes" as const,
      right: substring,
    };
    const result = validateEventCondition(condition);
    if (!result.success) {
      throw new Error(
        `Invalid condition: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create string not includes condition
   */
  stringNotIncludes: (key: string, substring: string): EventCondition => {
    const condition = {
      id: uuidv4(),
      type: "stateCheck" as const,
      left: key,
      operator: "notIncludes" as const,
      right: substring,
    };
    const result = validateEventCondition(condition);
    if (!result.success) {
      throw new Error(
        `Invalid condition: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Create custom code condition
   */
  custom: (code: string): EventCondition => {
    const condition = {
      id: uuidv4(),
      type: "customCode" as const,
      customCode: code,
    };
    const result = validateEventCondition(condition);
    if (!result.success) {
      throw new Error(
        `Invalid condition: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Always true condition
   */
  always: (): EventCondition => {
    const condition = {
      id: uuidv4(),
      type: "always" as const,
    };
    const result = validateEventCondition(condition);
    if (!result.success) {
      throw new Error(
        `Invalid condition: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },
};

/**
 * Event utilities
 */
export const eventUtils = {
  /**
   * Combine multiple handlers into a chain
   */
  chainHandlers: (...handlers: EventHandler[]): EventHandler => {
    if (handlers.length === 0) {
      throw new Error("At least one handler is required");
    }

    const [first, ...rest] = handlers;
    const chained = {
      ...first,
      nextHandlers: rest,
    };

    const result = validateEventHandler(chained);
    if (!result.success) {
      throw new Error(
        `Invalid chained handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Convert handlers to JSON for storage
   */
  serializeHandlers: (handlers: EventHandler[]): string => {
    const result = validateEventHandlers(handlers);
    if (!result.success) {
      throw new Error(
        `Invalid handlers: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return JSON.stringify(result.data);
  },

  /**
   * Parse handlers from JSON
   */
  deserializeHandlers: (json: string): EventHandler[] => {
    try {
      const parsed = JSON.parse(json);
      const result = validateEventHandlers(parsed);
      if (!result.success) {
        console.error(
          "Failed to validate deserialized handlers:",
          extractErrorMessages(result),
        );
        return [];
      }
      return result.data;
    } catch (error) {
      console.error("Failed to deserialize handlers:", error);
      return [];
    }
  },

  /**
   * Get all event types used in handlers
   */
  getEventTypes: (handlers: EventHandler[]): EventType[] => {
    return [...new Set(handlers.map((h) => h.eventType))];
  },

  /**
   * Filter handlers by event type
   */
  filterByEventType: (
    handlers: EventHandler[],
    eventType: EventType,
  ): EventHandler[] => {
    return handlers.filter((h) => h.eventType === eventType);
  },

  /**
   * Filter handlers by action type
   */
  filterByActionType: (
    handlers: EventHandler[],
    actionType: ActionType,
  ): EventHandler[] => {
    return handlers.filter((h) => h.actionType === actionType);
  },

  /**
   * Enable/disable handlers
   */
  toggleHandlers: (
    handlers: EventHandler[],
    enabled: boolean,
  ): EventHandler[] => {
    return handlers.map((h) => ({ ...h, enabled }));
  },

  /**
   * Enable/disable specific handler
   */
  toggleHandler: (
    handlers: EventHandler[],
    handlerId: string,
    enabled: boolean,
  ): EventHandler[] => {
    return handlers.map((h) => (h.id === handlerId ? { ...h, enabled } : h));
  },

  /**
   * Validate handler configuration using Zod schemas
   */
  validateHandler: (
    handler: EventHandler,
  ): { valid: boolean; errors: string[] } => {
    const result = validateEventHandler(handler);
    return {
      valid: result.success,
      errors: result.success ? [] : extractErrorMessages(result),
    };
  },

  /**
   * Clone a handler with new ID
   */
  cloneHandler: (handler: EventHandler): EventHandler => {
    const cloned = {
      ...JSON.parse(JSON.stringify(handler)),
      id: uuidv4(),
    };
    const result = validateEventHandler(cloned);
    if (!result.success) {
      throw new Error(
        `Invalid cloned handler: ${extractErrorMessages(result).join(", ")}`,
      );
    }
    return result.data;
  },

  /**
   * Merge multiple event handler collections
   */
  mergeEventCollections: (...collections: any[]): any => {
    const merged: any = {};

    for (const collection of collections) {
      Object.entries(collection).forEach(
        ([eventType, handlers]: [string, any]) => {
          if (!merged[eventType]) {
            merged[eventType] = [];
          }
          merged[eventType] = [...merged[eventType], ...handlers];
        },
      );
    }

    return merged;
  },

  /**
   * Get handler by ID
   */
  getHandlerById: (
    handlers: EventHandler[],
    handlerId: string,
  ): EventHandler | undefined => {
    return handlers.find((h) => h.id === handlerId);
  },

  /**
   * Update handler by ID
   */
  updateHandlerById: (
    handlers: EventHandler[],
    handlerId: string,
    updates: Partial<EventHandler>,
  ): EventHandler[] => {
    return handlers.map((h) => {
      if (h.id === handlerId) {
        const updated = { ...h, ...updates };
        const result = validateEventHandler(updated);
        if (!result.success) {
          throw new Error(
            `Invalid updated handler: ${extractErrorMessages(result).join(", ")}`,
          );
        }
        return result.data;
      }
      return h;
    });
  },

  /**
   * Remove handler by ID
   */
  removeHandlerById: (
    handlers: EventHandler[],
    handlerId: string,
  ): EventHandler[] => {
    return handlers.filter((h) => h.id !== handlerId);
  },

  /**
   * Get summary of handlers
   */
  getSummary: (handlers: EventHandler[]): string => {
    const eventCounts = new Map<EventType, number>();
    const actionCounts = new Map<ActionType, number>();

    handlers.forEach((h) => {
      eventCounts.set(h.eventType, (eventCounts.get(h.eventType) ?? 0) + 1);
      actionCounts.set(h.actionType, (actionCounts.get(h.actionType) ?? 0) + 1);
    });

    const events = Array.from(eventCounts.entries())
      .map(([e, c]) => `${e}(${c})`)
      .join(", ");
    const actions = Array.from(actionCounts.entries())
      .map(([a, c]) => `${a}(${c})`)
      .join(", ");

    return `Events: ${events} | Actions: ${actions}`;
  },
};
