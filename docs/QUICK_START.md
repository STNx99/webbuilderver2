# Quick Start: Read-Only & Locked Editor Mode

## 30-Second Setup

### 1. Basic Read-Only Mode
```typescript
// In your editor page component
import { useEditor } from "@/hooks";

export default function EditorPage({ id, pageId }) {
  const editor = useEditor(id, pageId, {
    isReadOnly: true,  // ← Add this line
  });

  // Component continues as normal...
}
```

### 2. Using Global State Provider
```typescript
import { EditorStateProvider } from "@/providers/EditorStateProvider";
import Editor from "@/app/(routes)/(protected)/editor/[id]/editor";

export default function ViewOnlyPage({ id, pageId }) {
  return (
    <EditorStateProvider initialReadOnly={true}>
      <Editor id={id} pageId={pageId} />
    </EditorStateProvider>
  );
}
```

### 3. Permission-Based (Automatic)
```typescript
// No changes needed! The system automatically checks permissions:
const editor = useEditor(id, pageId);
// If user lacks ELEMENT_EDIT permission, read-only is automatic
```

---

## What Gets Blocked?

✅ **All of these are prevented in read-only mode:**
- Dragging elements
- Dropping elements
- Deleting elements (Delete key or context menu)
- Creating new sections
- Cutting/pasting (Ctrl+X, Ctrl+V)
- Resizing elements
- Reordering (bring to front, send to back)
- Editing element content
- All keyboard shortcuts

✅ **User sees:**
- Toast notifications for blocked operations
- Disabled buttons and menu items
- Hidden resize handles
- Visual feedback (opacity-50 for disabled items)

---

## Toggle Read-Only Dynamically

```typescript
import { useEditorState } from "@/providers/EditorStateProvider";

export function EditModeToggle() {
  const { isReadOnly, setIsReadOnly } = useEditorState();

  return (
    <button
      onClick={() => setIsReadOnly(!isReadOnly)}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {isReadOnly ? "🔒 Read-Only" : "✏️ Editing"}
    </button>
  );
}
```

---

## View-Only Collaboration Page

```typescript
import { EditorStateProvider } from "@/providers/EditorStateProvider";

export default function CollaborativeViewPage({ projectId, pageId }) {
  return (
    <EditorStateProvider initialReadOnly={true}>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900">
            👁️ View-Only Mode
          </p>
          <p className="text-xs text-blue-700 mt-1">
            You can view this project but cannot make changes
          </p>
        </div>
        <Editor id={projectId} pageId={pageId} />
      </div>
    </EditorStateProvider>
  );
}
```

---

## Permission-Based Editing

```typescript
import { useEditorPermissions } from "@/hooks/editor/useEditorPermissions";

export default function ProjectEditor({ projectId, pageId }) {
  const permissions = useEditorPermissions(projectId);

  if (!permissions.canEditElements) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to edit this project
          </p>
        </div>
        <Editor id={projectId} pageId={pageId} />
      </div>
    );
  }

  return <Editor id={projectId} pageId={pageId} />;
}
```

---

## Common Patterns

### Pattern 1: Preview Mode
```typescript
// Show a read-only preview of the design
const isPreview = searchParams.get("preview") === "true";

const editor = useEditor(id, pageId, {
  isReadOnly: isPreview,
});
```

### Pattern 2: Client Review
```typescript
// Share with clients who should only view
const isClient = userRole === "CLIENT";

const editor = useEditor(id, pageId, {
  isReadOnly: isClient,
});
```

### Pattern 3: Template View
```typescript
// Show templates that can't be modified
const isTemplate = project.isTemplate;

const editor = useEditor(id, pageId, {
  isReadOnly: isTemplate,
});
```

### Pattern 4: Approval Mode
```typescript
// Show to approvers who can only comment, not edit
const isApprover = project.approvers.includes(userId);

const editor = useEditor(id, pageId, {
  isReadOnly: isApprover,
});
```

---

## Checking Permissions Programmatically

```typescript
import { useEditorPermissions } from "@/hooks/editor/useEditorPermissions";

export function FeatureGate({ projectId, children }) {
  const permissions = useEditorPermissions(projectId);

  return (
    <>
      {permissions.canCreateElements && (
        <button>Add Element</button>
      )}
      {permissions.canDeleteElements && (
        <button>Delete Element</button>
      )}
      {permissions.canEditElements && (
        <div>{children}</div>
      )}
    </>
  );
}
```

---

## Toast Notifications

Users automatically see messages when operations are blocked:

```
❌ "Cannot add elements - editor is in read-only mode"
❌ "Cannot delete elements - editor is in read-only mode"
❌ "Cannot reorder elements - editor is in read-only mode"
❌ "Cannot edit elements - editor is in read-only mode"
```

---

## Prop Passing Cheat Sheet

If you need to pass read-only state through custom components:

```typescript
// In Parent
<Editor
  id={id}
  pageId={pageId}
  isReadOnly={true}
  isLocked={false}
/>

// In EditorCanvas
<ElementLoader
  isReadOnly={isReadOnly}
  isLocked={isLocked}
/>

// In ElementLoader
<ResizeHandler
  element={element}
  isReadOnly={isReadOnly}
  isLocked={isLocked}
>
  <EditorContextMenu
    element={element}
    isReadOnly={isReadOnly}
    isLocked={isLocked}
  >
    {renderElement(element)}
  </EditorContextMenu>
</ResizeHandler>
```

---

## Troubleshooting

### Q: Elements are still draggable
**A:** Make sure you're passing `isReadOnly` through the entire component chain to `EditorCanvas`

### Q: Delete button still works
**A:** Verify the `KeyboardEvent` handler is receiving the state:
```typescript
useEffect(() => {
  keyboardEvent.setReadOnly(isReadOnly);
  keyboardEvent.setLocked(isLocked);
}, [isReadOnly, isLocked]);
```

### Q: Context menu shows all options
**A:** Pass `isReadOnly` to `EditorContextMenu`:
```typescript
<EditorContextMenu
  element={element}
  isReadOnly={isReadOnly}
  isLocked={isLocked}
/>
```

### Q: Resize handles still visible
**A:** Pass to `ResizeHandler`:
```typescript
<ResizeHandler
  element={element}
  isReadOnly={isReadOnly}
  isLocked={isLocked}
/>
```

---

## API Cheat Sheet

### EditorStateProvider
```typescript
<EditorStateProvider 
  initialReadOnly={false}
  initialLocked={false}
>
  {children}
</EditorStateProvider>
```

### useEditorState
```typescript
const { isReadOnly, isLocked, setIsReadOnly, setIsLocked } = useEditorState();
```

### useEditor Options
```typescript
useEditor(id, pageId, {
  isReadOnly: boolean,
  isLocked: boolean,
})
```

### useEditorPermissions
```typescript
const permissions = useEditorPermissions(projectId);
// permissions.canCreateElements
// permissions.canEditElements
// permissions.canDeleteElements
// permissions.canReorderElements
```

---

## Next Steps

1. **Read Full Guide**: See `READ_ONLY_MODE_GUIDE.md` for detailed documentation
2. **Check Implementation**: See `IMPLEMENTATION_SUMMARY.md` for technical details
3. **View Examples**: Look at the pattern examples above for your use case
4. **Test Everything**: Verify drag, drop, delete, create, and resize are all blocked

---

## Support

For issues:
1. Check that props are passed through component chain
2. Verify `useEditorPermissions` is returning correct permissions
3. Ensure toast library is properly configured
4. Check browser console for errors