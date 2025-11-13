"use client";

import React, { useState } from "react";
import { NodeType } from "../types/workflow.types";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ArrowRight,
  GitBranch,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import clsx from "clsx";

interface NodePaletteProps {
  onNodeDragStart?: (e: React.DragEvent, nodeType: NodeType) => void;
  className?: string;
}

interface NodePaletteItem {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const NODE_PALETTE_ITEMS: NodePaletteItem[] = [
  {
    type: NodeType.TRIGGER,
    label: "Trigger",
    description: "Start your workflow",
    icon: <Zap className="h-4 w-4" />,
    color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700 hover:border-yellow-400",
  },
  {
    type: NodeType.ACTION,
    label: "Action",
    description: "Perform an action",
    icon: <ArrowRight className="h-4 w-4" />,
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 hover:border-blue-400",
  },
  {
    type: NodeType.CONDITION,
    label: "Condition",
    description: "Branch your workflow",
    icon: <GitBranch className="h-4 w-4" />,
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700 hover:border-purple-400",
  },
  {
    type: NodeType.OUTPUT,
    label: "Output",
    description: "End your workflow",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 hover:border-green-400",
  },
];

export const NodePalette = ({
  onNodeDragStart,
  className,
}: NodePaletteProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("nodeType", nodeType);
    onNodeDragStart?.(e, nodeType);
  };

  return (
    <div
      className={clsx(
        "bg-card border border-border rounded-lg shadow-lg",
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
      >
        <h3 className="font-semibold text-sm">Node Palette</h3>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border p-3 space-y-2 max-w-xs">
          <p className="text-xs text-muted-foreground mb-3">
            Drag nodes onto the canvas to build your workflow
          </p>

          {NODE_PALETTE_ITEMS.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className={clsx(
                "p-3 border-2 rounded-lg cursor-move transition-all hover:shadow-md active:opacity-50",
                item.color
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div>{item.icon}</div>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}

          <div className="pt-3 border-t border-border mt-3">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Hold Ctrl/Cmd while scrolling to zoom the canvas
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodePalette;
