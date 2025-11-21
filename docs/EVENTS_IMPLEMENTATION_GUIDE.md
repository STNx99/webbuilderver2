# Event System Implementation Guide

This guide explains how to implement events and workflows in your Web Builder editor components.

## Table of Contents

1. [Event System Overview](#event-system-overview)
2. [Architecture](#architecture)
3. [Implementing Events in Components](#implementing-events-in-components)
4. [Event Workflow System](#event-workflow-system)
5. [Examples](#examples)
6. [Best Practices](#best-practices)

---

## Event System Overview

Your event system has three main layers:

### 1. **Events** - User interactions
- Click, Double Click, Mouse Enter/Leave, Focus, Blur, Change, etc.
- Defined in `src/constants/events.ts`

### 2. **Actions** - What happens when an event occurs
- Navigate, Show/Hide Elements, API Calls, Play Animations, etc.
- Configured in `src/interfaces/events.interface.ts`

### 3. **Workflows** - Visual workflow builder
- Build complex workflows with triggers, conditions, and actions
- Located in `src/components/editor/sidebar/eventworkflow/`

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│          User Interaction (Click, etc.)         │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│      useElementEvents Hook (in component)       │
│  - Registers events for elements               │
│  - Creates React event handlers                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         eventExecutor.execute()                 │
│  - Checks conditions                           │
│  - Executes actions                            │
│  - Handles chaining                            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│     Action Handlers (navigate, setData, etc.)   │
│  - Perform the actual action                   │
│  - Update DOM or call APIs                     │
└─────────────────────────────────────────────────┘
```

---

## Implementing Events in Components

### Step 1: Import the Hook

```typescript
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { EVENT_TYPES } from "@/constants/events";
```

### Step 2: Initialize the Hook

```typescript
const MyComponent = ({ element }: EditorComponentProps) => {
  const {
    elementRef,
    registerEvents,
    createEventHandlers,
    getState,
    updateState,
  } = useElementEvents({
    elementId: element.id,
    globalState: {}, // Optional global app state
  });

  // Register element's events
  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  // Create event handlers to attach to JSX
  const eventHandlers = createEventHandlers();

  return (
    <div
      ref={elementRef}
      {...eventHandlers}
      // other props
    />
  );
};
```

### Step 3: Available Event Handlers

```typescript
const eventHandlers = {
  onClick: (e) => { /* Triggered on click */ },
  onDoubleClick: (e) => { /* Triggered on double click */ },
  onMouseEnter: (e) => { /* Triggered when mouse enters */ },
  onMouseLeave: (e) => { /* Triggered when mouse leaves */ },
  onMouseDown: (e) => { /* Triggered when mouse down */ },
  onMouseUp: (e) => { /* Triggered when mouse up */ },
  onFocus: (e) => { /* Triggered on focus */ },
  onBlur: (e) => { /* Triggered on blur */ },
  onChange: (e) => { /* Triggered on change */ },
  onSubmit: (e) => { /* Triggered on submit */ },
  onKeyDown: (e) => { /* Triggered on key down */ },
  onKeyUp: (e) => { /* Triggered on key up */ },
  onScroll: (e) => { /* Triggered on scroll */ },
  onLoad: (e) => { /* Triggered on load */ },
  onError: (e) => { /* Triggered on error */ },
};
```

---

## Event Workflow System

### Components Overview

1. **EventWorkflowManagerDialog** - Main dialog for managing workflows
2. **WorkflowEditor** - Canvas-based visual editor
3. **WorkflowCanvas** - The drawing canvas with pan/zoom
4. **WorkflowNode** - Individual nodes (Trigger, Action, Condition, Output)
5. **ConnectionRenderer** - Renders connections between nodes

### Node Types

```typescript
enum NodeType {
  TRIGGER = "trigger",      // Event trigger (e.g., onClick)
  ACTION = "action",        // Action to perform (e.g., navigate)
  CONDITION = "condition",  // Conditional logic
  OUTPUT = "output",        // End point
}
```

### Workflow Structure

```typescript
interface WorkflowData {
  nodes: WorkflowNode[];
  connections: Connection[];
  metadata?: {
    name?: string;
    description?: string;
  };
}

interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  data: {
    label: string;
    description?: string;
    config: Record<string, any>;
  };
}

interface Connection {
  id: string;
  source: string;
  target: string;
}
```

---

## Examples

### Example 1: Button with Click Handler

```typescript
"use client";

import React, { useEffect } from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ButtonElement } from "@/interfaces/elements.interface";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import DOMPurify from "isomorphic-dompurify";

const ButtonComponent = ({ element }: EditorComponentProps) => {
  const buttonElement = element as ButtonElement;
  const {
    elementRef,
    registerEvents,
    createEventHandlers,
  } = useElementEvents({
    elementId: element.id,
  });

  // Register element's events
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
      type="button"
      style={getSafeStyles(element)}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(element.content || ""),
      }}
    />
  );
};

export default ButtonComponent;
```

### Example 2: Input with Change Event

```typescript
const InputComponent = ({ element }: EditorComponentProps) => {
  const inputElement = element as InputElement;
  const {
    elementRef,
    registerEvents,
    createEventHandlers,
    getState,
  } = useElementEvents({
    elementId: element.id,
  });

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();
  const inputState = getState();

  return (
    <input
      ref={elementRef}
      {...eventHandlers}
      type={inputElement.settings?.type || "text"}
      placeholder={inputElement.settings?.placeholder}
      defaultValue={inputElement.settings?.defaultValue}
      style={getSafeStyles(element)}
    />
  );
};

export default InputComponent;
```

### Example 3: Click Handler with Navigation

In the editor, you would set up an event handler like this:

```typescript
const clickHandler: EventHandler = {
  id: "handler-1",
  eventType: "onClick",
  actionType: "navigate",
  config: {
    type: "navigate",
    target: "url",
    value: "https://example.com",
    openInNewTab: true,
  },
};

// This gets attached to element.events
element.events = {
  onClick: [clickHandler],
};
```

### Example 4: Complex Workflow

Using the workflow editor UI:

1. Add a **Trigger** node: "onClick"
2. Add a **Condition** node: "Check if user is logged in"
3. Add **Action** node (true path): "Navigate to dashboard"
4. Add **Action** node (false path): "Show notification - Please log in"
5. Add **Output** nodes for completion

The system transforms this into executable handlers automatically.

---

## Available Actions

### Navigation Actions
```typescript
{
  type: "navigate",
  target: "url" | "page" | "external",
  value: "url-or-path",
  openInNewTab?: boolean,
  replaceHistory?: boolean,
}
```

### Element Visibility
```typescript
{
  type: "showElement" | "hideElement" | "toggleElement",
  elementId: "element-id",
  animationDuration?: number,
}
```

### API Calls
```typescript
{
  type: "apiCall",
  url: "https://api.example.com/endpoint",
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  headers?: { "Authorization": "Bearer token" },
  body?: { data: "..." },
  bodyType?: "json" | "formData",
  storeResponseAs?: "variableName",
  timeout?: 5000,
}
```

### Data Management
```typescript
{
  type: "setData",
  dataPath: "user.name",
  value: "John",
  valueType?: "static" | "dynamic" | "event",
  fromEvent?: "target.value" | "target.checked" | "target.files",
}
```

### Custom Code
```typescript
{
  type: "customCode",
  code: "console.log('Custom action'); return true;",
}
```

### Animations
```typescript
{
  type: "playAnimation",
  elementId: "element-id",
  animationType: "fadeIn" | "slideIn" | "bounce" | "pulse" | "shake" | "spin",
  duration?: 1000,
  delay?: 0,
}
```

### Form Actions
```typescript
{
  type: "submitForm" | "resetForm",
  formElementId?: "form-id",
}
```

### Notifications
```typescript
{
  type: "showNotification",
  message: "Success!",
  notificationType?: "success" | "error" | "info" | "warning",
  duration?: 3000,
}
```

### Scroll
```typescript
{
  type: "scrollTo",
  target: "elementId" | "position",
  value: "element-id" | 500,
  behavior?: "smooth" | "auto",
  offsetY?: 0,
}
```

### Clipboard
```typescript
{
  type: "copyToClipboard",
  text: "Text to copy",
  successMessage?: "Copied!",
}
```

### File Download
```typescript
{
  type: "downloadFile",
  url: "https://example.com/file.pdf",
  filename?: "downloaded-file.pdf",
}
```

### CSS Classes
```typescript
{
  type: "addClass" | "removeClass" | "toggleClass",
  elementId: "element-id",
  className: "active",
}
```

---

## Conditions

Events can have conditions that must be met before actions execute:

```typescript
interface EventCondition {
  id: string;
  type: "stateEquals" | "stateCheck" | "customCode" | "always";
  left?: string;
  operator?: "==" | "!=" | ">" | "<" | ">=" | "<=" | "includes" | "notIncludes";
  right?: any;
  customCode?: string;
}
```

### Examples

```typescript
// Always execute
{ type: "always" }

// State check
{
  type: "stateCheck",
  left: "user.isAdmin",
  operator: "==",
  right: true,
}

// Custom code
{
  type: "customCode",
  customCode: "return element.clientWidth > 500;",
}
```

---

## Best Practices

### 1. Register Events in useEffect
```typescript
useEffect(() => {
  if (element.events) {
    registerEvents(element.events);
  }
}, [element.events, registerEvents]);
```

### 2. Use Proper Element References
Always attach `ref={elementRef}` to the element that will receive events.

### 3. Handle Async Actions
```typescript
const handler: EventHandler = {
  id: "async-handler",
  eventType: "onClick",
  actionType: "apiCall",
  delay: 200, // Add delay if needed
  config: {
    type: "apiCall",
    url: "...",
    method: "POST",
  },
};
```

### 4. Chain Actions
```typescript
const handler: EventHandler = {
  id: "main-handler",
  eventType: "onClick",
  actionType: "apiCall",
  config: { /* config */ },
  nextHandlers: [
    {
      id: "chained-handler",
      eventType: "onClick",
      actionType: "showNotification",
      config: { type: "showNotification", message: "Success!" },
    },
  ],
};
```

### 5. Stop Propagation When Needed
```typescript
const handler: EventHandler = {
  id: "handler",
  eventType: "onClick",
  actionType: "navigate",
  stopPropagation: true,
  preventDefault: true,
  config: { /* config */ },
};
```

### 6. Use State Management
```typescript
const { getState, updateState } = useElementEvents({
  elementId: element.id,
});

// Later...
updateState("formData", { name: "John", email: "john@example.com" });
const formData = getState("formData");
```

---

## Debugging

### 1. Check Event Registration
```typescript
useEffect(() => {
  console.log("Element events:", element.events);
}, [element.events]);
```

### 2. Monitor Handler Execution
The `eventExecutor` logs errors to the console:
```typescript
// In eventExecutor.ts
console.error("Error executing event handler:", error);
```

### 3. Validate Workflow
```typescript
import { WorkflowValidationService } from "@/services/workflow/WorkflowValidationService";

const validation = WorkflowValidationService.validateWorkflow(workflowData);
console.log("Validation:", validation);
```

### 4. Transform Workflow
```typescript
import { WorkflowTransformService } from "@/services/workflow/WorkflowTransformService";

const result = WorkflowTransformService.transform(workflowData);
console.log("Handlers:", result.handlers);
console.log("Errors:", result.errors);
```

---

## Integration Checklist

- [ ] Import `useElementEvents` hook
- [ ] Initialize hook with element ID
- [ ] Register element's events in useEffect
- [ ] Attach `ref` and event handlers to JSX element
- [ ] Test with simple click handler first
- [ ] Gradually add more complex actions
- [ ] Use workflow editor for visual workflow building
- [ ] Test conditions and chaining
- [ ] Debug with console logs if needed

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/constants/events.ts` | Event type constants and labels |
| `src/interfaces/events.interface.ts` | Event handler interfaces |
| `src/lib/events/eventExecutor.ts` | Action execution logic |
| `src/hooks/editor/eventworkflow/useElementEvents.ts` | Event registration hook |
| `src/components/editor/sidebar/eventworkflow/` | Workflow UI components |
| `src/services/workflow/WorkflowTransformService.ts` | Transform workflows to handlers |
| `src/services/workflow/WorkflowValidationService.ts` | Validate workflow structure |

---

## Next Steps

1. **Start Simple** - Implement click handlers first
2. **Add State** - Use `updateState` and `getState`
3. **Try Workflows** - Use the visual workflow editor
4. **Build Complex Flows** - Chain multiple actions with conditions
5. **Deploy** - Test in preview and production modes

---

For questions or issues, check the implementation examples in:
- `src/components/editor/editorcomponents/ButtonComponent.tsx`
- `src/components/editor/editorcomponents/InputComponent.tsx`
