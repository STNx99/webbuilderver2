# Implementation Summary: Read-Only & Locked Editor Mode

## Overview
Complete implementation of read-only and locked editor modes to prevent users from dragging, dropping, deleting, creating, or modifying elements in the web builder.

## Changes Applied

### 1. New Files Created

#### `src/providers/EditorStateProvider.tsx`
- Context provider for managing global editor state
- Provides `isReadOnly` and `isLocked` boolean states
- Includes `setIsReadOnly()` and `setIsLocked()` functions
- Can be wrapped around components that need read-only control

**Usage:**
```typescript
<EditorStateProvider initialReadOnly={false} initialLocked={false}>
  <YourComponent />
</EditorStateProvider>
```

---

### 2. Modified Files

#### `src/hooks/editor/useEditor.ts`
**Changes:**
- Added `UseEditorOptions` interface properties: `isReadOnly`, `isLocked`
- Imported `useEditorPermissions` hook
- Added permission checks using `useEditorPermissions(id)`
- Created derived states: `isReadOnly` and `isLocked`
- Added guards in `handleDrop()` to prevent element creation
- Added guards in `handleDragOver()` to prevent drag visualization
- Added guards in `addNewSection()` to prevent section creation
- Returns `isReadOnly`, `isLocked`, and permissions object
- Shows toast notifications when operations are blocked

**Export Changes:**
```typescript
return {
  // ... existing exports
  isReadOnly,
  isLocked,
  permissions: {
    canCreateElements,
    canEditElements,
    canDeleteElements,
    canReorderElements,
  },
}
```

---

#### `src/hooks/editor/useElementHandler.ts`
**Changes:**
- Added parameters: `projectId`, `isReadOnly`, `isLocked`
- Imported `useEditorPermissions` and `toast` from sonner
- Added permission state calculations: `canDrag`, `canDelete`, `canCreate`, `canReorder`
- Added guards in all handlers:
  - `handleDoubleClick()` - checks edit permissions
  - `handleDrop()` - checks drag/create/reorder permissions
  - `handleDragStart()` - checks drag permissions
  - `handleDragOver()` - checks drag permissions
  - `handleTextChange()` - checks edit permissions
- Updated `getCommonProps()` to:
  - Set `draggable={canDrag}` instead of hardcoded `true`
  - Set `contentEditable` with permission check
- Exports permission states for UI purposes

**Export Changes:**
```typescript
return {
  // ... existing exports
  canDrag,
  canDelete,
  canCreate,
  canReorder,
}
```

---

#### `src/lib/utils/element/keyBoardEvents.ts`
**Changes:**
- Added instance properties: `isReadOnly`, `isLocked`
- Added methods: `setReadOnly(value)`, `setLocked(value)`
- Imported `toast` from sonner
- Added guards in all keyboard event handlers:
  - `cutElement()` - checks if can delete
  - `pasteElement()` - checks if can edit
  - `bringToFront()` - checks if can reorder
  - `sendToBack()` - checks if can reorder
  - `deleteElement()` - checks if can delete
- Each blocked operation shows a toast notification

**Example:**
```typescript
public deleteElement = () => {
  if (this.isReadOnly || this.isLocked) {
    toast.error("Cannot delete elements - editor is in read-only mode", {
      duration: 2000,
    });
    return;
  }
  // ... existing delete logic
}
```

---

#### `src/components/editor/editor/EditorCanvas.tsx`
**Changes:**
- Added props: `isReadOnly?`, `isLocked?`
- Added `useEffect` to set read-only/locked state on keyboard event handler
- Disabled "Add new section" button when `isReadOnly || isLocked`
- Passes states to `ElementLoader`

**Component Props:**
```typescript
type EditorCanvasProps = {
  // ... existing props
  isReadOnly?: boolean;
  isLocked?: boolean;
}
```

---

#### `src/app/(routes)/(protected)/editor/[id]/editor.tsx`
**Changes:**
- Destructures `isReadOnly` and `isLocked` from `useEditor` hook
- Passes both props to `EditorCanvas` component

```typescript
<EditorCanvas
  // ... other props
  isReadOnly={isReadOnly}
  isLocked={isLocked}
/>
```

---

#### `src/components/editor/ElementLoader.tsx`
**Changes:**
- Added props: `isReadOnly?`, `isLocked?`
- Imported `useEditorPermissions` and `toast`
- Added permission calculations similar to useElementHandler
- Added guards in `handleHover()` - checks drag permissions
- Added guards in `handleDrop()` - checks drag/create permissions
- Passes states to `ResizeHandler` and `EditorContextMenu`

**Component Props:**
```typescript
interface ElementLoaderProps {
  elements?: EditorElement[];
  data?: any;
  isReadOnly?: boolean;
  isLocked?: boolean;
}
```

---

#### `src/components/editor/EditorContextMenu.tsx`
**Changes:**
- Added props: `isReadOnly?`, `isLocked?`
- Imported `useEditorPermissions` and `toast`
- Added permission calculations: `canEdit`, `canDelete`, `canReorder`
- Added guards in all context menu handlers:
  - `onCut()` - checks if can delete
  - `onPaste()` - checks if can edit
  - `onBringToFront()` - checks if can reorder
  - `onSendToBack()` - checks if can reorder
  - `onDelete()` - checks if can delete
  - `onSave()` - checks if can edit
- Added `disabled` attributes to menu items
- Added visual opacity feedback for disabled items (opacity-50)

