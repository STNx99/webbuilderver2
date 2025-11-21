# Event Mode Toggle - Quick Start Guide

Get up and running with the event mode toggle in 5 minutes.

## What Is It?

A button that turns events ON/OFF so they don't interfere with editing.

- **OFF** (default) = Normal editor (drag, select, edit)
- **ON** = Test your events (click handlers work)

## Installation (2 steps)

### Step 1: Import the Toggle

```typescript
import EventModeToggle from "@/components/editor/eventmode/EventModeToggle";
```

### Step 2: Add to Your Toolbar

```typescript
export function EditorToolbar() {
  return (
    <div className="toolbar">
      {/* Other toolbar items */}
      <EventModeToggle />  {/* Add here */}
    </div>
  );
}
```

Done! The button appears in your toolbar.

## Using It

1. **By Default**: Events are OFF ✓
   - You can drag elements normally
   - You can select elements by clicking
   - You can edit text

2. **Click the Button**: Toggle to ON
   - Button turns blue with Zap icon
   - Try clicking elements with events
   - Events execute normally

3. **Click Again**: Toggle back to OFF
   - Resume normal editing
   - No events fire

## That's It!

Your event mode toggle is ready to use. No other code changes needed.

## Components Still Need Events?

If your components aren't using events yet, they need the hook:

```typescript
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { useEffect } from "react";

const ButtonComponent = ({ element }: EditorComponentProps) => {
  const { elementRef, registerEvents, createEventHandlers } = 
    useElementEvents({ elementId: element.id });

  useEffect(() => {
    if (element.events) registerEvents(element.events);
  }, [element.events, registerEvents]);

  const handlers = createEventHandlers();

  return <button ref={elementRef} {...handlers} />;
};
```

## Advanced: Disable Events for Specific Elements

```typescript
import { useEventModeStore } from "@/globalstore/eventmodestore";

const { disableElementEvents, enableElementEvents } = useEventModeStore();

// Disable events on this element
disableElementEvents("element-id");

// Enable later
enableElementEvents("element-id");
```

## Troubleshooting

### Events not firing?
Check if the toggle button shows "Events On" (should be blue)

### Can't select elements?
You're probably in Event Mode. Click the toggle to turn it OFF.

### State not persisting?
The toggle state is saved automatically. If it doesn't persist, clear browser cache.

## Full Documentation

- `docs/EVENT_MODE_TOGGLE.md` - Complete feature guide
- `docs/EVENTS_IMPLEMENTATION_GUIDE.md` - How events work
- `docs/EVENTS_QUICK_REFERENCE.md` - Common patterns

## API Reference

### Store (useEventModeStore)

```typescript
const {
  isEventModeEnabled,           // Current state
  toggleEventMode,              // Toggle on/off
  setEventModeEnabled,          // Set explicitly
  disableElementEvents,         // Disable for element
  enableElementEvents,          // Enable for element
  isElementEventsDisabled,      // Check if disabled
  clearDisabledElements,        // Clear all disables
} = useEventModeStore();
```

### Hook (useElementEvents)

```typescript
const {
  elementRef,                   // Attach to element
  registerEvents,               // Register from element
  createEventHandlers,          // Get handlers
  eventsActive,                 // Current state
  enableEvents,                 // Enable for this element
  disableEvents,                // Disable for this element
  // ... other methods
} = useElementEvents({ elementId: element.id });
```

## Next Steps

1. ✅ Add the toggle to your toolbar
2. ✅ Make sure your components use `useElementEvents`
3. ✅ Configure events on elements via the UI
4. ✅ Toggle ON to test, OFF to edit
5. ✅ Deploy!

## Examples

### Example 1: Toggle Button in Toolbar

```typescript
import EventModeToggle from "@/components/editor/eventmode/EventModeToggle";

export const Toolbar = () => (
  <div className="flex gap-2 p-2 border-b">
    <button>Undo</button>
    <button>Redo</button>
    <div className="ml-auto">
      <EventModeToggle />
    </div>
  </div>
);
```

### Example 2: Show Mode Status

```typescript
import { useEventModeStore } from "@/globalstore/eventmodestore";

export const ModeIndicator = () => {
  const { isEventModeEnabled } = useEventModeStore();
  
  return (
    <span className="text-sm">
      {isEventModeEnabled ? "🎯 Event Mode" : "✏️ Edit Mode"}
    </span>
  );
};
```

### Example 3: Component with Events

```typescript
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";

const Button = ({ element }: EditorComponentProps) => {
  const {
    elementRef,
    registerEvents,
    createEventHandlers,
    eventsActive,
  } = useElementEvents({ elementId: element.id });

  useEffect(() => {
    if (element.events) registerEvents(element.events);
  }, [element.events, registerEvents]);

  return (
    <button
      ref={elementRef}
      {...createEventHandlers()}
      className={eventsActive ? "cursor-pointer" : "cursor-grab"}
    >
      {element.content}
    </button>
  );
};
```

## FAQ

**Q: Will this break existing code?**
A: No! It's backward compatible. Events default to OFF.

**Q: Can I have both edit and event mode?**
A: No by design. They're mutually exclusive to prevent confusion.

**Q: How do I remember which mode I'm in?**
A: The button changes color - Gray = OFF, Blue = ON

**Q: Can I disable events on just one element?**
A: Yes! Use `disableElementEvents(elementId)`

**Q: Does it save between sessions?**
A: Yes! The state persists to localStorage.

## Files Reference

```
src/globalstore/eventmodestore.ts ............. State management
src/components/editor/eventmode/EventModeToggle.tsx ... UI button
src/hooks/editor/eventworkflow/useElementEvents.ts ... Hook integration
docs/EVENT_MODE_TOGGLE.md .................... Full docs
```

## One More Thing

Remember: **Events are OFF by default**. This means they won't interfere with your editor.

When you're ready to test events, just click the toggle button!

Happy building! 🚀