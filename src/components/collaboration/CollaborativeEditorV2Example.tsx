"use client";

import { useState, useEffect } from "react";
import { useYjsCollabV2 } from "@/hooks/realtime/use-yjs-collab-v2";
import { EditorElement } from "@/types/global.type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Users,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Move,
} from "lucide-react";

interface CollaborativeEditorV2ExampleProps {
  pageId: string;
  projectId: string;
  wsUrl?: string;
}

export function CollaborativeEditorV2Example({
  pageId,
  projectId,
  wsUrl = "ws://localhost:8082",
}: CollaborativeEditorV2ExampleProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [conflictCount, setConflictCount] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );

  const addLog = (message: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev.slice(0, 49),
    ]);
  };

  const {
    isConnected,
    roomState,
    error,
    isSynced,
    pendingUpdates,
    ydoc,
    provider,
    createElement,
    updateElement,
    deleteElement,
    moveElement,
  } = useYjsCollabV2({
    pageId,
    projectId,
    wsUrl,
    enabled: true,
    onSync: () => {
      addLog("✅ Successfully synced with server");
    },
    onError: (error) => {
      addLog(`❌ Error: ${error.message}`);
    },
    onConflict: (conflict) => {
      addLog(
        `⚠️ Conflict resolved: ${conflict.conflictType} on element ${conflict.elementId}`,
      );
      setConflictCount((prev) => prev + 1);
    },
    enableDebug: true,
  });

  // Example: Create a new element
  const handleCreateElement = async () => {
    try {
      const newElement: EditorElement = {
        id: `elem-${Date.now()}`,
        type: "Text",
        content: "Hello from V2 WebSocket!",
        pageId,
        styles: {
          default: {
            color: "#333",
            fontSize: "16px",
          },
          sm: {},
          md: {},
        },
      } as any;

      addLog(`Creating element: ${newElement.id}`);
      const result = await createElement(newElement);
      addLog(`✅ Element created successfully (version ${result.version})`);
    } catch (err) {
      addLog(
        `❌ Failed to create element: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  // Example: Update an element
  const handleUpdateElement = async () => {
    if (!selectedElementId) {
      addLog("⚠️ No element selected");
      return;
    }

    try {
      addLog(`Updating element: ${selectedElementId}`);
      const result = await updateElement(
        selectedElementId,
        {
          content: `Updated at ${new Date().toLocaleTimeString()}`,
          styles: {
            default: {
              color: "#007bff",
              fontSize: "18px",
              fontWeight: "bold",
            },
          },
        } as any,
        "partial",
      );
      addLog(`✅ Element updated successfully (version ${result.version})`);
    } catch (err) {
      addLog(
        `❌ Failed to update element: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  // Example: Delete an element
  const handleDeleteElement = async () => {
    if (!selectedElementId) {
      addLog("⚠️ No element selected");
      return;
    }

    try {
      addLog(`Deleting element: ${selectedElementId}`);
      const result = await deleteElement(selectedElementId, false, true);
      addLog(`✅ Element deleted successfully (version ${result.version})`);
      setSelectedElementId(null);
    } catch (err) {
      addLog(
        `❌ Failed to delete element: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  // Example: Move an element
  const handleMoveElement = async () => {
    if (!selectedElementId) {
      addLog("⚠️ No element selected");
      return;
    }

    try {
      addLog(`Moving element: ${selectedElementId}`);
      const result = await moveElement(selectedElementId, null, 0);
      addLog(`✅ Element moved successfully (version ${result.version})`);
    } catch (err) {
      addLog(
        `❌ Failed to move element: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  // Example: Send mouse position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (provider && isConnected) {
      provider.sendMousePosition(e.clientX, e.clientY);
    }
  };

  // Example: Select element
  const handleSelectElement = (elementId: string) => {
    setSelectedElementId(elementId);
    if (provider && isConnected) {
      provider.selectElement(elementId);
    }
    addLog(`Selected element: ${elementId}`);
  };

  const getStatusIcon = () => {
    switch (roomState) {
      case "connected":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "connecting":
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (roomState) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-300";
      case "connecting":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "error":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>WebSocket V2 Collaborative Editor</span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge className={getStatusColor()}>
                {roomState.toUpperCase()}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Real-time collaboration using WebSocket V2 protocol with element
            operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Page ID</p>
              <p className="text-sm font-mono">{pageId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Project ID</p>
              <p className="text-sm font-mono">{projectId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Synced</p>
              <p className="text-sm font-semibold">
                {isSynced ? "✅ Yes" : "⏳ Waiting..."}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Conflicts</p>
              <p className="text-sm font-semibold">{conflictCount}</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Element Operations */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Element Operations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                onClick={handleCreateElement}
                disabled={!isConnected || !isSynced}
                className="w-full"
                variant="default"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button
                onClick={handleUpdateElement}
                disabled={!isConnected || !isSynced || !selectedElementId}
                className="w-full"
                variant="secondary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update
              </Button>
              <Button
                onClick={handleDeleteElement}
                disabled={!isConnected || !isSynced || !selectedElementId}
                className="w-full"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button
                onClick={handleMoveElement}
                disabled={!isConnected || !isSynced || !selectedElementId}
                className="w-full"
                variant="outline"
              >
                <Move className="h-4 w-4 mr-2" />
                Move
              </Button>
            </div>
          </div>

          {/* Selected Element */}
          {selectedElementId && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-900">
                <strong>Selected Element:</strong> {selectedElementId}
              </p>
            </div>
          )}

          {/* Mouse Tracking Demo */}
          <div
            className="border-2 border-dashed border-gray-300 rounded p-4 h-32 cursor-crosshair bg-gray-50"
            onMouseMove={handleMouseMove}
          >
            <p className="text-sm text-gray-600 text-center">
              Move your mouse here to broadcast position to other users
            </p>
          </div>

          {/* Activity Log */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Activity Log</h3>
            <div className="bg-gray-900 text-gray-100 rounded p-3 h-64 overflow-y-auto font-mono text-xs space-y-1">
              {logs.length === 0 ? (
                <p className="text-gray-500">No activity yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-gray-300">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Debug Info */}
          <details className="space-y-2">
            <summary className="text-sm font-semibold cursor-pointer">
              Debug Information
            </summary>
            <div className="bg-gray-100 rounded p-3 text-xs font-mono space-y-1">
              <p>
                <strong>Connected:</strong> {isConnected ? "true" : "false"}
              </p>
              <p>
                <strong>Synced:</strong> {isSynced ? "true" : "false"}
              </p>
              <p>
                <strong>Room State:</strong> {roomState}
              </p>
              <p>
                <strong>Pending Updates:</strong> {pendingUpdates}
              </p>
              <p>
                <strong>Provider:</strong> {provider ? "initialized" : "null"}
              </p>
              <p>
                <strong>Ydoc:</strong> {ydoc ? "initialized" : "null"}
              </p>
              <p>
                <strong>WebSocket URL:</strong> {wsUrl}
              </p>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage Examples</CardTitle>
          <CardDescription>Code examples for common operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Create Element</h4>
            <pre className="bg-gray-900 text-gray-100 rounded p-3 text-xs overflow-x-auto">
              {`const result = await createElement({
  id: "elem-001",
  type: "text",
  content: "Hello World",
  pageId,
  projectId,
});`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Update Element (Partial)</h4>
            <pre className="bg-gray-900 text-gray-100 rounded p-3 text-xs overflow-x-auto">
              {`const result = await updateElement(
  "elem-001",
  { content: "Updated text" },
  "partial"
);`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Delete Element</h4>
            <pre className="bg-gray-900 text-gray-100 rounded p-3 text-xs overflow-x-auto">
              {`const result = await deleteElement(
  "elem-001",
  false, // deleteChildren
  true   // preserveStructure
);`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Move Element</h4>
            <pre className="bg-gray-900 text-gray-100 rounded p-3 text-xs overflow-x-auto">
              {`const result = await moveElement(
  "elem-001",
  "parent-id",
  0 // position
);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
