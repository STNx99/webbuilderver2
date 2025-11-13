# Event Mode Toggle Feature

## Overview

The Event Mode Toggle is a feature that allows you to turn on and off event handler execution in your Web Builder editor. This prevents events from interfering with the normal editor functionality like drag-and-drop and element selection.

## Why You Need This

By default, when you add events to elements (click handlers, hover effects, etc.), they could interfere with:
- **Dragging elements** in the canvas
- **Selecting elements** by clicking
- **Editor interactions** like double-clicking to edit text
- **Drop zones** for adding new elements

The Event Mode Toggle solves this by letting you switch between:
- **Edit Mode** (OFF) - Normal editor functionality, no events execute
- **Event Mode** (ON) - Events execute, but you can't edit the layout

## Architecture

### Global State Store

The event mode is managed by `useEventModeStore` in `src/globalstore/eventmodestore.ts`:

```typescript
interface EventModeState {
  // Global event mode toggle
  isEventModeEnabled: boolean;
  setEventModeEnabled: (enabled: boolean) => void;
  toggleEventMode: () => void;

  // Per-element event override
  disabledElementEvents: Set<string>;
  disableElementEvents: (elementId: string) => void;
  enableElementEvents: (elementId: string) => void;
  toggleElementEvents: (elementId: string) => void;
  isElementEventsDisabled: (elementId: string) => boolean;
  clearDisabledElements: () => void;
}
```

### Hook Integration

The `useElementEvents` hook respects the global event mode:

```typescript
const { isEventModeEnabled, isElementEventsDisabled } = useEventModeStore();

// Events only process if mode is enabled AND element events aren't disabled
const eventsActive = isEventModeEnabled && !isElementEventsDisabled(elementId);

// Check before processing events
if (!eventsActive) {
  return; // Skip event processing
}
```

## Components

### EventModeToggle Component

Location: `src/components/editor/eventmode/EventModeToggle.tsx`

A dropdown button that displays the current event mode state:

```typescript
import { EventModeToggle } from "@/components/editor/eventmode/EventModeToggle";

// Add to your editor toolbar
<EventModeToggle />
```

**Features:**
- Toggle button with visual indicator (Zap icon when on, ZapOff when off)
- Dropdown menu with detailed information
- Option to clear all disabled elements
- Status display

**Appearance:**
- When OFF: Gray button with ZapOff icon
- When ON: Blue button with Zap icon
- Accessible via keyboard
- Mobile-friendly

## Usage Guide

### Basic Toggle

```typescript
import { useEventModeStore } from "@/globalstore/eventmodestore";

const MyComponent = () => {
  const { isEventModeEnabled, toggleEventMode } = useEventModeStore();

  return (
    <button onClick={toggleEventMode}>
      {isEventModeEnabled ? "Events ON" : "Events OFF"}
    </button>
  );
};
```

### Enable/Disable Events

```typescript
const { setEventModeEnabled } = useEventModeStore();

// Enable event mode
setEventModeEnabled(true);

// Disable event mode
setEventModeEnabled(false);
```

### Per-Element Control

```typescript
const { 
  disableElementEvents, 
  enableElementEvents, 
  isElementEventsDisabled 
} = useEventModeStore();

// Disable events for specific element
disableElementEvents("element-123");

// Enable events for specific element
enableElementEvents("element-123");

// Check if element has events disabled
if (isElementEventsDisabled("element-123")) {
  console.log("Events are disabled for this element");
}
```

### Clearing Disabled Elements

```typescript
const { clearDisabledElements } = useEventModeStore();

// Clear all per-element disables
clearDisabledElements();
```

## Integration with Components

### Using in Editor Components

```typescript
"use client";

import React, { useEffect } from "react";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { EditorComponentProps } from "@/interfaces/editor.interface";

const ButtonComponent = ({ element }: EditorComponentProps) => {
  const {
    elementRef,
    registerEvents,
    createEventHandlers,
    eventsActive, // Check if events are active
  } = useElementEvents({
    elementId: element.id,
  });

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();

  return (
    <button
      ref={elementRef}
      {...eventHandlers}
      className={eventsActive ? "cursor-pointer" : "cursor-grab"}
    >
      {element.content}
    </button>
  );
};

export default ButtonComponent;
```

### Conditional Behavior

```typescript
const MyComponent = ({ element }: EditorComponentProps) => {
  const { eventsActive, createEventHandlers } = useElementEvents({
    elementId: element.id,
  });

  const handlers = createEventHandlers();

  // Show different cursor based on event mode
  const cursorStyle = eventsActive ? "pointer" : "grab";

  return (
    <div style={{ cursor: cursorStyle }} {...handlers}>
      {element.content}
    </div>
  );
};
```

