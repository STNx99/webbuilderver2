import React from "react";

interface SVGMarkersProps {
  selectedColor: string;
  defaultColor: string;
}

/**
 * Renders SVG marker definitions for connection arrowheads
 */
export const SVGMarkers: React.FC<SVGMarkersProps> = ({
  selectedColor,
  defaultColor,
}) => (
  <defs>
    <marker
      id="arrowhead"
      markerWidth="10"
      markerHeight="10"
      refX="9"
      refY="3"
      orient="auto"
    >
      <polygon points="0 0, 10 3, 0 6" fill={defaultColor} />
    </marker>
    <marker
      id="arrowhead-selected"
      markerWidth="10"
      markerHeight="10"
      refX="9"
      refY="3"
      orient="auto"
    >
      <polygon points="0 0, 10 3, 0 6" fill={selectedColor} />
    </marker>
  </defs>
);
