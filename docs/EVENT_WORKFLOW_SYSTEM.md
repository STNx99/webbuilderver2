# Event Workflow System Documentation

## Overview

The Event Workflow System is a visual, node-based workflow builder that allows users to create complex event-driven interactions without writing code. Similar to n8n or Zapier, it provides a canvas-based interface where users can drag, drop, and connect nodes to define how elements respond to events.

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Event Workflow System                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Frontend   │  │   Services   │  │   Backend    │      │
│  │              │  │              │  │              │      │
│  │ • Canvas UI  │──│ Transform    │──│ API Routes   │      │
│  │ • Nodes      │  │ • Validation │  │ • Database   │      │
│  │ • Config     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Canvas State** → User creates workflow visually
2. **Validation** → System validates structure and configuration
3. **Transformation** → Nodes are transformed to executable handlers
4. **Storage** → Both canvas data and handlers are saved
5. **Loading** → Canvas data is restored for editing
6. **Execution** → Handlers are executed when events fire

## Database Schema

### EventWorkflow Table

```prisma
model EventWorkflow {
  Id          String   @id @default(cuid())
  ProjectId   String
  Name        String
  Description String?
  Handlers    Json     @default("[]")      // Executable event handlers
  CanvasData  Json?                        // Visual workflow canvas state
  Enabled     Boolean  @default(true)
  CreatedAt   DateTime @default(now())
  UpdatedAt   DateTime @updatedAt
  Project     Project  @relation(...)
}
```

**Key Fields:**
- `Handlers`: Array of transformed EventHandler objects ready for execution
- `CanvasData`: Complete workflow canvas state (nodes, connections, metadata)

This dual-storage approach ensures:
- ✅ Canvas can be restored exactly as user left it
- ✅ Handlers are pre-transformed for fast execution
- ✅ No data loss between edits

## Node Types

### 1. TRIGGER Node
**Purpose:** Defines which event triggers the workflow

**Configuration:**
```typescript
{
  eventType: "onClick" | "onDoubleClick" | "onMouseEnter" | ...
}
```

**Behavior:**
- Only one per workflow (first one is used)
- Provides event context for all actions
- No incoming connections required
- Must connect to ACTION nodes

### 2. ACTION Node
**Purpose:** Performs operations when triggered

**Configuration:**
```typescript
{
  actionType: "navigate" | "apiCall" | "showElement" | ...,
  // Action-specific config
  value?: string,
  url?: string,
  elementId?: string,
  // etc.
}
```

**Action Types:**
- `navigate`: Navigate to URL or page
- `showElement` / `hideElement` / `toggleElement`: Control element visibility
- `apiCall`: Make HTTP requests
- `setData`: Update application state
- `customCode`: Execute custom JavaScript
- `scrollTo`: Scroll to element or position
- `modal`: Open/close modals
- `showNotification`: Display toast messages
- `playAnimation`: Trigger animations
- `copyToClipboard`: Copy text to clipboard
- `downloadFile`: Download files
- `toggleClass` / `addClass` / `removeClass`: Manage CSS classes
- `submitForm` / `resetForm`: Handle forms

### 3. CONDITION Node
**Purpose:** Branch workflow based on conditions

**Configuration:**
```typescript
{
  conditionType: "stateEquals" | "stateCheck" | "customCode" | "always",
  left?: string,
  operator?: "==" | "!=" | ">" | "<" | ...,
  right?: any,
  customCode?: string
}
```

### 4. OUTPUT Node
**Purpose:** Terminal node for workflow completion

**Configuration:** None required

## Services

### WorkflowTransformService

**Location:** `src/services/workflow/WorkflowTransformService.ts`

**Purpose:** Transforms visual workflow (nodes + connections) into executable event handlers

**Key Methods:**

```typescript
// Transform complete workflow
WorkflowTransformService.transform(workflow: WorkflowData): TransformResult

// Extract event type from workflow
WorkflowTransformService.extractEventType(workflow: WorkflowData): EventType

// Get workflow statistics
WorkflowTransformService.getWorkflowStats(workflow: WorkflowData): Stats
```

**Transform Process:**

1. **Validate Structure** - Ensures workflow has required nodes
2. **Extract Event Type** - Gets event type from TRIGGER node
3. **Build Connection Map** - Maps node relationships
4. **Transform Nodes** - Converts ACTION nodes to handlers
5. **Populate Next Handlers** - Links handlers based on connections
6. **Validate Handlers** - Ensures handlers match schema

**Example:**

