import React from "react";
import { Input } from "@/components/ui/input";
import { Monitor, Smartphone, Tablet, Wifi, WifiOff } from "lucide-react";
import { Viewport } from "@/hooks";
import CssTextareaImporter from "./CssTextareaImporter";
import { Button } from "@/components/ui/button";
import ExportDialog from "../ExportDialog";
import CollaborationButton from "./CollaborationButton";
import CollaboratorIndicator from "./CollaboratorIndicator";
import EventModeToggle from "../eventmode/EventModeToggle";
import * as Y from "yjs";

type EditorHeaderProps = {
  handlePageNavigation: (e: React.FocusEvent<HTMLInputElement>) => void;
  currentView: Viewport;
  setCurrentView: (view: Viewport) => void;
  projectId: string;
  isConnected?: boolean;
  isSynced?: boolean;
  ydoc?: Y.Doc | null;
  collabType?: "yjs" | "websocket";
};

const EditorHeader: React.FC<EditorHeaderProps> = ({
  handlePageNavigation,
  currentView,
  setCurrentView,
  projectId,
  isConnected = false,
  isSynced = false,
  ydoc,
  collabType = "websocket",
}) => {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card shadow-sm p-2">
      <div className="flex items-center space-x-4">
        <Input
          placeholder="/"
          defaultValue={"/"}
          className="h-6 bg-gray-700"
          onBlur={handlePageNavigation}
        />
        <CssTextareaImporter />
      </div>

      <div className="flex items-center ">
        <div className="flex gap-4 items-center">
          {/* Collaboration Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/50 text-xs">
            {isConnected && isSynced ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  {collabType === "yjs" ? "Synced (Yjs)" : "Synced"}
                </span>
              </>
            ) : isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span className="text-yellow-600 font-medium">Syncing...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 font-medium">Offline</span>
              </>
            )}
          </div>

          <CollaboratorIndicator projectId={projectId} />
          <CollaborationButton projectId={projectId} />
          <EventModeToggle />
          <ExportDialog />
          {(["mobile", "tablet", "desktop"] as const).map((view) => (
            <Button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`flex rounded-md p-1 font-medium transition-colors font-sans items-center ${
                currentView === view
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {view === "mobile" && <Smartphone className="w-5" />}
              {view === "tablet" && <Tablet className="w-5" />}
              {view === "desktop" && <Monitor className="w-5" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
