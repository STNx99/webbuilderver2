"use client";

import React, { useRef, useEffect, useState } from "react";
import { Connection } from "../types/workflow.types";
import { SVGMarkers } from "./SVGMarkers";
import { ConnectionGroup } from "./ConnectionGroup";
import { getConnectionColor } from "./connectionUtils";

interface ConnectionRendererProps {
  connections: Connection[];
  nodes: Record<string, { x: number; y: number }>;
  selectedConnectionId?: string;
  onConnectionSelect?: (connectionId: string) => void;
  onConnectionDelete?: (connectionId: string) => void;
  zoom: number;
  panX: number;
  panY: number;
}

/**
 * Main component that renders all connection lines with interactive features
 */
export const ConnectionRenderer: React.FC<ConnectionRendererProps> = ({
  connections,
  nodes,
  selectedConnectionId,
  onConnectionSelect,
  onConnectionDelete,
  zoom,
  panX,
  panY,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(
    null,
  );

  // Update SVG dimensions on resize
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const updateSVGDimensions = () => {
      if (!containerRef.current || !svgRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      svgRef.current.setAttribute("width", String(width));
      svgRef.current.setAttribute("height", String(height));
    };

    updateSVGDimensions();
    window.addEventListener("resize", updateSVGDimensions);

    return () => {
      window.removeEventListener("resize", updateSVGDimensions);
    };
  }, []);

  const handleConnectionClick = (e: React.MouseEvent, connectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onConnectionSelect?.(connectionId);
  };

  const handleConnectionContextMenu = (
    e: React.MouseEvent,
    connectionId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onConnectionDelete?.(connectionId);
  };

  const selectedColor = getConnectionColor(true);
  const defaultColor = getConnectionColor(false);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        transformOrigin: "0 0",
      }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <SVGMarkers selectedColor={selectedColor} defaultColor={defaultColor} />

        {connections.map((connection) => {
          const isSelected = connection.id === selectedConnectionId;
          const isHovered = connection.id === hoveredConnectionId;

          return (
            <ConnectionGroup
              key={connection.id}
              connection={connection}
              nodes={nodes}
              isSelected={isSelected}
              isHovered={isHovered}
              onClickConnection={handleConnectionClick}
              onContextMenuConnection={handleConnectionContextMenu}
              onMouseEnter={() => setHoveredConnectionId(connection.id)}
              onMouseLeave={() => setHoveredConnectionId(null)}
              onDelete={() => onConnectionDelete?.(connection.id)}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default ConnectionRenderer;
