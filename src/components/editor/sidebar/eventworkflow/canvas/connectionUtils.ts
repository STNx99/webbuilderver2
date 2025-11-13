/**
 * Utility functions for ConnectionRenderer
 */

import {
  BEZIER_CURVATURE_FACTOR,
  BEZIER_MIN_CURVATURE,
  NODE_WIDTH,
  NODE_PORT_OFFSET_Y,
  CONNECTION_COLORS,
  CONNECTION_STROKE_WIDTHS,
  CONNECTION_OPACITY,
} from "@/constants/connectionRenderer";

export interface PathPoint {
  x: number;
  y: number;
}

export interface ConnectionStyles {
  color: string;
  strokeWidth: number;
  opacity: number;
}

/**
 * Calculate a cubic Bézier path string between two points
 */
export const calculateBezierPath = (
  start: PathPoint,
  end: PathPoint,
): string => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.max(
    distance * BEZIER_CURVATURE_FACTOR,
    BEZIER_MIN_CURVATURE,
  );

  const controlPoint1: PathPoint = {
    x: start.x + curvature,
    y: start.y,
  };

  const controlPoint2: PathPoint = {
    x: end.x - curvature,
    y: end.y,
  };

  return `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;
};

/**
 * Get the connection color based on state
 */
export const getConnectionColor = (isActive: boolean): string => {
  return isActive ? CONNECTION_COLORS.selected : CONNECTION_COLORS.default;
};

/**
 * Get the port position for a node
 */
export const getNodePort = (
  nodeId: string,
  nodes: Record<string, { x: number; y: number }>,
  isOutput: boolean,
): PathPoint => {
  const node = nodes[nodeId];
  if (!node) {
    return { x: 0, y: 0 };
  }

  return {
    x: node.x + (isOutput ? NODE_WIDTH : 0),
    y: node.y + NODE_PORT_OFFSET_Y,
  };
};

/**
 * Calculate the midpoint of a cubic Bézier curve at parameter t (0-1)
 */
export const calculateBezierPoint = (
  start: PathPoint,
  end: PathPoint,
  t: number,
): PathPoint => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.max(
    distance * BEZIER_CURVATURE_FACTOR,
    BEZIER_MIN_CURVATURE,
  );

  const controlPoint1 = start.x + curvature;
  const controlPoint2 = end.x - curvature;

  const mt = 1 - t;

  const x =
    Math.pow(mt, 3) * start.x +
    3 * Math.pow(mt, 2) * t * controlPoint1 +
    3 * mt * Math.pow(t, 2) * controlPoint2 +
    Math.pow(t, 3) * end.x;

  const y =
    Math.pow(mt, 3) * start.y +
    3 * Math.pow(mt, 2) * t * start.y +
    3 * mt * Math.pow(t, 2) * end.y +
    Math.pow(t, 3) * end.y;

  return { x, y };
};

/**
 * Determine connection visual styles based on state
 */
export const getConnectionStyles = (isActive: boolean): ConnectionStyles => {
  return {
    color: getConnectionColor(isActive),
    strokeWidth: isActive
      ? CONNECTION_STROKE_WIDTHS.active
      : CONNECTION_STROKE_WIDTHS.default,
    opacity: isActive ? CONNECTION_OPACITY.active : CONNECTION_OPACITY.default,
  };
};
