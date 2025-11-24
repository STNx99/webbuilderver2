"use client";

import { useState, useEffect } from "react";
import { useYjsCollabV2 } from "@/hooks/realtime/use-yjs-collab-v2";
import { useElementStore } from "@/globalstore/elementstore";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Bug,
  Database,
  Network,
} from "lucide-react";

interface TestV2ConnectionProps {
  pageId: string;
  projectId: string;
  wsUrl?: string;
}

export function TestV2Connection({
  pageId,
  projectId,
  wsUrl = "ws://localhost:8082",
}: TestV2ConnectionProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const { elements } = useElementStore();

  const {
    isConnected,
    roomState,
    error,
    isSynced,
    pendingUpdates,
    ydoc,
    provider,
  } = useYjsCollabV2({
    pageId,
    projectId,
    wsUrl,
    enabled: true,
    onSync: () => {
      addLog("✅ Successfully synced with server");
      updateDebugInfo();
    },
    onError: (error) => {
      addLog(`❌ Error: ${error.message}`);
    },
    onConflict: (conflict) => {
      addLog(`⚠️ Conflict: ${conflict.conflictType} on ${conflict.elementId}`);
    },
    enableDebug: true,
  });

  const updateDebugInfo = () => {
    const info: any = {
      connection: {
        isConnected,
        roomState,
        isSynced,
        pendingUpdates,
        error: error || null,
      },
      elements: {
        count: elements.length,
        types: [...new Set(elements.map((el) => el.type))],
        ids: elements.map((el) => el.id.slice(0, 8)),
      },
      yjs: {
        doc: !!ydoc,
        provider: !!provider,
        awareness: !!provider?.awareness,
      },
    };

    // Add container validation info
    if (elements.length > 0) {
      const containers = elements.filter((el) =>
        ["Frame", "Section", "Form", "List", "Carousel"].includes(el.type),
      );
      info.elements.containers = containers.map((container) => ({
        type: container.type,
        id: container.id.slice(0, 8),
        hasElements: Array.isArray((container as any).elements),
        elementsCount: (container as any).elements?.length || 0,
      }));
    }

    setDebugInfo(info);
  };

  useEffect(() => {
    updateDebugInfo();
  }, [
    isConnected,
    roomState,
    isSynced,
    pendingUpdates,
    elements,
    ydoc,
    provider,
  ]);

  const handleRefreshDebug = () => {
    addLog("🔄 Refreshing debug info");
    updateDebugInfo();
  };

  const handleTestConnection = () => {
    addLog("🔍 Testing connection...");
    if (provider?.connected) {
      addLog("✅ WebSocket connected");
    } else {
      addLog("❌ WebSocket not connected");
    }

    if (provider?.synched) {
      addLog("✅ Provider synced");
    } else {
      addLog("⏳ Provider not synced");
    }
  };

  const handleInspectElements = () => {
    addLog(`🔍 Inspecting ${elements.length} elements`);
    elements.forEach((el, i) => {
      const isContainer = [
        "Frame",
        "Section",
        "Form",
        "List",
        "Carousel",
      ].includes(el.type);
      const container = el as any;
      const hasElements = Array.isArray(container.elements);
      const elementsCount = hasElements ? container.elements.length : 0;
      addLog(
        `  [${i}] ${el.type} [${el.id.slice(0, 8)}] - container: ${isContainer}, has elements: ${hasElements}, count: ${elementsCount}`,
      );
    });
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
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              WebSocket V2 Debug Console
            </span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge className={getStatusColor()}>
                {roomState.toUpperCase()}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Debug and test WebSocket V2 connection and element synchronization
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
              <p className="text-sm text-muted-foreground">Elements</p>
              <p className="text-sm font-semibold">{elements.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-sm font-semibold">{pendingUpdates}</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Test Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleTestConnection} variant="outline" size="sm">
              <Network className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Button onClick={handleInspectElements} variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Inspect Elements
            </Button>
            <Button onClick={handleRefreshDebug} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Debug
            </Button>
          </div>

          {/* Activity Log */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Activity Log</h3>
            <ScrollArea className="h-64 w-full border rounded p-3">
              <div className="space-y-1 font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No activity yet...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-gray-700">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Debug Info */}
          <details className="space-y-2">
            <summary className="text-sm font-semibold cursor-pointer">
              Debug Information
            </summary>
            <div className="bg-gray-100 rounded p-3 text-xs font-mono space-y-2 max-h-96 overflow-y-auto">
              <div>
                <strong>Connection:</strong>
                <pre className="mt-1">
                  {JSON.stringify(debugInfo.connection, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Elements:</strong>
                <pre className="mt-1">
                  {JSON.stringify(debugInfo.elements, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Yjs:</strong>
                <pre className="mt-1">
                  {JSON.stringify(debugInfo.yjs, null, 2)}
                </pre>
              </div>
            </div>
          </details>

          {/* Raw Elements */}
          <details className="space-y-2">
            <summary className="text-sm font-semibold cursor-pointer">
              Raw Elements Data
            </summary>
            <ScrollArea className="h-64 w-full border rounded p-3">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(elements, null, 2)}
              </pre>
            </ScrollArea>
          </details>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>1. Check Connection:</strong> Click "Test Connection" to
            verify WebSocket status
          </p>
          <p>
            <strong>2. Inspect Elements:</strong> Click "Inspect Elements" to
            see element structure
          </p>
          <p>
            <strong>3. Monitor Logs:</strong> Watch the activity log for sync
            events and errors
          </p>
          <p>
            <strong>4. Check Validation:</strong> Look for "missing elements: []
            for container" errors
          </p>
          <p>
            <strong>5. Browser Console:</strong> Check browser console for
            [YjsProviderV2] and [useYjsElementsV2] logs
          </p>
          <p>
            <strong>6. Server Logs:</strong> Check server logs for WebSocket
            connection and sync messages
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
