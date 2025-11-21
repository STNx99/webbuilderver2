# Events Quick Reference Guide

A quick lookup guide for implementing events in Web Builder components.

## Quick Start

### 1. Basic Setup
```typescript
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { useEffect } from "react";

const MyComponent = ({ element }: EditorComponentProps) => {
  const { elementRef, registerEvents, createEventHandlers } = useElementEvents({
    elementId: element.id,
  });

  useEffect(() => {
    if (element.events) registerEvents(element.events);
  }, [element.events, registerEvents]);

  const handlers = createEventHandlers();

  return <div ref={elementRef} {...handlers} />;
};
```

### 2. With State Management
```typescript
const { elementRef, registerEvents, createEventHandlers, getState, updateState } = 
  useElementEvents({ elementId: element.id });

// Update state
updateState("count", 1);
updateState("user", { name: "John", email: "john@example.com" });

// Get state
const count = getState("count");
const allState = getState();
```

---

## Common Patterns

### Pattern 1: Click to Navigate
```typescript
const handler = {
  id: "nav-handler",
  eventType: "onClick",
  actionType: "navigate",
  config: {
    type: "navigate",
    target: "url",
    value: "https://example.com",
    openInNewTab: true,
  },
};

element.events = { onClick: [handler] };
```

### Pattern 2: Click to Show/Hide
```typescript
const handler = {
  id: "toggle-handler",
  eventType: "onClick",
  actionType: "toggleElement",
  config: {
    type: "toggleElement",
    elementId: "target-element-id",
    animationDuration: 300,
  },
};
```

### Pattern 3: Form Input with Change
```typescript
const handler = {
  id: "input-handler",
  eventType: "onChange",
  actionType: "setData",
  config: {
    type: "setData",
    dataPath: "formData.name",
    valueType: "event",
    fromEvent: "target.value",
  },
};

element.events = { onChange: [handler] };
```

### Pattern 4: API Call on Click
```typescript
const handler = {
  id: "api-handler",
  eventType: "onClick",
  actionType: "apiCall",
  config: {
    type: "apiCall",
    url: "https://api.example.com/data",
    method: "GET",
    storeResponseAs: "apiResponse",
  },
};
```

### Pattern 5: API Call with Error Handling
```typescript
const handler = {
  id: "api-with-error",
  eventType: "onClick",
  actionType: "apiCall",
  config: {
    type: "apiCall",
    url: "https://api.example.com/submit",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { name: "John", email: "john@example.com" },
    storeResponseAs: "result",
  },
};
```

### Pattern 6: Chained Actions
```typescript
const handler = {
  id: "main-handler",
  eventType: "onClick",
  actionType: "apiCall",
  config: {
    type: "apiCall",
    url: "https://api.example.com/submit",
    method: "POST",
  },
  nextHandlers: [
    {
      id: "success-notification",
      eventType: "onClick",
      actionType: "showNotification",
      config: {
        type: "showNotification",
        message: "Submitted successfully!",
        notificationType: "success",
        duration: 3000,
      },
    },
  ],
};
```

### Pattern 7: Conditional Execution
```typescript
const handler = {
  id: "conditional-handler",
  eventType: "onClick",
  actionType: "navigate",
  conditions: [
    {
      id: "cond-1",
      type: "stateCheck",
      left: "user.isLoggedIn",
      operator: "==",
      right: true,
    },
  ],
  config: {
    type: "navigate",
    target: "url",
    value: "https://example.com/dashboard",
  },
};
```

### Pattern 8: Custom Code Condition
```typescript
const handler = {
  id: "custom-cond",
  eventType: "onClick",
  actionType: "showNotification",
  conditions: [
    {
      id: "check-time",
      type: "customCode",
      customCode: "return new Date().getHours() >= 9 && new Date().getHours() <= 17;",
    },
  ],
  config: {
    type: "showNotification",
    message: "It's business hours!",
    notificationType: "info",
  },
};
```

### Pattern 9: Stop Propagation
```typescript
const handler = {
  id: "stop-prop",
  eventType: "onClick",
  actionType: "customCode",
  stopPropagation: true,
  preventDefault: true,
  config: {
    type: "customCode",
    code: "console.log('Clicked but not propagated');",
  },
};
```

### Pattern 10: Delayed Action
```typescript
const handler = {
  id: "delayed",
  eventType: "onClick",
  actionType: "showNotification",
  delay: 2000, // 2 seconds
  config: {
    type: "showNotification",
    message: "This appears after 2 seconds",
    notificationType: "info",
  },
};
```

### Pattern 11: Form Submission
```typescript
const handler = {
  id: "form-submit",
  eventType: "onClick",
  actionType: "submitForm",
  config: {
    type: "submitForm",
    formElementId: "my-form-id",
  },
};
```

