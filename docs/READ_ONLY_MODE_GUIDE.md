# Read-Only & Locked Editor Mode Implementation Guide

## Overview

This guide explains how to use the read-only and locked editor modes to prevent users from dragging, dropping, deleting, creating, or modifying elements in your web builder application.

## Features

The read-only and locked modes prevent:
- ✅ Dragging and dropping elements
- ✅ Creating new elements
- ✅ Deleting elements
- ✅ Cutting/pasting elements
- ✅ Reordering elements (bring to front, send to back)
- ✅ Resizing elements
- ✅ Editing element content
- ✅ All keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+X, Delete, etc.)
- ✅ Right-click context menu modifications

## Implementation Details

### Files Modified

1. **`src/providers/EditorStateProvider.tsx`** - New file
   - Context provider for managing global editor state
   - Manages `isReadOnly` and `isLocked` states

2. **`src/hooks/editor/useEditor.ts`**
   - Added permission checks using `useEditorPermissions`
   - Added guards in `handleDrop`, `handleDragOver`, and `addNewSection`
   - Returns `isReadOnly`, `isLocked`, and permissions info

3. **`src/hooks/editor/useElementHandler.ts`**
   - Added `projectId`, `isReadOnly`, and `isLocked` parameters
   - Guards in all drag/drop/create/delete handlers
   - Exports permission states for UI purposes

4. **`src/lib/utils/element/keyBoardEvents.ts`**
   - Added `setReadOnly()` and `setLocked()` methods
   - Prevents delete, cut, paste, reorder operations
   - Shows toast notifications for blocked operations

5. **`src/components/editor/editor/EditorCanvas.tsx`**
   - Accepts `isReadOnly` and `isLocked` props
   - Passes states to keyboard event handler
   - Disables "Add new section" button in read-only mode

6. **`src/components/editor/ElementLoader.tsx`**
   - Accepts `isReadOnly` and `isLocked` props
   - Prevents drop operations and element creation
   - Passes states to ResizeHandler and EditorContextMenu

7. **`src/components/editor/EditorContextMenu.tsx`**
   - Accepts `isReadOnly` and `isLocked` props
   - Disables context menu items based on permissions
   - Shows visual feedback (opacity) for disabled items

8. **`src/components/editor/resizehandler/ResizeHandler.tsx`**
   - Accepts `isReadOnly` and `isLocked` props
   - Hides resize handles when in read-only mode
   - Prevents resize operations

9. **`src/hooks/editor/useResizeHandler.ts`**
   - Added `enabled` parameter to `UseResizeHandlerProps`
   - Guards `handleResizeStart` with enabled check

10. **`src/app/(routes)/(protected)/editor/[id]/editor.tsx`**
    - Passes `isReadOnly` and `isLocked` to EditorCanvas

## Usage

### Option 1: Using Permissions System (Recommended)

The system automatically checks user permissions via `useEditorPermissions`. If a user doesn't have permission to edit elements, the editor becomes read-only:

```typescript
// In your editor component
const { isReadOnly, permissions } = useEditor(id, pageId);

// isReadOnly will be true if:
// - User lacks ELEMENT_EDIT permission
// - Or isReadOnly option is explicitly passed as true
```

### Option 2: Using EditorStateProvider

Wrap your editor with `EditorStateProvider` to manage read-only state globally:

```typescript
import { EditorStateProvider } from "@/providers/EditorStateProvider";

export default function EditorPage() {
  return (
    <EditorStateProvider initialReadOnly={false} initialLocked={false}>
      <Editor id={id} pageId={pageId} />
    </EditorStateProvider>
  );
}
```

Access the state in any component:

```typescript
import { useEditorState } from "@/providers/EditorStateProvider";

export function SomeComponent() {
  const { isReadOnly, isLocked, setIsReadOnly, setIsLocked } = useEditorState();

  return (
    <button onClick={() => setIsReadOnly(!isReadOnly)}>
      Toggle Read-Only Mode
    </button>
  );
}
```