## How It Works

### Event Flow Diagram

```
User Interaction (Click, Hover, etc.)
        ↓
useElementEvents Hook
        ↓
Check: shouldEventsBeActive?
        ├─ Is global event mode enabled?
        ├─ Are events disabled for this element?
        └─ Is there an override?
        ↓
    YES → eventExecutor.execute()
    NO  → Return (skip processing)
        ↓
Execute Event Handler
        ↓
Perform Action (navigate, show/hide, etc.)
```

### State Persistence

The event mode state persists across page reloads using Zustand's persist middleware:

- Stored in `localStorage` under key `event-mode-store`
- Set is serialized/deserialized to/from JSON arrays
- Automatically restored when store initializes

## Workflow

### Typical Editor Session

1. **Start in Edit Mode (Events OFF)**
   - User can select, drag, and edit elements normally
   - Events don't interfere with editor operations

2. **Preview Events (Toggle Events ON)**
   - User switches to Event Mode
   - Click elements to test their configured events
   - Buttons trigger navigations, hover effects activate, etc.

3. **Back to Editing (Toggle Events OFF)**
   - User switches back to Edit Mode
   - Resumes normal editing tasks
   - Events are no longer active

### Per-Element Disable Use Case

Sometimes you might want to disable events for specific elements:

```typescript
const { toggleElementEvents } = useEventModeStore();

// User right-clicks element → "Disable Events"
toggleElementEvents(elementId);

// Or programmatically
disableElementEvents("modal-backdrop");
enableElementEvents("modal-content-button");
```

## API Reference

### useEventModeStore()

#### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `isEventModeEnabled` | boolean | Global event mode state |
| `disabledElementEvents` | Set<string> | Set of element IDs with disabled events |

#### Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `setEventModeEnabled` | enabled: boolean | void | Set global event mode |
| `toggleEventMode` | none | void | Toggle global event mode |
| `disableElementEvents` | elementId: string | void | Disable events for element |
| `enableElementEvents` | elementId: string | void | Enable events for element |
| `toggleElementEvents` | elementId: string | void | Toggle events for element |
| `isElementEventsDisabled` | elementId: string | boolean | Check if element has events disabled |
| `clearDisabledElements` | none | void | Clear all per-element disables |

### useElementEvents() Options

#### New Options

```typescript
interface UseElementEventsOptions {
  elementId: string;
  onStateChange?: (newState: Record<string, any>) => void;
  globalState?: Record<string, any>;
  enableEventsOverride?: boolean; // Force enable events for this element
}
```

#### New Return Values

```typescript
{
  // Existing returns...
  elementRef,
  registerEvents,
  createEventHandlers,
  updateState,
  getState,
  state,

  // New returns
  eventsActive: boolean;           // Whether events are currently active
  isEventModeEnabled: boolean;     // Global event mode state
  enableEvents: () => void;        // Enable events for this element
  disableEvents: () => void;       // Disable events for this element
  areEventsEnabled: () => boolean; // Check if events are enabled
}
```

## Best Practices

### 1. Add Toggle to Toolbar

Place the EventModeToggle in your editor's top toolbar:

```typescript
import { EventModeToggle } from "@/components/editor/eventmode/EventModeToggle";

export const EditorToolbar = () => {
  return (
    <div className="flex items-center gap-2 p-2 border-b">
      {/* Other toolbar items */}
      <EventModeToggle />
    </div>
  );
};
```

### 2. Visual Feedback

Show users which mode they're in:

```typescript
const { isEventModeEnabled } = useEventModeStore();

return (
  <div className={isEventModeEnabled ? "bg-blue-100" : "bg-gray-100"}>
    Mode: {isEventModeEnabled ? "Event Testing" : "Edit Mode"}
  </div>
);
```

### 3. Keyboard Shortcut

Add a keyboard shortcut for quick toggling:

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl/Cmd + E to toggle event mode
    if ((e.ctrlKey || e.metaKey) && e.key === "e") {
      e.preventDefault();
      toggleEventMode();
    }
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, []);
```

### 4. Document for Users

Add a help tooltip:

```typescript
<Tooltip>
  <TooltipTrigger>
    <EventModeToggle />
  </TooltipTrigger>
  <TooltipContent>
    <p>Toggle between Edit Mode and Event Mode</p>
    <p className="text-xs text-muted-foreground">Edit Mode: Normal editing</p>
    <p className="text-xs text-muted-foreground">Event Mode: Test event handlers</p>
    <p className="text-xs text-muted-foreground">Keyboard: Ctrl/Cmd + E</p>
  </TooltipContent>
