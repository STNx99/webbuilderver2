"use client";

/**
 * useElementEvents Hook
 * Provides event handling capabilities for elements in preview mode
 * Respects global event mode toggle to avoid interference with element handler
 */

import { useState, useRef, useEffect } from "react";
import {
  EventHandler,
  ElementEvents,
  EventExecutionContext,
} from "@/interfaces/events.interface";
import { eventExecutor } from "@/lib/events/eventExecutor";
import { useEventModeStore } from "@/globalstore/eventmodestore";

interface UseElementEventsOptions {
  elementId: string;
  onStateChange?: (newState: Record<string, any>) => void;
  globalState?: Record<string, any>;
  enableEventsOverride?: boolean;
}

export function useElementEvents(options: UseElementEventsOptions) {
  const { elementId, onStateChange, globalState, enableEventsOverride } =
    options;

  const [elementState, setElementState] = useState<Record<string, any>>({});
  const elementRef = useRef<HTMLElement | null>(null);
  const eventsMapRef = useRef<Map<string, EventHandler[]>>(new Map());

  // Get event mode state
  const { isEventModeEnabled, isElementEventsDisabled } = useEventModeStore();

  // Determine if events should be active
  const shouldEventsBeActive = enableEventsOverride ? true : isEventModeEnabled;
  const areEventsDisabledForElement = isElementEventsDisabled(elementId);
  const eventsActive = shouldEventsBeActive && !areEventsDisabledForElement;

  /**
   * Register event handlers for an element
   */
  const registerEvents = (elementEvents: ElementEvents) => {
    eventsMapRef.current.clear();
    if (!eventsActive) {
      return;
    }
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
    // Skip if events are not active
    if (!eventsActive) {
      return;
    }

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

    if (!eventsActive) {
      return handlers;
    }

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

  /**
   * Enable events for this element
   */
  const enableEvents = () => {
    useEventModeStore.getState().enableElementEvents(elementId);
  };

  /**
   * Disable events for this element
   */
  const disableEvents = () => {
    useEventModeStore.getState().disableElementEvents(elementId);
  };

  /**
   * Check if events are currently active
   */
  const areEventsEnabled = () => {
    return eventsActive;
  };

  // Re-register events when event mode changes
  useEffect(() => {
    // Events will be re-registered through the registerEvents call
    // This hook dependency ensures we respond to mode changes
  }, [eventsActive, isEventModeEnabled, areEventsDisabledForElement]);

  return {
    elementRef,
    registerEvents,
    handleEvent,
    createEventHandlers,
    updateState,
    getState,
    state: elementState,
    enableEvents,
    disableEvents,
    areEventsEnabled,
    eventsActive,
  };
}