### Option 3: Passing Options to useEditor

```typescript
import { useEditor } from "@/hooks";

export default function Editor({ id, pageId }) {
  const editorProps = useEditor(id, pageId, {
    enableCollab: true,
    isReadOnly: true,      // Force read-only
    isLocked: false,       // Allow view but no edits
  });

  // ...
}
```

### Option 4: Using useElementHandler with Restrictions

```typescript
import { useElementHandler } from "@/hooks";

export function MyComponent() {
  const handler = useElementHandler(
    projectId,
    true,    // isReadOnly
    false    // isLocked
  );

  // handler.canDrag, handler.canDelete, handler.canCreate, handler.canReorder
  // will be false when restricted
}
```

## Permission-Based Access Control

The system integrates with your existing `useEditorPermissions` hook. Set the following permissions to control access:

```typescript
// From useEditorPermissions
const permissions = {
  canCreateElements: false,  // Prevent creating new elements
  canEditElements: false,    // Prevent editing (makes editor read-only)
  canDeleteElements: false,  // Prevent deletion
  canReorderElements: false, // Prevent reordering (bring to front, send to back)
};
```

## User Feedback

All blocked operations show toast notifications:

```typescript
// Examples of toast messages:
"Cannot add elements - editor is in read-only mode"
"Cannot delete elements - editor is in read-only mode"
"Cannot reorder elements - editor is in read-only mode"
"Cannot edit elements - editor is in read-only mode"
```

## Visual Indicators

When in read-only mode:
- **Resize handles** are hidden
- **"Add new section" button** is disabled
- **Context menu items** are disabled with reduced opacity
- **Draggable elements** have `draggable={false}`
- **Contenteditable elements** cannot be edited

## Keyboard Shortcuts Blocked

When read-only or locked:
- `Delete` - Cannot delete elements
- `Ctrl+X` / `Cmd+X` - Cannot cut
- `Ctrl+V` / `Cmd+V` - Cannot paste
- `Ctrl+C` / `Cmd+C` - Can copy (read-only access)
- `Ctrl+Z` / `Cmd+Z` - Cannot undo
- `Ctrl+Y` / `Cmd+Y` - Cannot redo
- `Ctrl+↑` / `Cmd+↑` - Cannot bring to front
- `Ctrl+↓` / `Cmd+↓` - Cannot send to back

## Context Menu in Read-Only Mode

When read-only, the right-click context menu shows:
- ✅ Copy (enabled - for reference)
- ❌ Cut (disabled)
- ❌ Paste (disabled)
- ❌ Bring to Front (disabled)
- ❌ Send to Back (disabled)
- ❌ Save Element (disabled)
- ❌ Delete (disabled)

## Example: Creating a View-Only Mode

```typescript
import { EditorStateProvider } from "@/providers/EditorStateProvider";
import Editor from "@/app/(routes)/(protected)/editor/[id]/editor";

export default function ViewOnlyEditorPage({ id, pageId }) {
  return (
    <EditorStateProvider 
      initialReadOnly={true}
      initialLocked={false}
    >
      <div className="flex flex-col gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm font-medium">
            📋 View-Only Mode: You can view this project but cannot make changes
          </p>
        </div>
        <Editor id={id} pageId={pageId} />
      </div>
    </EditorStateProvider>
  );
}
```

## Example: Toggle Read-Only Mode

```typescript
import { useEditorState } from "@/providers/EditorStateProvider";
import { Eye, EyeOff } from "lucide-react";

export function EditorToolbar() {
  const { isReadOnly, setIsReadOnly } = useEditorState();

  return (
    <button
      onClick={() => setIsReadOnly(!isReadOnly)}
      className="flex items-center gap-2"
    >
      {isReadOnly ? (
        <>
          <Eye className="w-4 h-4" />
          View Only
        </>
      ) : (
        <>
          <EyeOff className="w-4 h-4" />
          Editing
        </>
      )}
    </button>
  );
}
```

## Example: Conditional Editing Based on User Role

