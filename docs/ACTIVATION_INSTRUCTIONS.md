# Activation Instructions: Read-Only & Locked Editor Mode

## Status
✅ **ALL CHANGES HAVE BEEN APPLIED** - The feature is ready to use!

No additional code changes are required. Simply follow the usage patterns below to enable read-only mode in your application.

---

## Quick Activation

### Method 1: Force Read-Only on Specific Routes
```typescript
// In your editor page component
import { useEditor } from "@/hooks";

export default function ViewOnlyEditorPage({ id, pageId }) {
  const editor = useEditor(id, pageId, {
    isReadOnly: true,  // ← Enables read-only mode
  });

  // Rest of component continues normally
  return (
    <EditorHeader {...} />
    <EditorCanvas 
      {...}
      isReadOnly={editor.isReadOnly}
      isLocked={editor.isLocked}
    />
  );
}
```

### Method 2: Use Provider for Global Control
```typescript
// Wrap your editor with the provider
import { EditorStateProvider } from "@/providers/EditorStateProvider";

export default function SharedProjectPage() {
  return (
    <EditorStateProvider initialReadOnly={true}>
      <Editor id={projectId} pageId={pageId} />
    </EditorStateProvider>
  );
}
```

### Method 3: Automatic via Permissions (Recommended)
```typescript
// No code changes needed! The system automatically detects user permissions
const editor = useEditor(id, pageId);
// If user lacks ELEMENT_EDIT permission, editor is automatically read-only
```

---

## Verification Checklist

After implementing, verify these operations are blocked:

