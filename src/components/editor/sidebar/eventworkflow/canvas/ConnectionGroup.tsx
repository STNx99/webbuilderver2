import React from "react";
import { Connection } from "../types/workflow.types";
import {
  calculateBezierPath,
  calculateBezierPoint,
  getConnectionStyles,
  getNodePort,
} from "./connectionUtils";
import { BEZIER_MIDPOINT_PARAMETER } from "@/constants/connectionRenderer";
import { ConnectionPath } from "./ConnectionPath";
import { DeleteButton } from "./DeleteButton";

interface ConnectionGroupProps {
  connection: Connection;
  nodes: Record<string, { x: number; y: number }>;
  isSelected: boolean;
  isHovered: boolean;
  onClickConnection: (e: React.MouseEvent, connectionId: string) => void;
  onContextMenuConnection: (e: React.MouseEvent, connectionId: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDelete: () => void;
}

/**
 * Renders a single connection with all its interactive elements
 */
export const ConnectionGroup: React.FC<ConnectionGroupProps> = ({
  connection,
  nodes,
  isSelected,
  isHovered,
  onClickConnection,
  onContextMenuConnection,
  onMouseEnter,
  onMouseLeave,
  onDelete,
}) => {
  const startPort = getNodePort(connection.source, nodes, true);
  const endPort = getNodePort(connection.target, nodes, false);
  const pathData = calculateBezierPath(startPort, endPort);
  const isActive = isSelected || isHovered;
  const styles = getConnectionStyles(isActive);
  const midPoint = calculateBezierPoint(
    startPort,
    endPort,
    BEZIER_MIDPOINT_PARAMETER,
  );

  return (
    <g key={connection.id}>
      <ConnectionPath
        pathData={pathData}
        color={styles.color}
        strokeWidth={styles.strokeWidth}
        opacity={styles.opacity}
        isSelected={isSelected}
        isHovered={isHovered}
        onClickPath={(e) => onClickConnection(e, connection.id)}
        onContextMenu={(e) => onContextMenuConnection(e, connection.id)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      {isActive && <DeleteButton midPoint={midPoint} onDelete={onDelete} />}
    </g>
  );
};
