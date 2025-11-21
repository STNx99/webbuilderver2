# Event Integration Guide for Editor Components

This guide shows you how to integrate event handlers into your existing editor components step by step.

## Overview

Every interactive element in your editor can have events attached to it. This guide walks through the process of adding event support to any component.

## Prerequisites

- Understanding of React hooks
- Familiarity with your component structure
- Basic knowledge of your event system

## Step-by-Step Integration

### Step 1: Import Required Dependencies

```typescript
import React, { useEffect } from "react";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { EditorComponentProps } from "@/interfaces/editor.interface";
```

### Step 2: Initialize the Hook

Inside your component function, initialize the `useElementEvents` hook:

```typescript
const MyComponent = ({ element }: EditorComponentProps) => {
  // Initialize the hook
  const {
    elementRef,
    registerEvents,
    createEventHandlers,
    getState,
    updateState,
    state,
  } = useElementEvents({
    elementId: element.id,
    globalState: {}, // Optional: pass global app state
  });

  // Rest of component...
};
```

### Step 3: Register Events in useEffect

Always register events when the element's events property changes:

```typescript
useEffect(() => {
  // Check if element has events defined
  if (element.events) {
    console.log("Registering events:", element.events);
    registerEvents(element.events);
  }
}, [element.events, registerEvents]);
```

### Step 4: Create Event Handlers

Create the event handlers object to spread on your JSX element:

```typescript
// Create handlers object for the JSX element
const eventHandlers = createEventHandlers();

// eventHandlers now contains:
// {
//   onClick: function,
//   onMouseEnter: function,
//   onChange: function,
//   // ... etc for all registered events
// }
```

### Step 5: Attach Ref and Handlers to JSX

Attach both the ref and the event handlers to your interactive element:

```typescript
<button
  ref={elementRef}           // Attach ref
  {...eventHandlers}         // Spread event handlers
  type="button"
  style={styles}
>
  {element.content}
</button>
```

## Complete Integration Example

### Before (Without Events)

```typescript
"use client";

import React from "react";
import DOMPurify from "isomorphic-dompurify";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ButtonElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const ButtonComponent = ({ element }: EditorComponentProps) => {
  const buttonElement = element as ButtonElement;
  const safeStyles = elementHelper.getSafeStyles(buttonElement);
  const commonProps = getCommonProps(buttonElement);

  return (
    <button
      {...commonProps}
      type="button"
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(element.content || ""),
      }}
    />
  );
};

export default ButtonComponent;
```

### After (With Events)

```typescript
"use client";

import React, { useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ButtonElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";

const ButtonComponent = ({ element }: EditorComponentProps) => {
  const buttonElement = element as ButtonElement;
  const safeStyles = elementHelper.getSafeStyles(buttonElement);
  const commonProps = getCommonProps(buttonElement);

  // Initialize event hook
  const { elementRef, registerEvents, createEventHandlers } = useElementEvents({
    elementId: element.id,
  });

  // Register events when they change
  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  // Create event handlers
  const eventHandlers = createEventHandlers();

  return (
    <button
      ref={elementRef}
      {...eventHandlers}
      {...commonProps}
      type="button"
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(element.content || ""),
      }}
    />
  );
};

export default ButtonComponent;
```

## Integration for Different Component Types

### Input Component

```typescript
"use client";

import React, { useEffect } from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { InputElement } from "@/interfaces/elements.interface";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const InputComponent = ({ element }: EditorComponentProps) => {
  const inputElement = element as InputElement;
  const safeStyles = elementHelper.getSafeStyles(inputElement);

  const { elementRef, registerEvents, createEventHandlers, getState } =
    useElementEvents({
      elementId: element.id,
    });

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();
  const inputValue = getState("value") || inputElement.settings?.defaultValue;

  return (
    <input
      ref={elementRef}
      {...eventHandlers}
      type={inputElement.settings?.type || "text"}
      placeholder={inputElement.settings?.placeholder}
      defaultValue={inputValue}
      style={safeStyles}
      required={inputElement.settings?.required}
    />
  );
};

export default InputComponent;
```

### Form Component