```typescript
const result = WorkflowTransformService.transform({
  nodes: [
    { type: "trigger", data: { config: { eventType: "onClick" } } },
    { type: "action", data: { config: { actionType: "navigate", value: "/home" } } }
  ],
  connections: [{ source: "trigger-id", target: "action-id" }]
});

// Result:
{
  handlers: [
    {
      id: "action-id",
      eventType: "onClick",
      actionType: "navigate",
      config: { type: "navigate", target: "url", value: "/home" }
    }
  ],
  errors: [],
  warnings: []
}
```

### WorkflowValidationService

**Location:** `src/services/workflow/WorkflowValidationService.ts`

**Purpose:** Validates workflow structure, nodes, connections, and handlers

**Key Methods:**

```typescript
// Validate complete workflow
WorkflowValidationService.validateWorkflow(workflow: WorkflowData): ValidationResult

// Validate single node
WorkflowValidationService.validateNode(node: WorkflowNode): NodeValidationResult

// Validate connections
WorkflowValidationService.validateConnections(workflow: WorkflowData): ValidationResult

// Validate handlers array
WorkflowValidationService.validateHandlers(handlers: EventHandler[]): ValidationResult

// Format errors for display
WorkflowValidationService.formatErrorsForDisplay(errors: ValidationError[]): string
```

**Validation Checks:**

- ✅ Workflow has TRIGGER and ACTION nodes
- ✅ Nodes have required configuration
- ✅ Action-specific fields are present (e.g., URL for navigate)
- ✅ Connections reference valid nodes
- ✅ No circular dependencies
- ✅ No self-connections
- ✅ Handlers match Zod schema

**Error Types:**

```typescript
interface ValidationError {
  nodeId?: string;
  nodeLabel?: string;
  field?: string;
  message: string;
  code: string;  // "NO_TRIGGER", "MISSING_URL", etc.
}
```

## API Endpoints

### GET `/api/projects/[projectId]/eventworkflows/[workflowId]`

**Returns:** Workflow with handlers and canvas data

```json
{
  "id": "workflow-id",
  "name": "My Workflow",
  "handlers": [...],
  "canvasData": {
    "nodes": [...],
    "connections": [...],
    "metadata": {...}
  }
}
```

### PUT `/api/projects/[projectId]/eventworkflows/[workflowId]`

**Request Body:**

```json
{
  "name": "Updated Workflow",
  "description": "Description",
  "canvasData": {
    "nodes": [...],
    "connections": [...]
  },
  "handlers": [...],  // Optional, will be transformed from canvasData
  "enabled": true
}
```

**Process:**

1. Validate canvas data structure
2. Transform nodes to handlers (if canvasData provided)
3. Validate handlers against schema
4. Save both canvas data and handlers
5. Return updated workflow

**Error Responses:**

```json
{
  "error": "Invalid workflow structure",
  "details": [
    {
      "nodeId": "node-123",
      "nodeLabel": "Navigate Action",
      "message": "Navigate action requires a URL",
      "code": "MISSING_VALUE"
    }
  ],
  "warnings": [...]
}
```

## Frontend Components

### WorkflowCanvas

**Location:** `src/components/editor/sidebar/eventworkflow/canvas/WorkflowCanvas.tsx`

**Purpose:** Visual canvas for creating workflows

**Features:**
- Drag and drop nodes
- Connect nodes with visual connections
- Pan and zoom
- Node selection and deletion
- Connection management

### NodeConfigPanel

**Location:** `src/components/editor/sidebar/eventworkflow/nodes/NodeConfigPanel.tsx`

**Purpose:** Configure individual node settings

**Features:**
- Action-specific configuration forms
- Real-time validation
- Type-safe inputs
- Helper text and examples

### WorkflowEditor

**Location:** `src/components/editor/sidebar/eventworkflow/WorkflowEditor.tsx`

**Purpose:** Main editor container with toolbar and tabs

**Features:**
- Canvas view for visual editing
- JSON view for debugging
- Save/load workflows
- Workflow information panel

## Hooks

### useWorkflowCanvas

**Location:** `src/hooks/editor/eventworkflow/useWorkflowCanvas.ts`

**Purpose:** Zustand store for canvas state management

**Methods:**

```typescript
// Node operations
addNode(type, position, data): string
updateNode(nodeId, updates): void
deleteNode(nodeId): void
moveNode(nodeId, position): void

// Connection operations
addConnection(source, target): string
deleteConnection(connectionId): void

// Canvas operations
setZoom(zoom): void
setPan(x, y): void
resetView(): void

// Workflow operations
loadWorkflow(workflow): void
getWorkflow(): WorkflowData
clearWorkflow(): void
```