**Menu Item Example:**
```typescript
<ContextMenuItem
  asChild
  disabled={!canDelete}
  onClick={(e) => {
    if (!canDelete) {
      e.preventDefault();
    }
  }}
>
  <div
    onClick={onDelete}
    className={`... ${!canDelete ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    Delete
  </div>
</ContextMenuItem>
```

---

#### `src/components/editor/resizehandler/ResizeHandler.tsx`
**Changes:**
- Added imports: `useEditorPermissions`
- Added props: `isReadOnly?`, `isLocked?`
- Added permission calculations: `canResize`
- Added `enabled: canResize` to `useResizeHandler` call
- Conditionally renders resize handles only when `isSelected && canResize`
- Passes states to child components through props

**Component Props:**
```typescript
interface ResizeHandlerProps {
  element: EditorElement;
  children: ReactNode;
  isReadOnly?: boolean;
  isLocked?: boolean;
}
```

---

#### `src/hooks/editor/useResizeHandler.ts`
**Changes:**
- Added `enabled?: boolean` to `UseResizeHandlerProps` interface
- Added `enabled = true` parameter to hook function
- Added guard in `handleResizeStart()`: `if (!enabled || !targetRef.current) return`
- This prevents any resize operations when disabled

**Interface Change:**
```typescript
interface UseResizeHandlerProps {
  element: EditorElement;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
}
```

---

## Permission Integration

All changes integrate with the existing `useEditorPermissions` hook which checks:
- `Permission.ELEMENT_CREATE` - for creating elements
- `Permission.ELEMENT_EDIT` - for editing elements
- `Permission.ELEMENT_DELETE` - for deleting elements
- `Permission.ELEMENT_REORDER` - for reordering elements

## User Feedback

All blocked operations show toast notifications with messages like:
- "Cannot add elements - editor is in read-only mode"
- "Cannot delete elements - editor is in read-only mode"
- "Cannot reorder elements - editor is in read-only mode"
- "Cannot edit elements - editor is in read-only mode"

## Visual Indicators

When in read-only/locked mode:
1. **Resize handles** are hidden
2. **"Add new section" button** is disabled
3. **Context menu items** are disabled with opacity-50
4. **Draggable elements** have `draggable={false}`
5. **Contenteditable elements** cannot be edited

## Blocked Operations

### Drag & Drop
- Prevented at canvas level (`handleDrop`, `handleDragOver`)
- Prevented at element level (`handleDragStart`, `handleDrop`)
- Prevented at loader level (`handleHover`, `handleDrop`)

### Keyboard Shortcuts
- `Delete` - Blocked by `keyboardEvent.deleteElement()`
- `Ctrl+X` - Blocked by `keyboardEvent.cutElement()`
- `Ctrl+V` - Blocked by `keyboardEvent.pasteElement()`
- `Ctrl+↑` - Blocked by `keyboardEvent.bringToFront()`
- `Ctrl+↓` - Blocked by `keyboardEvent.sendToBack()`

### Context Menu
- All modify operations (Cut, Paste, Delete, Bring to Front, Send to Back, Save) are disabled
- Only Copy remains enabled for reference

### Element Creation
- "Add new section" button disabled
- Drop zone blocked for new elements

### Element Modification
- Resize handles hidden
- Content editing disabled
- Context menu operations disabled

## Implementation Flow

```
Editor Component
    ↓
useEditor Hook (checks permissions, sets isReadOnly/isLocked)
    ↓
EditorCanvas (passes states to handlers)
    ↓
├─ ElementLoader (prevents drops, passes to ResizeHandler/ContextMenu)
│   ├─ ResizeHandler (hides resize handles if read-only)
│   │   └─ EditorContextMenu (disables menu items if read-only)
│   │       └─ Element Component
│   └─ (handles drops with permission checks)
│
└─ Keyboard Event Handler (blocks keyboard shortcuts if read-only)
```

## Usage Examples

### Example 1: Force Read-Only Mode
```typescript
const { ... } = useEditor(id, pageId, {
  isReadOnly: true,
  isLocked: false,
});
```

### Example 2: Check Before Rendering
```typescript
const permissions = useEditorPermissions(projectId);
if (!permissions.canEditElements) {
  // Show view-only mode
}
```

### Example 3: Toggle Mode Dynamically
```typescript
const { isReadOnly, setIsReadOnly } = useEditorState();

<button onClick={() => setIsReadOnly(!isReadOnly)}>
  Toggle Edit Mode
</button>
```

## Testing Checklist

- [ ] Drag & drop elements - should be blocked
- [ ] Delete element with Delete key - should be blocked
- [ ] Delete from context menu - should be blocked
- [ ] Cut element (Ctrl+X) - should be blocked
- [ ] Paste element (Ctrl+V) - should be blocked
- [ ] Create new section - button should be disabled
- [ ] Resize element - handles should be hidden
- [ ] Edit element text - should not be editable
- [ ] Bring to front - should be blocked
- [ ] Send to back - should be blocked
- [ ] Right-click context menu - should show disabled items
- [ ] Toast notifications - should appear for blocked operations

## Files Summary

| File | Type | Changes |
|------|------|---------|
| EditorStateProvider.tsx | New | Provider for global state |
| useEditor.ts | Modified | Permission checks, state management |
| useElementHandler.ts | Modified | Guard checks, permission calculations |
| keyBoardEvents.ts | Modified | Keyboard event blocking |
| EditorCanvas.tsx | Modified | State passing, button disabling |
| editor.tsx | Modified | State passing |
| ElementLoader.tsx | Modified | Drop prevention, state passing |
| EditorContextMenu.tsx | Modified | Menu item disabling, visual feedback |
| ResizeHandler.tsx | Modified | Handle hiding, state passing |
| useResizeHandler.ts | Modified | Resize prevention |

## Total Lines Changed

- **New code**: ~500 lines
- **Modified code**: ~200 lines
- **Guards/checks**: ~40+
- **Toast notifications**: ~15+

All changes are backward compatible and don't affect existing functionality when read-only mode is disabled.