```typescript
"use client";

import React, { useEffect } from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { FormElement } from "@/interfaces/elements.interface";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const FormComponent = ({ element }: EditorComponentProps) => {
  const formElement = element as FormElement;
  const safeStyles = elementHelper.getSafeStyles(formElement);

  const {
    elementRef,
    registerEvents,
    createEventHandlers,
    getState,
    updateState,
  } = useElementEvents({
    elementId: element.id,
  });

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();
  const formState = getState();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Automatically update state when form inputs change
    const { name, value } = e.target;
    updateState(`formData.${name}`, value);
  };

  return (
    <form
      ref={elementRef}
      {...eventHandlers}
      style={safeStyles}
      method={formElement.settings?.method || "post"}
      action={formElement.settings?.action}
    >
      {element.elements?.map((child) => (
        <div key={child.id} onChange={handleFormChange}>
          {/* Render child elements */}
        </div>
      ))}
    </form>
  );
};

export default FormComponent;
```

### Section/Container Component

```typescript
"use client";

import React, { useEffect } from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { SectionElement } from "@/interfaces/elements.interface";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const SectionComponent = ({ element }: EditorComponentProps) => {
  const sectionElement = element as SectionElement;
  const safeStyles = elementHelper.getSafeStyles(sectionElement);

  const { elementRef, registerEvents, createEventHandlers } = useElementEvents({
    elementId: element.id,
  });

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();

  return (
    <section ref={elementRef} {...eventHandlers} style={safeStyles}>
      {element.elements?.map((child) => (
        <RenderElement key={child.id} element={child} />
      ))}
    </section>
  );
};

export default SectionComponent;
```

### Image Component

```typescript
"use client";

import React, { useEffect } from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ImageElement } from "@/interfaces/elements.interface";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const ImageComponent = ({ element }: EditorComponentProps) => {
  const imageElement = element as ImageElement;
  const safeStyles = elementHelper.getSafeStyles(imageElement);

  const { elementRef, registerEvents, createEventHandlers } = useElementEvents({
    elementId: element.id,
  });

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();
  const imageSettings = imageElement.settings || {};

  return (
    <img
      ref={elementRef}
      {...eventHandlers}
      src={imageElement.src}
      alt={imageElement.content}
      style={safeStyles}
      loading={imageSettings.loading}
      decoding={imageSettings.decoding}
      srcSet={imageSettings.srcset}
      sizes={imageSettings.sizes}
    />
  );
};

export default ImageComponent;
```

## Advanced Integration Patterns

### Pattern 1: Component with State Management

```typescript
"use client";

import React, { useEffect, useState } from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";

const AdvancedComponent = ({ element }: EditorComponentProps) => {
  const { elementRef, registerEvents, createEventHandlers, getState, updateState, state } =
    useElementEvents({
      elementId: element.id,
    });

  const [localState, setLocalState] = useState({
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  // Monitor state changes
  useEffect(() => {
    console.log("Element state updated:", state);
  }, [state]);

  const eventHandlers = createEventHandlers();

  return (
    <div ref={elementRef} {...eventHandlers}>
      {localState.isLoading && <p>Loading...</p>}
      {localState.error && <p>Error: {localState.error}</p>}
      {/* Content */}
    </div>
  );
};

export default AdvancedComponent;
```

### Pattern 2: Component with Error Handling

```typescript
"use client";

import React, { useEffect } from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { toast } from "sonner";

const RobustComponent = ({ element }: EditorComponentProps) => {
  const { elementRef, registerEvents, createEventHandlers } = useElementEvents({
    elementId: element.id,
  });

  useEffect(() => {
    try {
      if (element.events) {
        console.log("Registering events for element:", element.id);
        registerEvents(element.events);
      }
    } catch (error) {
      console.error("Error registering events:", error);
      toast.error("Failed to register event handlers");
    }
  }, [element.events, registerEvents, element.id]);

  const eventHandlers = createEventHandlers();

  return (
    <div ref={elementRef} {...eventHandlers}>
      {/* Content */}
    </div>
  );
};

export default RobustComponent;
```

### Pattern 3: Controlled Component with Events