### Pattern 12: Copy to Clipboard
```typescript
const handler = {
  id: "copy-handler",
  eventType: "onClick",
  actionType: "copyToClipboard",
  config: {
    type: "copyToClipboard",
    text: "Text to copy",
    successMessage: "Copied to clipboard!",
  },
};
```

### Pattern 13: Scroll to Element
```typescript
const handler = {
  id: "scroll-handler",
  eventType: "onClick",
  actionType: "scrollTo",
  config: {
    type: "scrollTo",
    target: "elementId",
    value: "section-id",
    behavior: "smooth",
    offsetY: -50,
  },
};
```

### Pattern 14: Play Animation
```typescript
const handler = {
  id: "animation-handler",
  eventType: "onClick",
  actionType: "playAnimation",
  config: {
    type: "playAnimation",
    elementId: "target-id",
    animationType: "fadeIn",
    duration: 1000,
    delay: 0,
  },
};
```

### Pattern 15: Toggle CSS Class
```typescript
const handler = {
  id: "class-toggle",
  eventType: "onClick",
  actionType: "toggleClass",
  config: {
    type: "toggleClass",
    elementId: "target-id",
    className: "active",
  },
};
```

### Pattern 16: Multi-event Handler
```typescript
element.events = {
  onClick: [
    {
      id: "click-1",
      eventType: "onClick",
      actionType: "showNotification",
      config: { /* config */ },
    },
  ],
  onMouseEnter: [
    {
      id: "hover-1",
      eventType: "onMouseEnter",
      actionType: "playAnimation",
      config: { /* config */ },
    },
  ],
  onMouseLeave: [
    {
      id: "leave-1",
      eventType: "onMouseLeave",
      actionType: "playAnimation",
      config: { /* config */ },
    },
  ],
};
```

### Pattern 17: Modal Open/Close
```typescript
const openHandler = {
  id: "open-modal",
  eventType: "onClick",
  actionType: "modal",
  config: {
    type: "modal",
    action: "open",
    modalId: "my-modal",
  },
};

const closeHandler = {
  id: "close-modal",
  eventType: "onClick",
  actionType: "modal",
  config: {
    type: "modal",
    action: "close",
    modalId: "my-modal",
  },
};
```

### Pattern 18: Download File
```typescript
const handler = {
  id: "download",
  eventType: "onClick",
  actionType: "downloadFile",
  config: {
    type: "downloadFile",
    url: "https://example.com/file.pdf",
    filename: "document.pdf",
  },
};
```

### Pattern 19: Custom Code Action
```typescript
const handler = {
  id: "custom-action",
  eventType: "onClick",
  actionType: "customCode",
  config: {
    type: "customCode",
    code: `
      console.log('Element clicked');
      const data = JSON.parse(localStorage.getItem('user') || '{}');
      return data;
    `,
  },
};
```

### Pattern 20: Dynamic Navigation
```typescript
const handler = {
  id: "dynamic-nav",
  eventType: "onClick",
  actionType: "customCode",
  config: {
    type: "customCode",
    code: `
      const userId = context.elementState.userId;
      window.location.href = '/user/' + userId;
    `,
  },
};
```

---

## Event Types Cheat Sheet

| Event | Trigger |
|-------|---------|
| `onClick` | Element clicked |
| `onDoubleClick` | Element double clicked |
| `onMouseEnter` | Mouse enters element |
| `onMouseLeave` | Mouse leaves element |
| `onMouseDown` | Mouse button pressed |
| `onMouseUp` | Mouse button released |
| `onChange` | Input/Select value changes |
| `onFocus` | Element gains focus |
| `onBlur` | Element loses focus |
| `onSubmit` | Form submitted |
| `onKeyDown` | Key pressed down |
| `onKeyUp` | Key released |
| `onScroll` | Element scrolled |
| `onLoad` | Element/Image loaded |
| `onError` | Error occurred |

---

## Action Types Cheat Sheet

| Action | Purpose |
|--------|---------|
| `navigate` | Go to URL or page |
| `showElement` | Show hidden element |
| `hideElement` | Hide element |
| `toggleElement` | Show/hide toggle |
| `apiCall` | Call API endpoint |
| `setData` | Update state/data |
| `customCode` | Execute custom code |
| `scrollTo` | Scroll to element/position |
| `modal` | Open/close modal |
| `submitForm` | Submit form |
| `resetForm` | Reset form fields |
| `playAnimation` | Play animation |
| `showNotification` | Show toast message |
| `copyToClipboard` | Copy text to clipboard |
| `downloadFile` | Download file |
| `toggleClass` | Toggle CSS class |
| `addClass` | Add CSS class |
| `removeClass` | Remove CSS class |

---

## Condition Types

| Type | Usage |
|------|-------|
| `always` | Always execute (no condition) |
| `stateEquals` | Check state equality |
| `stateCheck` | Complex state comparison |
| `customCode` | Execute code to check |

