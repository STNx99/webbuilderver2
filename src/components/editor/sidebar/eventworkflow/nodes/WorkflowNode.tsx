"use client";

import React, { useRef, useState } from "react";
import {
  WorkflowNode as WorkflowNodeType,
  NodeType,
} from "../types/workflow.types";
import {
  Zap,
  GitBranch,
  ArrowRight,
  CheckCircle,
  Trash2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useWorkflowCanvas } from "@/hooks/editor";

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onNodeMouseDown?: (e: React.MouseEvent, nodeId: string) => void;
  onPortMouseDown?: (
    e: React.MouseEvent,
    nodeId: string,
    isOutput: boolean,
  ) => void;
  onConfigure?: (nodeId: string) => void;
}

const NodeIcon = ({ type }: { type: NodeType }) => {
  switch (type) {
    case NodeType.TRIGGER:
      return <Zap className="h-4 w-4" />;
    case NodeType.ACTION:
      return <ArrowRight className="h-4 w-4" />;
    case NodeType.CONDITION:
      return <GitBranch className="h-4 w-4" />;
    case NodeType.OUTPUT:
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

const getNodeColorClasses = (type: NodeType, isSelected: boolean) => {
  const baseClasses =
    "transition-all duration-200 border-2 rounded-lg p-3 bg-card hover:shadow-md";

  if (isSelected) {
    switch (type) {
      case NodeType.TRIGGER:
        return `${baseClasses} border-yellow-500 shadow-lg shadow-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/30`;
      case NodeType.ACTION:
        return `${baseClasses} border-blue-500 shadow-lg shadow-blue-500/20 bg-blue-50 dark:bg-blue-950/30`;
      case NodeType.CONDITION:
        return `${baseClasses} border-purple-500 shadow-lg shadow-purple-500/20 bg-purple-50 dark:bg-purple-950/30`;
      case NodeType.OUTPUT:
        return `${baseClasses} border-green-500 shadow-lg shadow-green-500/20 bg-green-50 dark:bg-green-950/30`;
      default:
        return `${baseClasses} border-gray-500`;
    }
  }

  switch (type) {
    case NodeType.TRIGGER:
      return `${baseClasses} border-yellow-300 dark:border-yellow-700 hover:border-yellow-400`;
    case NodeType.ACTION:
      return `${baseClasses} border-blue-300 dark:border-blue-700 hover:border-blue-400`;
    case NodeType.CONDITION:
      return `${baseClasses} border-purple-300 dark:border-purple-700 hover:border-purple-400`;
    case NodeType.OUTPUT:
      return `${baseClasses} border-green-300 dark:border-green-700 hover:border-green-400`;
    default:
      return `${baseClasses} border-gray-300`;
  }
};

const getIconColor = (type: NodeType) => {
  switch (type) {
    case NodeType.TRIGGER:
      return "text-yellow-600 dark:text-yellow-400";
    case NodeType.ACTION:
      return "text-blue-600 dark:text-blue-400";
    case NodeType.CONDITION:
      return "text-purple-600 dark:text-purple-400";
    case NodeType.OUTPUT:
      return "text-green-600 dark:text-green-400";
    default:
      return "text-gray-600";
  }
};

export const WorkflowNodeComponent = ({
  node,
  isSelected,
  onSelect,
  onNodeMouseDown,
  onPortMouseDown,
  onConfigure,
}: WorkflowNodeProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [showPorts, setShowPorts] = useState(false);
  const { deleteNode } = useWorkflowCanvas();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete node "${node.data.label}"?`)) {
      deleteNode(node.id);
    }
  };

  const handleConfigure = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfigure?.(node.id);
  };

  const handleNodeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
    onNodeMouseDown?.(e, node.id);
  };

  const handlePortMouseDown = (e: React.MouseEvent, isOutput: boolean) => {
    e.stopPropagation();
    e.preventDefault();
    onPortMouseDown?.(e, node.id, isOutput);
  };

  return (
    <div
      ref={nodeRef}
      onMouseDown={handleNodeMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onMouseEnter={() => setShowPorts(true)}
      onMouseLeave={() => setShowPorts(false)}
      className={clsx(
        getNodeColorClasses(node.type, isSelected),
        "w-48 group cursor-grab active:cursor-grabbing select-none",
      )}
    >
      {/* Input Port */}
      {node.inputs && node.type !== NodeType.TRIGGER && (
        <div
          onMouseDown={(e) => handlePortMouseDown(e, false)}
          className={clsx(
            "absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 bg-card cursor-crosshair z-10",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isSelected
              ? "border-gray-700 dark:border-gray-300"
              : "border-gray-400",
          )}
          title="Drag to create connection"
        />
      )}

      {/* Output Port */}
      {node.outputs &&
        node.outputs.length > 0 &&
        node.type !== NodeType.OUTPUT && (
          <div
            onMouseDown={(e) => handlePortMouseDown(e, true)}
            className={clsx(
              "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 bg-card cursor-crosshair z-10",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              isSelected
                ? "border-gray-700 dark:border-gray-300"
                : "border-gray-400",
            )}
            title="Drag to create connection"
          />
        )}

      {/* Node Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={getIconColor(node.type)}>
          <NodeIcon type={node.type} />
        </div>
        <span className="font-semibold text-sm flex-1 truncate">
          {node.data.label}
        </span>
      </div>

      {/* Node Description */}
      {node.data.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {node.data.description}
        </p>
      )}

      {/* Node Type Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs px-2 py-1 rounded-full bg-muted font-medium capitalize">
          {node.type}
        </span>
      </div>

      {/* Node Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-border">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 flex-1"
          onClick={handleConfigure}
          title="Configure node"
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 flex-1 hover:text-destructive"
          onClick={handleDelete}
          title="Delete node"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default WorkflowNodeComponent;