```typescript
"use client";

import React, { useEffect } from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { InputElement } from "@/interfaces/elements.interface";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";

const ControlledInputComponent = ({ element }: EditorComponentProps) => {
  const inputElement = element as InputElement;

  const { elementRef, registerEvents, createEventHandlers, getState, updateState } =
    useElementEvents({
      elementId: element.id,
    });

  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();
  const value = getState("value") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState("value", e.target.value);
  };

  return (
    <input
      ref={elementRef}
      {...eventHandlers}
      type={inputElement.settings?.type || "text"}
      value={value}
      onChange={handleChange}
      placeholder={inputElement.settings?.placeholder}
    />
  );
};

export default ControlledInputComponent;
```

## Integration Checklist

For each component, ensure you:

- [ ] Import `useElementEvents` from `@/hooks/editor/eventworkflow/useElementEvents`
- [ ] Initialize the hook with `element.id`
- [ ] Add `useEffect` to register events when `element.events` changes
- [ ] Call `createEventHandlers()` to get event handler map
- [ ] Attach `ref={elementRef}` to the interactive element
- [ ] Spread `{...eventHandlers}` on the element
- [ ] Test that events are registered (check console)
- [ ] Test different event types (click, hover, change, etc.)
- [ ] Test with conditions and chained actions
- [ ] Verify state management works correctly

## Testing Your Integration

### Test 1: Verify Events are Registered

```typescript
useEffect(() => {
  console.log("Element events:", element.events);
  if (element.events) {
    console.log("Event types registered:", Object.keys(element.events));
  }
}, [element.events]);
```

### Test 2: Monitor Event Execution

```typescript
useEffect(() => {
  console.log("Element state:", state);
}, [state]);
```

### Test 3: Test with Browser DevTools

1. Open your browser's DevTools
2. Navigate to your editor
3. Click on an element that has events
4. Check the Console tab for any errors
5. Look for event handler logs

## Common Issues and Solutions

### Issue 1: Events Not Triggering

**Symptoms:** Click event doesn't execute

**Solutions:**
- Verify `ref={elementRef}` is attached to the element
- Verify `{...eventHandlers}` is spread on the element
- Check that `element.events` is defined
- Check browser console for errors

### Issue 2: State Not Updating

**Symptoms:** `getState()` returns undefined

**Solutions:**
- Verify you're calling `updateState()` correctly
- Check state path uses dot notation (e.g., `user.name`)
- Verify the useEffect dependency array includes all dependencies

### Issue 3: Handlers Not Firing

**Symptoms:** No console logs, events seem ignored

**Solutions:**
- Check if events are registered: `console.log(element.events)`
- Verify element type supports the event type
- Check for CSS `pointer-events: none` preventing clicks
- Verify handler conditions aren't preventing execution

### Issue 4: Ref-Related Errors

**Symptoms:** "Ref is not defined" or similar errors

**Solutions:**
- Ensure you're destructuring `elementRef` from `useElementEvents`
- Verify the ref is attached to a DOM element, not a component
- Check that the ref isn't being overwritten elsewhere

## Performance Considerations

### Use Dependency Array Carefully

```typescript
// Good: Only register when events change
useEffect(() => {
  if (element.events) {
    registerEvents(element.events);
  }
}, [element.events, registerEvents]); // Include both dependencies

// Bad: Registering on every render
useEffect(() => {
  if (element.events) {
    registerEvents(element.events);
  }
}); // Missing dependency array
```

### Memoize Event Handlers If Needed

```typescript
const eventHandlers = useMemo(() => createEventHandlers(), [createEventHandlers]);
```

## Next Steps

1. Choose a component to integrate
2. Follow the step-by-step guide above
3. Test your implementation
4. Iterate on other components
5. Use the workflow editor for complex workflows

## Resources

- Event Types: `src/constants/events.ts`
- Event Interfaces: `src/interfaces/events.interface.ts`
- Event Executor: `src/lib/events/eventExecutor.ts`
- Hook Implementation: `src/hooks/editor/eventworkflow/useElementEvents.ts`
- Examples: `src/components/editor/editorcomponents/`

## Getting Help

If you run into issues:

1. Check the browser console for error messages
2. Review `EVENTS_IMPLEMENTATION_GUIDE.md` for detailed docs
3. Check `EVENTS_QUICK_REFERENCE.md` for common patterns
4. Look at existing component examples in `editorcomponents/`
5. Verify event configuration in the workflow editor

---

**Good luck with your integration! 🚀**