### Mouse Operations
- [ ] Cannot drag elements (cursor doesn't show drag handles)
- [ ] Cannot drop elements (drop zone doesn't highlight)
- [ ] Cannot resize elements (resize handles are hidden)
- [ ] Cannot right-click to access full context menu

### Keyboard Operations
- [ ] Delete key does nothing
- [ ] Ctrl+X (Cut) shows "Cannot cut" toast
- [ ] Ctrl+V (Paste) shows "Cannot paste" toast
- [ ] Ctrl+C (Copy) works (read-only access)
- [ ] Ctrl+Z (Undo) shows "Cannot undo" toast

### UI Operations
- [ ] "Add new section" button is disabled
- [ ] Context menu items are grayed out
- [ ] Element content cannot be edited
- [ ] All toast notifications appear correctly

### Visual Feedback
- [ ] Disabled buttons show reduced opacity
- [ ] Disabled menu items show opacity-50
- [ ] Resize handles are completely hidden
- [ ] Toast notifications appear at top-right

---

## Component Communication Flow

The feature works through prop passing:

```
Editor Component
├─ useEditor Hook
│  └─ Calculates: isReadOnly, isLocked, permissions
│
├─ EditorCanvas Component
│  ├─ Receives: isReadOnly, isLocked props
│  ├─ Passes to: ElementLoader, KeyboardEvent
│  └─ Disables: "Add new section" button
│
└─ ElementLoader Component
   ├─ Receives: isReadOnly, isLocked props
   ├─ Passes to: ResizeHandler, EditorContextMenu
   └─ Blocks: Drop operations, element creation

         ResizeHandler
         ├─ Receives: isReadOnly, isLocked props
         ├─ Hides: Resize handles
         └─ Passes to: useResizeHandler, EditorContextMenu

         EditorContextMenu
         ├─ Receives: isReadOnly, isLocked props
         ├─ Disables: All modify operations
         └─ Shows: Visual feedback (opacity)
```

---

## Testing Scenarios

### Scenario 1: View-Only for Clients
```typescript
// client-view.tsx
const isClient = user.role === "CLIENT";

export default function ProjectView({ id, pageId }) {
  return (
    <EditorStateProvider initialReadOnly={isClient}>
      <div className="space-y-4">
        {isClient && (
          <div className="bg-blue-100 p-4 rounded">
            <p>You are viewing this project in read-only mode</p>
          </div>
        )}
        <Editor id={id} pageId={pageId} />
      </div>
    </EditorStateProvider>
  );
}
```

### Scenario 2: Preview Mode
```typescript
// editor.tsx
const searchParams = useSearchParams();
const isPreview = searchParams.get("mode") === "preview";

const editor = useEditor(id, pageId, {
  isReadOnly: isPreview,
});

return <EditorCanvas {...editor} />;
```

### Scenario 3: Permission-Based Access
```typescript
// protected-editor.tsx
const permissions = useEditorPermissions(projectId);

if (!permissions.canEditElements) {
  return (
    <div className="flex flex-col gap-4">
      <InfoBanner>
        You don't have permission to edit this project
      </InfoBanner>
      <Editor id={projectId} pageId={pageId} />
    </div>
  );
}

return <Editor id={projectId} pageId={pageId} />;
```

---

## Files That Work Together

| File | Purpose |
|------|---------|
| `EditorStateProvider.tsx` | Global state management |
| `useEditor.ts` | Permission checks, state calculation |
| `useElementHandler.ts` | Element operation guards |
| `keyBoardEvents.ts` | Keyboard shortcut prevention |
| `EditorCanvas.tsx` | State propagation, UI disabling |
| `ElementLoader.tsx` | Drop prevention, prop passing |
| `EditorContextMenu.tsx` | Menu item disabling |
| `ResizeHandler.tsx` | Handle hiding, resize prevention |
| `useResizeHandler.ts` | Resize operation blocking |

---

## Common Implementation Patterns

### Pattern A: Read-Only by Default, Toggle to Edit
```typescript
const [isEditing, setIsEditing] = useState(false);

return (
  <>
    <button onClick={() => setIsEditing(!isEditing)}>
      {isEditing ? "Done Editing" : "Start Editing"}
    </button>
    <EditorStateProvider initialReadOnly={!isEditing}>
      <Editor id={id} pageId={pageId} />
    </EditorStateProvider>
  </>
);
```

### Pattern B: Always Read-Only (View-Only Project)
```typescript
export default function ViewProject({ id, pageId }) {
  return (
    <EditorStateProvider initialReadOnly={true}>
      <Editor id={id} pageId={pageId} />
    </EditorStateProvider>
  );
}
```

### Pattern C: Automatic Based on Permissions
```typescript
export default function SmartEditor({ id, pageId, userId }) {
  const permissions = useEditorPermissions(id);
  
  return (
    <EditorStateProvider initialReadOnly={!permissions.canEditElements}>
      <Editor id={id} pageId={pageId} />
    </EditorStateProvider>
  );
}
```

### Pattern D: Different Modes Per User
```typescript
export default function CollaborativeEditor({ id, pageId, userRole }) {
  const readOnlyRoles = ["VIEWER", "COMMENTER"];
  const isReadOnly = readOnlyRoles.includes(userRole);

  return (
    <EditorStateProvider initialReadOnly={isReadOnly}>
      <Editor id={id} pageId={pageId} />
    </EditorStateProvider>
  );
}
```

---

## Feature Matrix

| Feature | Blocked | Allowed | Visual Feedback |
|---------|---------|---------|-----------------|
| **Drag** | ✅ Yes | No | No drag cursor |
| **Drop** | ✅ Yes | No | No drop zone |
| **Delete** | ✅ Yes | No | No delete option |
| **Create** | ✅ Yes | No | Disabled button |
| **Edit Content** | ✅ Yes | No | Not editable |
| **Resize** | ✅ Yes | No | No handles |
| **Cut (Ctrl+X)** | ✅ Yes | No | Toast message |
| **Paste (Ctrl+V)** | ✅ Yes | No | Toast message |
| **Copy (Ctrl+C)** | No | ✅ Yes | Works normally |
| **View** | No | ✅ Yes | Normal view |

---

## Performance Notes

- ✅ Permission checks are memoized
- ✅ Toast notifications are debounced
- ✅ Re-renders are minimized
- ✅ No memory leaks (proper cleanup)
- ✅ No external dependencies added

---

## Troubleshooting Guide

### Issue: Operations still work in read-only mode

**Check 1:** Props are passed through component chain
```typescript
// ❌ Wrong
<EditorCanvas {...props} />

// ✅ Correct
<EditorCanvas {...props} isReadOnly={isReadOnly} isLocked={isLocked} />
```

**Check 2:** Editor component returns the states
```typescript
const { isReadOnly, isLocked } = useEditor(id, pageId);
// These must be extracted and passed
```

**Check 3:** Provider is wrapping correctly
```typescript
// ❌ Wrong
<Editor id={id} pageId={pageId} />
<EditorStateProvider>

// ✅ Correct
<EditorStateProvider initialReadOnly={true}>
  <Editor id={id} pageId={pageId} />
</EditorStateProvider>
```

### Issue: Toast notifications don't appear

**Solution:** Ensure Sonner is configured in your root layout
```typescript
// In app layout
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### Issue: Resize handles still visible

**Solution:** Verify props reach ResizeHandler
```typescript
<ResizeHandler
  element={element}
  isReadOnly={isReadOnly}  // ← Must be passed
  isLocked={isLocked}      // ← Must be passed
>
```

### Issue: Context menu items not disabled

**Solution:** Check EditorContextMenu receives props
```typescript
<EditorContextMenu
  element={element}
  isReadOnly={isReadOnly}  // ← Must be passed
  isLocked={isLocked}      // ← Must be passed
>
```

---

## Deployment Checklist

- [ ] All files have been modified (see Implementation Summary)
- [ ] No TypeScript errors in build
- [ ] Test drag/drop is blocked
- [ ] Test delete is blocked
- [ ] Test keyboard shortcuts are blocked
- [ ] Test context menu is disabled
- [ ] Test toast notifications appear
- [ ] Test visual feedback displays correctly
- [ ] Test permissions integration works
- [ ] Test provider wrapping works
- [ ] Test props are passed correctly
- [ ] Test in all target browsers

---

## Support Resources

1. **Quick Start**: See `QUICK_START.md` for common patterns
2. **Full Guide**: See `READ_ONLY_MODE_GUIDE.md` for complete documentation
3. **Technical Details**: See `IMPLEMENTATION_SUMMARY.md` for code changes
4. **This File**: Activation instructions and troubleshooting

---

## Next Steps

1. ✅ Code is ready - all files have been updated
2. 📝 Choose activation method from above
3. 🧪 Test with verification checklist
4. 🚀 Deploy to your environment
5. 📊 Monitor user feedback

## Success Criteria

The feature is working correctly when:
- ✅ Users cannot drag/drop elements
- ✅ Users cannot delete elements
- ✅ Users cannot create new elements
- ✅ Users cannot resize elements
- ✅ Keyboard shortcuts are blocked
- ✅ Toast notifications appear
- ✅ UI shows disabled states
- ✅ Context menu is restricted
- ✅ Permissions are respected

---

**Ready to activate? Pick a pattern above and start using read-only mode! 🎉**