### useEventWorkflows

**Location:** `src/hooks/editor/eventworkflow/useEventWorkflows.ts`

**Purpose:** React Query hooks for API operations

**Hooks:**

```typescript
useEventWorkflows(projectId)          // List all workflows
useEventWorkflow(projectId, workflowId, enabled)  // Get single workflow
useCreateEventWorkflow()              // Create new workflow
useUpdateEventWorkflow()              // Update workflow
useDeleteEventWorkflow()              // Delete workflow
```

## Utilities

### buildActionConfig

**Location:** `src/components/editor/sidebar/eventworkflow/workflowUtils.ts`

**Purpose:** Build schema-compliant action configurations with defaults

```typescript
buildActionConfig(actionType: string, baseConfig: any): EventActionConfig
```

**Examples:**

```typescript
// Navigate action
buildActionConfig("navigate", { value: "/home" })
// Returns: { type: "navigate", target: "url", value: "/home", openInNewTab: false }

// API call action
buildActionConfig("apiCall", { url: "https://api.example.com" })
// Returns: { type: "apiCall", url: "...", method: "GET", timeout: 5000 }
```

## Workflow Lifecycle

### 1. Creation

```typescript
// User creates workflow from list
createWorkflow({ name: "New Workflow", handlers: [] })

// Empty canvas is initialized
{
  nodes: [],
  connections: [],
  metadata: { name: "New Workflow" }
}
```

### 2. Editing

```typescript
// User adds nodes and connections via UI
addNode(NodeType.TRIGGER, { x: 100, y: 100 }, { 
  label: "Click Event",
  config: { eventType: "onClick" }
})

addNode(NodeType.ACTION, { x: 300, y: 100 }, {
  label: "Navigate",
  config: { actionType: "navigate", value: "/dashboard" }
})

addConnection(triggerId, actionId)
```

### 3. Validation

```typescript
// Before save, validate workflow
const validation = WorkflowValidationService.validateWorkflow(workflow)

if (!validation.valid) {
  // Show errors to user
  toast.error(formatErrorsForDisplay(validation.errors))
  return
}
```

### 4. Transformation

```typescript
// Transform to executable handlers
const result = WorkflowTransformService.transform(workflow)

if (result.errors.length > 0) {
  // Handle transformation errors
  return
}

// result.handlers ready for execution
```

### 5. Saving

```typescript
// Save both canvas data and handlers
updateWorkflow({
  canvasData: workflow,          // For future editing
  handlers: result.handlers,     // For execution
  name: workflow.metadata.name
})
```

### 6. Loading

```typescript
// Load workflow for editing
const workflow = await getWorkflow(workflowId)

// Restore canvas from saved data
loadWorkflow(workflow.canvasData)

// Canvas is exactly as user left it
```

### 7. Execution

```typescript
// When event fires, execute handlers
workflow.handlers.forEach(handler => {
  if (handler.enabled) {
    executeHandler(handler, event, context)
  }
})
```

## Best Practices

### 1. Always Validate Before Save

```typescript
const validation = WorkflowValidationService.validateWorkflow(workflow)
if (!validation.valid) {
  // Show user-friendly errors
  return
}
```

### 2. Save Canvas Data

Always save the complete canvas state, not just handlers:

```typescript
updateWorkflow({
  canvasData: workflow,  // ✅ Save this!
  handlers: transformedHandlers
})
```

### 3. Handle Transform Errors

```typescript
const result = WorkflowTransformService.transform(workflow)

if (result.errors.length > 0) {
  // Show specific errors
  result.errors.forEach(error => {
    console.error(`${error.nodeLabel}: ${error.message}`)
  })
}
```

### 4. Show Warnings

Even if validation passes, inform users of potential issues:

```typescript
if (validation.warnings.length > 0) {
  toast.warning(formatWarningsForDisplay(validation.warnings))
}
```

### 5. Use Type-Safe Configs

```typescript
// ✅ Good - uses buildActionConfig for type safety
const config = buildActionConfig("navigate", userInput)

// ❌ Bad - raw config might fail validation
const config = { type: "navigate", ...userInput }
```

