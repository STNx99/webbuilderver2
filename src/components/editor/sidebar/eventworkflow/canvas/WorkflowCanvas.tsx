"use client";

import React, { useRef, useEffect, useState } from "react";
import { WorkflowNodeComponent } from "../nodes/WorkflowNode";
import { ConnectionRenderer } from "./ConnectionRenderer";
import { NodeType, Position } from "../types/workflow.types";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  Plus,
  Grid3x3,
} from "lucide-react";
import { toast } from "sonner";
import { useWorkflowCanvas } from "@/hooks/editor";
import { cn } from "@/lib/utils";
import { getDefaultNodeConfig } from "@/lib/utils/workflowUtils";

interface WorkflowCanvasProps {
  readOnly?: boolean;
  onWorkflowChange?: (workflow: any) => void;
  onNodeConfigure?: (nodeId: string) => void;
  className?: string;
}

interface DragState {
  nodeId: string;
  startX: number;
  startY: number;
  startClientX: number;
  startClientY: number;
}

interface ConnectionState {
  sourceNodeId: string;
  isOutput: boolean;
  currentX: number;
  currentY: number;
}

export const WorkflowCanvas = ({
  readOnly = false,
  onWorkflowChange,
  onNodeConfigure,
  className,
}: WorkflowCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const {
    workflow,
    selection,
    zoom,
    panX,
    panY,
    addNode,
    deleteNode,
    addConnection,
    deleteConnection,
    selectNode,
    selectConnection,
    deselectAll,
    setZoom,
    setPan,
    resetView,
    moveNode,
  } = useWorkflowCanvas();

  // Handle canvas mouse down for panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 2 && !dragState && !connectionState) {
      // Middle mouse button or no active drag/connection
      if (e.button === 1 || (e.ctrlKey && e.button === 0)) {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startPanX = panX;
        const startPanY = panY;

        const handleMouseMove = (moveE: MouseEvent) => {
          const deltaX = moveE.clientX - startX;
          const deltaY = moveE.clientY - startY;
          setPan(startPanX + deltaX, startPanY + deltaY);
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    }
  };

  // Handle node mouse down for dragging
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    selectNode(nodeId);

    setDragState({
      nodeId,
      startX: node.position.x,
      startY: node.position.y,
      startClientX: e.clientX,
      startClientY: e.clientY,
    });

    const handleMouseMove = (moveE: MouseEvent) => {
      if (!canvasRef.current) return;

      const deltaClientX = moveE.clientX - (e as any).clientX;
      const deltaClientY = moveE.clientY - (e as any).clientY;

      // Apply zoom to delta
      const deltaX = deltaClientX / zoom;
      const deltaY = deltaClientY / zoom;

      moveNode(nodeId, {
        x: node.position.x + deltaX,
        y: node.position.y + deltaY,
      });

      setMousePos({
        x:
          (moveE.clientX -
            (canvasRef.current?.getBoundingClientRect().left || 0) -
            panX) /
          zoom,
        y:
          (moveE.clientY -
            (canvasRef.current?.getBoundingClientRect().top || 0) -
            panY) /
          zoom,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setDragState(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle port mouse down for connections
  const handlePortMouseDown = (
    e: React.MouseEvent,
    nodeId: string,
    isOutput: boolean,
  ) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Validate connection type
    if (!isOutput && node.type === NodeType.TRIGGER) return;
    if (isOutput && node.type === NodeType.OUTPUT) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setConnectionState({
      sourceNodeId: nodeId,
      isOutput,
      currentX: e.clientX,
      currentY: e.clientY,
    });

    const handleMouseMove = (moveE: MouseEvent) => {
      setConnectionState((prev) =>
        prev
          ? {
              ...prev,
              currentX: moveE.clientX,
              currentY: moveE.clientY,
            }
          : null,
      );
    };

    const handleMouseUp = (upE: MouseEvent) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setConnectionState(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle node mouse up for connection completion
  const handleNodeMouseUp = (e: React.MouseEvent, targetNodeId: string) => {
    if (!connectionState || readOnly) return;
    e.stopPropagation();

    const targetNode = workflow.nodes.find((n) => n.id === targetNodeId);
    if (!targetNode) return;

    // Validate connection
    if (connectionState.sourceNodeId === targetNodeId) return; // No self-connections
    if (connectionState.isOutput && targetNode.type === NodeType.TRIGGER)
      return; // Can't connect to trigger
    if (!connectionState.isOutput && targetNode.type === NodeType.OUTPUT)
      return; // Can't connect from output

    // Only allow output -> input connections
    if (connectionState.isOutput && !connectionState.isOutput) return;

    // Create the connection
    addConnection(connectionState.sourceNodeId, targetNodeId);
    toast.success("Nodes connected!");
    setConnectionState(null);
  };

  const handleCanvasClick = () => {
    deselectAll();
  };

  const handleCanvasWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = zoom * delta;
    setZoom(newZoom);
  };

  const handleAddNode = (type: NodeType) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = (rect.width / 2 - panX) / zoom;
    const centerY = (rect.height / 2 - panY) / zoom;

    const nodeLabel = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
    const defaultConfig = getDefaultNodeConfig(type);

    addNode(
      type,
      { x: centerX - 96, y: centerY - 30 },
      {
        label: nodeLabel,
        description: `New ${type} node`,
        config: defaultConfig,
      },
    );
  };

  const handleDeleteSelected = () => {
    if (selection.selectedNodeId) {
      deleteNode(selection.selectedNodeId);
      toast.success("Node deleted");
    } else if (selection.selectedConnectionId) {
      deleteConnection(selection.selectedConnectionId);
      toast.success("Connection deleted");
    }
  };

  const handleZoomIn = () => {
    setZoom(zoom * 1.2);
  };

  const handleZoomOut = () => {
    setZoom(zoom / 1.2);
  };

  useEffect(() => {
    onWorkflowChange?.(workflow);
  }, [workflow, onWorkflowChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        handleDeleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selection]);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden select-none",
        className,
      )}
      ref={canvasRef}
      onMouseDown={handleCanvasMouseDown}
      onClick={handleCanvasClick}
      onWheel={handleCanvasWheel}
      style={{ userSelect: "none" }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(148, 163, 184, 0.1) 25%, rgba(148, 163, 184, 0.1) 26%, transparent 27%, transparent 74%, rgba(148, 163, 184, 0.1) 75%, rgba(148, 163, 184, 0.1) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(148, 163, 184, 0.1) 25%, rgba(148, 163, 184, 0.1) 26%, transparent 27%, transparent 74%, rgba(148, 163, 184, 0.1) 75%, rgba(148, 163, 184, 0.1) 76%, transparent 77%, transparent)
          `,
          backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
          backgroundPosition: `${panX}px ${panY}px`,
        }}
      />

      {/* Canvas Content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: dragState ? "none" : "transform 0.2s ease",
        }}
      >
        {workflow.nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
            }}
            onMouseUp={(e) => handleNodeMouseUp(e, node.id)}
          >
            <WorkflowNodeComponent
              node={node}
              isSelected={selection.selectedNodeId === node.id}
              onSelect={selectNode}
              onNodeMouseDown={handleNodeMouseDown}
              onPortMouseDown={handlePortMouseDown}
              onConfigure={onNodeConfigure}
            />
          </div>
        ))}

        {/* Connection Draft Line */}
        {connectionState && canvasRef.current && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "200vw",
              height: "200vh",
              pointerEvents: "none",
            }}
          >
            <line
              x1={
                workflow.nodes.find(
                  (n) => n.id === connectionState.sourceNodeId,
                )?.position.x! + (connectionState.isOutput ? 192 : 0)
              }
              y1={
                workflow.nodes.find(
                  (n) => n.id === connectionState.sourceNodeId,
                )?.position.y! + 60
              }
              x2={
                (connectionState.currentX -
                  (canvasRef.current?.getBoundingClientRect().left || 0) -
                  panX) /
                zoom
              }
              y2={
                (connectionState.currentY -
                  (canvasRef.current?.getBoundingClientRect().top || 0) -
                  panY) /
                zoom
              }
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              pointerEvents="none"
            />
          </svg>
        )}
      </div>

      {/* Connection Renderer */}
      <ConnectionRenderer
        connections={workflow.connections}
        nodes={Object.fromEntries(
          workflow.nodes.map((node) => [node.id, node.position]),
        )}
        selectedConnectionId={selection.selectedConnectionId}
        onConnectionSelect={selectConnection}
        onConnectionDelete={deleteConnection}
        zoom={zoom}
        panX={panX}
        panY={panY}
      />

      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 flex gap-2 z-40">
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={handleZoomIn}
            title="Zoom in (Ctrl + Scroll)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={handleZoomOut}
            title="Zoom out (Ctrl + Scroll)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-px bg-border" />
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={resetView}
            title="Reset view"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="text-xs text-muted-foreground px-2 py-2">
            {Math.round(zoom * 100)}%
          </div>
        </div>
      </div>

      {/* Right Toolbar - Node Creation */}
      {!readOnly && (
        <div className="absolute top-4 right-4 flex gap-2 z-40">
          <div className="bg-card border border-border rounded-lg p-2 shadow-lg flex flex-col gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-2 text-xs"
              onClick={() => handleAddNode(NodeType.TRIGGER)}
              title="Add trigger node"
            >
              <Plus className="h-4 w-4" />
              Trigger
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-2 text-xs"
              onClick={() => handleAddNode(NodeType.ACTION)}
              title="Add action node"
            >
              <Plus className="h-4 w-4" />
              Action
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-2 text-xs"
              onClick={() => handleAddNode(NodeType.CONDITION)}
              title="Add condition node"
            >
              <Plus className="h-4 w-4" />
              Condition
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-2 text-xs"
              onClick={() => handleAddNode(NodeType.OUTPUT)}
              title="Add output node"
            >
              <Plus className="h-4 w-4" />
              Output
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Toolbar - Actions */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-40">
        {(selection.selectedNodeId || selection.selectedConnectionId) && (
          <Button
            size="sm"
            variant="destructive"
            className="gap-2"
            onClick={handleDeleteSelected}
            title="Delete selected (Del)"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>

      {/* Empty State */}
      {workflow.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Grid3x3 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-1">
              No nodes yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Use the buttons on the right to add nodes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;
