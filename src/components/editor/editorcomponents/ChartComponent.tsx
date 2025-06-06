import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { ChartElement } from "@/interfaces/element";

const ChartComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const chartElement = element as ChartElement;

  return (
    <div style={chartElement.styles} className={chartElement.tailwindStyles}>
      {chartElement.content || "Chart Component"}
    </div>
  );
};

export default ChartComponent;
