import React from "react";
import {
  DELETE_BUTTON_RADIUS,
  DELETE_BUTTON_FONT_SIZE,
  CONNECTION_COLORS,
} from "@/constants/connectionRenderer";
import type { PathPoint } from "./connectionUtils";

interface DeleteButtonProps {
  midPoint: PathPoint;
  onDelete: () => void;
}

/**
 * Renders a delete button that appears on hover/selection of a connection
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  midPoint,
  onDelete,
}) => (
  <g
    className="pointer-events-auto cursor-pointer"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onDelete();
    }}
  >
    <circle
      cx={midPoint.x}
      cy={midPoint.y}
      r={DELETE_BUTTON_RADIUS}
      fill={CONNECTION_COLORS.delete}
      opacity={CONNECTION_COLORS.deleteOpacity}
    />
    <text
      x={midPoint.x}
      y={midPoint.y}
      textAnchor="middle"
      dy="0.3em"
      fontSize={DELETE_BUTTON_FONT_SIZE}
      fill={CONNECTION_COLORS.textWhite}
      fontWeight="bold"
      pointerEvents="none"
    >
      ✕
    </text>
  </g>
);