## Error Handling

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `NO_TRIGGER` | Workflow has no TRIGGER node | Add a TRIGGER node to define the event |
| `NO_ACTIONS` | Workflow has no ACTION nodes | Add at least one ACTION node |
| `MISSING_VALUE` | Required field is empty | Fill in the required configuration |
| `INVALID_URL` | URL format is invalid | Provide a valid URL |
| `CIRCULAR_DEPENDENCY` | Workflow has infinite loop | Remove circular connections |
| `SELF_CONNECTION` | Node connects to itself | Connect to different node |

### Error Display

```typescript
// Format errors for user display
const errorMessage = WorkflowValidationService.formatErrorsForDisplay(errors)

// Example output:
/*
Navigate Action:
  • Navigate action requires a URL

API Call Action:
  • API call URL is not valid
  • Method must be GET, POST, PUT, DELETE, or PATCH
*/
```

## Testing

### Unit Tests

```typescript
describe('WorkflowTransformService', () => {
  it('should transform nodes to handlers', () => {
    const workflow = createTestWorkflow()
    const result = WorkflowTransformService.transform(workflow)
    
    expect(result.handlers).toHaveLength(1)
    expect(result.errors).toHaveLength(0)
  })
})

describe('WorkflowValidationService', () => {
  it('should detect missing trigger', () => {
    const workflow = { nodes: [], connections: [] }
    const result = WorkflowValidationService.validateWorkflow(workflow)
    
    expect(result.valid).toBe(false)
    expect(result.errors[0].code).toBe('NO_TRIGGER')
  })
})
```

### Integration Tests

```typescript
describe('Workflow Save/Load', () => {
  it('should save and restore canvas data', async () => {
    // Create workflow
    const workflow = createWorkflow()
    
    // Add nodes
    addNodes(workflow)
    
    // Save
    await saveWorkflow(workflow)
    
    // Load
    const loaded = await loadWorkflow(workflow.id)
    
    // Verify canvas restored exactly
    expect(loaded.canvasData.nodes).toEqual(workflow.nodes)
  })
})
```

## Migration Guide

### From Old System

If you have existing workflows without canvas data:

1. **Create Default Canvas**: Generate basic canvas layout from handlers
2. **Position Nodes**: Auto-layout nodes in a flow
3. **Create Connections**: Infer connections from nextHandlers
4. **Save Canvas**: Update workflow with canvas data

```typescript
function migrateWorkflow(oldWorkflow: EventWorkflow) {
  const canvasData = {
    nodes: oldWorkflow.handlers.map((handler, i) => ({
      id: handler.id,
      type: NodeType.ACTION,
      position: { x: 100, y: 100 + (i * 150) },
      data: {
        label: handler.actionType,
        config: handler
      }
    })),
    connections: [],
    metadata: { name: oldWorkflow.name }
  }
  
  updateWorkflow(oldWorkflow.id, { canvasData })
}
```

## Troubleshooting

### Canvas Not Loading

**Problem:** Canvas appears empty when editing workflow

**Solution:**
- Check if `canvasData` is saved in database
- Verify API returns `canvasData` field
- Check browser console for errors

### Validation Errors on Save

**Problem:** Workflow fails to save with validation errors

**Solution:**
- Check which nodes have errors (shown in error details)
- Ensure all required fields are filled
- Use validation service to debug specific issues

### Handlers Not Executing

**Problem:** Events fire but nothing happens

**Solution:**
- Verify `enabled: true` on workflow
- Check handlers array is not empty
- Ensure event type matches element event
- Check browser console for execution errors

## Future Enhancements

### Planned Features

- [ ] Condition node implementation
- [ ] Visual error highlighting on canvas
- [ ] Undo/redo functionality
- [ ] Workflow templates
- [ ] Copy/paste nodes
- [ ] Bulk node operations
- [ ] Workflow testing mode
- [ ] Performance analytics
- [ ] Version history
- [ ] Collaborative editing

### API Improvements

- [ ] Batch workflow operations
- [ ] Workflow duplication
- [ ] Import/export workflows
- [ ] Workflow versioning
- [ ] Rollback to previous version

## Support

For issues or questions:
1. Check this documentation
2. Review error messages and codes
3. Check browser console for detailed errors
4. Review validation service output
5. Contact development team

## Conclusion

The Event Workflow System provides a powerful, visual way to create complex event-driven interactions. By separating canvas state from execution handlers, it ensures both excellent user experience (restore exact canvas state) and performance (pre-transformed handlers ready to execute).

Key principles:
- **Visual First**: Users work with visual nodes, not code
- **Type Safe**: Full TypeScript and Zod validation
- **Maintainable**: Clean separation of concerns
- **Reliable**: Comprehensive validation and error handling
- **Performant**: Pre-transformed handlers for fast execution