</Tooltip>
```

## Debugging

### Enable Debug Logging

Set `NODE_ENV=development` to see debug logs:

```typescript
// useElementEvents.ts automatically logs:
// Element {elementId}: Event mode enabled/disabled
// With details about disabled status and processing
```

### Check State

```typescript
const store = useEventModeStore.getState();
console.log({
  eventModeEnabled: store.isEventModeEnabled,
  disabledElements: Array.from(store.disabledElementEvents),
  elementStatus: (id: string) => store.isElementEventsDisabled(id),
});
```

### Test Events

1. Turn Event Mode ON
2. Open DevTools Console
3. Click elements to see events fire
4. Check for errors in console

## Troubleshooting

### Events Not Firing

**Problem:** Clicked element but nothing happened

**Solutions:**
1. Check if Event Mode is ON (button should be blue)
2. Verify element has events configured
3. Check browser console for errors
4. Verify conditions are met (if event has conditions)

### Can't Select Elements

**Problem:** Clicking elements doesn't select them

**Solution:**
Event Mode is ON. Switch to Edit Mode (OFF) to select and edit elements.

### Events Interfering with Editing

**Problem:** Can't click to select elements, events keep triggering

**Solution:**
This shouldn't happen by design. Verify:
1. Event Mode toggle is working
2. Events are being registered correctly
3. Component is using the hook properly

### Persisted Wrong State

**Problem:** Event mode persisted from last session

**Solution:**
Clear localStorage:
```javascript
localStorage.removeItem("event-mode-store");
// Then reload page
```

## File References

| File | Purpose |
|------|---------|
| `src/globalstore/eventmodestore.ts` | Event mode state management |
| `src/hooks/editor/eventworkflow/useElementEvents.ts` | Event hook with mode integration |
| `src/components/editor/eventmode/EventModeToggle.tsx` | UI component for toggling |
| `src/lib/events/eventExecutor.ts` | Event execution engine |
| `docs/EVENT_MODE_TOGGLE.md` | This documentation |

## Examples

### Example 1: Complete Integration

```typescript
"use client";

import React, { useEffect } from "react";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { useEventModeStore } from "@/globalstore/eventmodestore";
import { EditorComponentProps } from "@/interfaces/editor.interface";

const ButtonComponent = ({ element }: EditorComponentProps) => {
  const {
    elementRef,
    registerEvents,
    createEventHandlers,
    eventsActive,
  } = useElementEvents({
    elementId: element.id,
  });

  const { isEventModeEnabled } = useEventModeStore();

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();

  return (
    <button
      ref={elementRef}
      {...eventHandlers}
      className={`
        px-4 py-2 rounded
        ${eventsActive ? "cursor-pointer" : "cursor-grab"}
        ${isEventModeEnabled ? "opacity-100" : "opacity-90"}
        transition-opacity
      `}
      style={{
        userSelect: eventsActive ? "auto" : "none",
      }}
    >
      {element.content}
    </button>
  );
};

export default ButtonComponent;
```

### Example 2: Toolbar Integration

```typescript
import { EventModeToggle } from "@/components/editor/eventmode/EventModeToggle";
import { useEventModeStore } from "@/globalstore/eventmodestore";

export const EditorToolbar = () => {
  const { isEventModeEnabled } = useEventModeStore();

  return (
    <div className="flex items-center justify-between p-2 border-b bg-background">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold">Editor</h2>
        <span className="text-xs px-2 py-1 rounded bg-muted">
          {isEventModeEnabled ? "🎯 Event Mode" : "✏️ Edit Mode"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Other toolbar items */}
        <EventModeToggle />
      </div>
    </div>
  );
};
```

## Migration Guide

If you're updating existing components to support event mode:

### Before

```typescript
const MyComponent = ({ element }: EditorComponentProps) => {
  return <div {...getCommonProps(element)}>{content}</div>;
};
```

### After

```typescript
const MyComponent = ({ element }: EditorComponentProps) => {
  const { elementRef, registerEvents, createEventHandlers } = 
    useElementEvents({ elementId: element.id });

  useEffect(() => {
    if (element.events) registerEvents(element.events);
  }, [element.events, registerEvents]);

  return (
    <div 
      ref={elementRef} 
      {...createEventHandlers()}
      {...getCommonProps(element)}
    >
      {content}
    </div>
  );
};
```

## Summary

The Event Mode Toggle provides a clean separation between:
- **Edit Mode** - For creating and arranging layouts
- **Event Mode** - For testing event-driven interactions

This prevents events from interfering with normal editor operations while still allowing you to preview how your events work before publishing.

Start using it today by adding `<EventModeToggle />` to your editor toolbar!