```typescript
import { useEditorPermissions } from "@/hooks/editor/useEditorPermissions";
import { useEditor } from "@/hooks";

export default function ProjectEditor({ projectId, pageId }) {
  const permissions = useEditorPermissions(projectId);
  
  const editorOptions = {
    enableCollab: true,
    // Automatically set read-only if user lacks edit permissions
    isReadOnly: !permissions.canEditElements,
  };

  const editor = useEditor(projectId, pageId, editorOptions);

  return (
    <div>
      {!permissions.canEditElements && (
        <div className="bg-yellow-100 p-3 mb-4 rounded">
          <p className="text-sm">
            You don't have permission to edit this project
          </p>
        </div>
      )}
      <Editor 
        id={projectId} 
        pageId={pageId}
        isReadOnly={editor.isReadOnly}
        isLocked={editor.isLocked}
      />
    </div>
  );
}
```

## API Reference

### EditorStateProvider

```typescript
interface EditorStateProviderProps {
  children: React.ReactNode;
  initialReadOnly?: boolean;      // Default: false
  initialLocked?: boolean;        // Default: false
}
```

### useEditorState

```typescript
interface EditorStateContextType {
  isReadOnly: boolean;
  isLocked: boolean;
  setIsReadOnly: (value: boolean) => void;
  setIsLocked: (value: boolean) => void;
}
```

### useEditor Options

```typescript
interface UseEditorOptions {
  enableCollab?: boolean;
  collabWsUrl?: string;
  userId?: string;
  isReadOnly?: boolean;           // Override read-only state
  isLocked?: boolean;             // Override locked state
}
```

### useElementHandler Parameters

```typescript
function useElementHandler(
  projectId?: string,
  isReadOnly?: boolean,
  isLocked?: boolean
)
```

Returns:
```typescript
{
  canDrag: boolean;
  canDelete: boolean;
  canCreate: boolean;
  canReorder: boolean;
  // ... other handler methods
}
```

## Troubleshooting

### Elements still draggable in read-only mode

**Solution:** Ensure you're passing `isReadOnly` prop through the component chain:
```typescript
<EditorCanvas
  // ... other props
  isReadOnly={isReadOnly}
  isLocked={isLocked}
/>
```

### Context menu still shows delete option

**Solution:** Update EditorContextMenu with read-only props:
```typescript
<EditorContextMenu
  element={element}
  isReadOnly={isReadOnly}
  isLocked={isLocked}
>
```

### Delete key still works

**Solution:** Ensure EditorCanvas passes states to KeyboardEvent:
```typescript
useEffect(() => {
  keyboardEvent.setReadOnly(isReadOnly);
  keyboardEvent.setLocked(isLocked);
}, [isReadOnly, isLocked, keyboardEvent]);
```

### Resize handles still visible

**Solution:** Pass read-only props to ResizeHandler:
```typescript
<ResizeHandler
  element={element}
  isReadOnly={isReadOnly}
  isLocked={isLocked}
>
```

## Best Practices

1. **Use Permissions System**: Rely on `useEditorPermissions` for access control rather than hardcoding flags
2. **Provide User Feedback**: Show informative messages when operations are blocked
3. **Layered Security**: Combine read-only mode with backend permission checks
4. **Clear Visual Indicators**: Disable UI elements when not available
5. **Test Thoroughly**: Verify all input methods are blocked (keyboard, mouse, context menu)
6. **Document State**: Make it clear to users when they're in read-only mode

## Performance Considerations

- Permission checks are memoized to prevent unnecessary re-renders
- Guards short-circuit early to prevent unnecessary operations
- Toast notifications are rate-limited by the Sonner library

## Migration from Old System

If you previously used a different read-only implementation:

1. Replace custom state management with `EditorStateProvider`
2. Update permission checks to use `useEditorPermissions`
3. Pass `isReadOnly` and `isLocked` through component props
4. Remove old keyboard event blocking code (now handled internally)
5. Test all editor operations (drag, drop, delete, create, resize)
