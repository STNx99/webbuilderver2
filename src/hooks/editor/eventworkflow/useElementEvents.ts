"use client";

/**
 * useElementEvents Hook
 * Provides event handling capabilities for elements in preview mode
 */

import { useState, useRef } from "react";
import {
  EventHandler,
  ElementEvents,
  EventExecutionContext,
} from "@/interfaces/events.interface";
import { eventExecutor } from "@/lib/events/eventExecutor";

interface UseElementEventsOptions {
  elementId: string;
  onStateChange?: (newState: Record<string, any>) => void;
  globalState?: Record<string, any>;
}

export function useElementEvents(options: UseElementEventsOptions) {
  const { elementId, onStateChange, globalState } = options;

  const [elementState, setElementState] = useState<Record<string, any>>({});
  const elementRef = useRef<HTMLElement | null>(null);
  const eventsMapRef = useRef<Map<string, EventHandler[]>>(new Map());

  /**
   * Register event handlers for an element
   */
  const registerEvents = (elementEvents: ElementEvents) => {
    eventsMapRef.current.clear();
    Object.entries(elementEvents).forEach(([eventType, handlers]) => {
      if (Array.isArray(handlers)) {
        eventsMapRef.current.set(eventType, handlers);
      }
    });
  };

  /**
   * Handle event and execute associated handlers
   */
  const handleEvent = async (
    eventType: string,
    nativeEvent: React.SyntheticEvent | Event,
  ) => {
    const handlers = eventsMapRef.current.get(eventType);

    if (!handlers || handlers.length === 0) {
      return;
    }

    for (const handler of handlers) {
      const context: EventExecutionContext = {
        element: elementRef.current,
        event: nativeEvent,
        elementState,
        globalState,
        elementInstance: elementRef.current,
      };

      try {
        await eventExecutor.execute(handler, context);

        // Update state if changed
        onStateChange?.(elementState);
      } catch (error) {
        console.error(`Error handling ${eventType}:`, error);
      }
    }
  };

  /**
   * Create event handlers for all registered events
   */
  const createEventHandlers = () => {
    const handlers: Record<string, (e: any) => void> = {};

    eventsMapRef.current.forEach((_, eventType) => {
      handlers[eventType] = (e: any) => {
        handleEvent(eventType, e);
      };
    });

    return handlers;
  };

  /**
   * Update element state
   */
  const updateState = (key: string, value: any) => {
    setElementState((prev) => {
      const newState = { ...prev, [key]: value };
      onStateChange?.(newState);
      return newState;
    });
  };

  /**
   * Get current element state
   */
  const getState = (key?: string) => {
    if (key) {
      return elementState[key];
    }
    return elementState;
  };

  return {
    elementRef,
    registerEvents,
    handleEvent,
    createEventHandlers,
    updateState,
    getState,
    state: elementState,
  };
}
