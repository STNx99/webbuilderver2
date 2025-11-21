import { NodeType } from "@/components/editor/sidebar/eventworkflow/types/workflow.types";

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  [NodeType.TRIGGER]: "Trigger",
  [NodeType.ACTION]: "Action",
  [NodeType.CONDITION]: "Condition",
  [NodeType.OUTPUT]: "Output",
};

export const NODE_TYPE_DESCRIPTIONS: Record<NodeType, string> = {
  [NodeType.TRIGGER]: "Start point of the workflow",
  [NodeType.ACTION]: "Perform an action or task",
  [NodeType.CONDITION]: "Branch based on conditions",
  [NodeType.OUTPUT]: "End point of the workflow",
};

export const NODE_TYPE_COLORS = {
  trigger: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-300 dark:border-yellow-700",
    borderSelected: "border-yellow-500",
    shadowSelected: "shadow-yellow-500/20",
    icon: "text-yellow-600 dark:text-yellow-400",
    iconBg: "bg-yellow-100 dark:bg-yellow-900",
  },
  action: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-300 dark:border-blue-700",
    borderSelected: "border-blue-500",
    shadowSelected: "shadow-blue-500/20",
    icon: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
  condition: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-300 dark:border-purple-700",
    borderSelected: "border-purple-500",
    shadowSelected: "shadow-purple-500/20",
    icon: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900",
  },
  output: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-300 dark:border-green-700",
    borderSelected: "border-green-500",
    shadowSelected: "shadow-green-500/20",
    icon: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900",
  },
} as const;

export const EVENT_TYPES = [
  {
    value: "onClick",
    label: "On Click",
    description: "When element is clicked",
    category: "user-interaction",
  },
  {
    value: "onDoubleClick",
    label: "On Double Click",
    description: "When element is double-clicked",
    category: "user-interaction",
  },
  {
    value: "onMouseEnter",
    label: "On Mouse Enter",
    description: "When mouse enters element",
    category: "mouse-event",
  },
  {
    value: "onMouseLeave",
    label: "On Mouse Leave",
    description: "When mouse leaves element",
    category: "mouse-event",
  },
  {
    value: "onSubmit",
    label: "On Submit",
    description: "When form is submitted",
    category: "form-event",
  },
  {
    value: "onChange",
    label: "On Change",
    description: "When input value changes",
    category: "form-event",
  },
  {
    value: "onFocus",
    label: "On Focus",
    description: "When element receives focus",
    category: "focus-event",
  },
  {
    value: "onBlur",
    label: "On Blur",
    description: "When element loses focus",
    category: "focus-event",
  },
] as const;

export const EVENT_CATEGORIES = {
  "user-interaction": {
    label: "User Interaction",
    icon: "Zap",
  },
  "mouse-event": {
    label: "Mouse Events",
    icon: "Mouse",
  },
  "form-event": {
    label: "Form Events",
    icon: "FormInput",
  },
  "focus-event": {
    label: "Focus Events",
    icon: "Focus",
  },
} as const;

export const WORKFLOW_VALIDATION_RULES = {
  minNodes: 1,
  maxNodes: 100,
  maxConnections: 500,
  maxNameLength: 255,
  maxDescriptionLength: 1000,
} as const;

export const WORKFLOW_DEFAULTS = {
  zoom: 1,
  panX: 0,
  panY: 0,
  gridSize: 50,
  nodeSpacing: 200,
} as const;

export const CANVAS_CONFIG = {
  minZoom: 0.1,
  maxZoom: 4,
  zoomStep: 1.2,
  panSensitivity: 1,
  defaultGridOpacity: 0.2,
} as const;

export const NODE_DIMENSIONS = {
  width: 192,
  height: 120,
  portRadius: 6,
  portOffset: 60,
} as const;

