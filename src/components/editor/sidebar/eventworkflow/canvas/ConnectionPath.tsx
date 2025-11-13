import React from "react";
import clsx from "clsx";
import { CONNECTION_STROKE_WIDTHS } from "@/constants/connectionRenderer";

interface ConnectionPathProps {
  pathData: string;
  color: string;
  strokeWidth: number;
  opacity: number;
  isSelected: boolean;
  isHovered: boolean;
  onClickPath: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * Renders a connection path with both invisible click target and visible line
 */
export const ConnectionPath: React.FC<ConnectionPathProps> = ({
  pathData,
  color,
  strokeWidth,
  opacity,
  isSelected,
  isHovered,
  onClickPath,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
}) => (
  <>
    {/* Invisible thick path for easier clicking */}
    <path
      d={pathData}
      fill="none"
      stroke="transparent"
      strokeWidth={CONNECTION_STROKE_WIDTHS.clickTarget}
      className="cursor-pointer pointer-events-auto"
      onClick={onClickPath}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />

    {/* Visible connection line */}
    <path
      d={pathData}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      opacity={opacity}
      className={clsx(
        "transition-all duration-200 pointer-events-none",
        isSelected || isHovered ? "drop-shadow-lg" : "",
      )}
      markerEnd={
        isSelected || isHovered ? "url(#arrowhead-selected)" : "url(#arrowhead)"
      }
    />
  </>
);