---

## Condition Operators

| Operator | Meaning |
|----------|---------|
| `==` | Equals |
| `!=` | Not equals |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater or equal |
| `<=` | Less or equal |
| `includes` | String contains |
| `notIncludes` | String doesn't contain |

---

## HTTP Methods

```
GET    - Fetch data
POST   - Create/Submit data
PUT    - Update entire resource
PATCH  - Partial update
DELETE - Remove resource
```

---

## Animation Types

```
fadeIn   - Fade in effect
slideIn  - Slide in effect
bounce   - Bounce effect
pulse    - Pulsing effect
shake    - Shake effect
spin     - Spinning effect
```

---

## Notification Types

```
success  - Success message
error    - Error message
info     - Information message
warning  - Warning message
```

---

## Tips & Tricks

### Tip 1: Getting Event Target Value
```typescript
// In onChange handler
config: {
  type: "setData",
  dataPath: "formData.email",
  valueType: "event",
  fromEvent: "target.value",  // Gets input.value
}
```

### Tip 2: Getting Multiple Values
```typescript
// Store event target as entire object
config: {
  type: "setData",
  dataPath: "formState",
  valueType: "event",
  fromEvent: "target.files",  // Gets file list
}
```

### Tip 3: Accessing Form Data
```typescript
const { getState } = useElementEvents({ elementId });
const formData = getState("formData");
// Returns: { email: "user@example.com", name: "John" }
```

### Tip 4: API Response Handling
```typescript
// Store API response
config: {
  type: "apiCall",
  url: "https://api.example.com/user",
  method: "GET",
  storeResponseAs: "userData",  // Stored in state
}

// Later retrieve it
const userData = getState("userData");
```

### Tip 5: Conditional Navigation
```typescript
// Only navigate if user is admin
conditions: [
  {
    type: "customCode",
    customCode: "return state.user?.role === 'admin';",
  },
],
config: {
  type: "navigate",
  target: "url",
  value: "/admin/dashboard",
}
```

### Tip 6: Debug State Changes
```typescript
const handler = {
  id: "debug",
  eventType: "onClick",
  actionType: "customCode",
  config: {
    type: "customCode",
    code: "console.log('Current state:', context.elementState);",
  },
};
```

### Tip 7: Multiple Handlers Same Event
```typescript
element.events = {
  onClick: [
    handler1,  // Executes first
    handler2,  // Executes after handler1
    handler3,  // Executes last
  ],
};
```

### Tip 8: Prevent Default Behavior
```typescript
config: {
  type: "navigate",
  target: "url",
  value: "/new-page",
},
preventDefault: true,  // Prevents link default behavior
```

---

## Complete Example: Todo App Click Handler

```typescript
const clickHandler = {
  id: "add-todo",
  eventType: "onClick",
  actionType: "apiCall",
  
  // Only execute if input is not empty
  conditions: [
    {
      type: "customCode",
      customCode: "return context.elementState.todoText?.trim().length > 0;",
    },
  ],
  
  // Prevent default and stop bubbling
  preventDefault: true,
  stopPropagation: true,
  
  // Chain multiple actions
  config: {
    type: "apiCall",
    url: "https://api.example.com/todos",
    method: "POST",
    body: { text: "state.todoText" },
    storeResponseAs: "newTodo",
  },
  
  // Then show notification
  nextHandlers: [
    {
      id: "show-success",
      eventType: "onClick",
      actionType: "showNotification",
      config: {
        type: "showNotification",
        message: "Todo added!",
        notificationType: "success",
        duration: 2000,
      },
      // Then clear input
      nextHandlers: [
        {
          id: "clear-input",
          eventType: "onClick",
          actionType: "setData",
          config: {
            type: "setData",
            dataPath: "todoText",
            value: "",
          },
        },
      ],
    },
  ],
};
```

---

## Debugging Checklist

- [ ] Is `elementRef` attached to the JSX element?
- [ ] Is `registerEvents()` called in useEffect?
- [ ] Are event handlers spread on the element (`{...handlers}`)?
- [ ] Does `element.events` have the correct structure?
- [ ] Check browser console for execution errors
- [ ] Verify element IDs are correct for show/hide/toggle
- [ ] Test conditions independently
- [ ] Check API endpoints are accessible
- [ ] Verify state paths use dot notation (e.g., `user.name`)

---

## Resources

- Full Guide: `docs/EVENTS_IMPLEMENTATION_GUIDE.md`
- Event Constants: `src/constants/events.ts`
- Event Executor: `src/lib/events/eventExecutor.ts`
- Hook: `src/hooks/editor/eventworkflow/useElementEvents.ts`
- Workflow System: `src/components/editor/sidebar/eventworkflow/`