export const CONNECTION_CONFIG = {
  strokeWidth: {
    default: 2,
    active: 3,
    hover: 2.5,
  },
  colors: {
    default: "#94a3b8",
    selected: "#f59e0b",
    delete: "#ef4444",
    error: "#dc2626",
  },
  opacity: {
    default: 0.6,
    active: 1,
    disabled: 0.3,
  },
} as const;

export const HANDLE_POSITIONS = {
  trigger: {
    source: true,
    target: false,
  },
  action: {
    source: true,
    target: true,
  },
  condition: {
    source: true,
    target: true,
  },
  output: {
    source: false,
    target: true,
  },
} as const;

export const VALIDATION_ERRORS = {
  selfConnection: "Cannot connect a node to itself",
  triggerAsTarget: "Cannot connect to TRIGGER nodes",
  outputAsSource: "Cannot connect from OUTPUT nodes",
  duplicateConnection: "This connection already exists",
  maxConnectionsReached: "Maximum number of connections reached",
  invalidNodeType: "Invalid node type",
  missingRequiredField: "Missing required field",
} as const;

export const WORKFLOW_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  ACTIVE: "active",
  PAUSED: "paused",
} as const;

export const WORKFLOW_EXECUTION_STATUS = {
  IDLE: "idle",
  RUNNING: "running",
  SUCCESS: "success",
  ERROR: "error",
  CANCELLED: "cancelled",
} as const;

export const KEYBOARD_SHORTCUTS = {
  DELETE: ["Delete", "Backspace"],
  SELECT_ALL: ["Control+a", "Meta+a"],
  ZOOM_IN: ["Control+Plus", "Meta+Plus"],
  ZOOM_OUT: ["Control+Minus", "Meta+Minus"],
  RESET_VIEW: ["Control+0", "Meta+0"],
  COPY: ["Control+c", "Meta+c"],
  PASTE: ["Control+v", "Meta+v"],
  UNDO: ["Control+z", "Meta+z"],
  REDO: ["Control+Shift+z", "Meta+Shift+z"],
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const DEFAULT_NODE_CONFIG: Record<NodeType, Record<string, any>> = {
  [NodeType.TRIGGER]: {
    timeout: 5000,
    retryCount: 3,
  },
  [NodeType.ACTION]: {
    async: true,
    timeout: 10000,
    retryCount: 3,
  },
  [NodeType.CONDITION]: {
    operators: ["==", "!=", ">", "<", ">=", "<=", "contains"],
    timeout: 5000,
  },
  [NodeType.OUTPUT]: {
    format: "json",
    includeMetadata: true,
  },
} as const;

export const getNodeTypeColor = (nodeType: NodeType) => {
  const colorMap: Record<NodeType, keyof typeof NODE_TYPE_COLORS> = {
    [NodeType.TRIGGER]: "trigger",
    [NodeType.ACTION]: "action",
    [NodeType.CONDITION]: "condition",
    [NodeType.OUTPUT]: "output",
  };
  return NODE_TYPE_COLORS[colorMap[nodeType]];
};

export const getEventTypesByCategory = (
  category: keyof typeof EVENT_CATEGORIES,
) => {
  return EVENT_TYPES.filter((event) => event.category === category);
};

export const isValidConnection = (
  sourceType: NodeType,
  targetType: NodeType,
  sourceId: string,
  targetId: string,
): {
  valid: boolean;
  error?: string;
} => {
  if (sourceId === targetId) {
    return { valid: false, error: VALIDATION_ERRORS.selfConnection };
  }

  if (targetType === NodeType.TRIGGER) {
    return { valid: false, error: VALIDATION_ERRORS.triggerAsTarget };
  }

  if (sourceType === NodeType.OUTPUT) {
    return { valid: false, error: VALIDATION_ERRORS.outputAsSource };
  }

  return { valid: true };
};

export const canNodeHaveConnections = (nodeType: NodeType) => {
  return HANDLE_POSITIONS[nodeType as keyof typeof HANDLE_POSITIONS];
};
