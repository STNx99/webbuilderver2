/**
 * Constants for the ConnectionRenderer component
 */

// Node dimensions
export const NODE_WIDTH = 192; // w-48
export const NODE_PORT_OFFSET_Y = 60; // approximate center height of node

// Bezier path calculations
export const BEZIER_CURVATURE_FACTOR = 0.25;
export const BEZIER_MIN_CURVATURE = 50;
export const BEZIER_MIDPOINT_PARAMETER = 0.5;

// Interactive elements
export const CLICK_TARGET_STROKE_WIDTH = 12;
export const DELETE_BUTTON_RADIUS = 10;
export const DELETE_BUTTON_FONT_SIZE = 12;

// Colors
export const CONNECTION_COLORS = {
  selected: "#f59e0b", // amber-500
  default: "#94a3b8", // slate-400
  delete: "#ef4444", // red-500
  deleteOpacity: 0.8,
  textWhite: "#ffffff",
} as const;

// Connection styles
export const CONNECTION_STROKE_WIDTHS = {
  default: 2,
  active: 3,
  clickTarget: CLICK_TARGET_STROKE_WIDTH,
} as const;

export const CONNECTION_OPACITY = {
  default: 0.6,
  active: 1,
} as const;
