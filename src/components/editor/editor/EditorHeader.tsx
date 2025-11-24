"use client";

import React, { useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
  ChevronDown,
  Zap,
  Check,
  Search,
} from "lucide-react";
import { Viewport } from "@/hooks";
import CssTextareaImporter from "./CssTextareaImporter";
import { Button } from "@/components/ui/button";
import ExportDialog from "../ExportDialog";
import CollaborationButton from "./CollaborationButton";
import CollaboratorIndicator from "./CollaboratorIndicator";
import EventModeToggle from "../eventmode/EventModeToggle";
import { PageNavigationCommand } from "./PageNavigationCommand";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as Y from "yjs";

type EditorHeaderProps = {
  currentView: Viewport;
  setCurrentView: (view: Viewport) => void;
  projectId: string;
  isConnected?: boolean;
  isSynced?: boolean;
  ydoc?: Y.Doc | null;
  collabType?: "yjs" | "websocket";
};

const VIEWPORT_OPTIONS = [
  { view: "mobile" as const, icon: Smartphone, label: "Mobile" },
  { view: "tablet" as const, icon: Tablet, label: "Tablet" },
  { view: "desktop" as const, icon: Monitor, label: "Desktop" },
] as const;

function CollaborationStatus({
  isConnected,
  isSynced,
  collabType,
}: Pick<EditorHeaderProps, "isConnected" | "isSynced" | "collabType">) {
  const [navigationCommandOpen, setNavigationCommandOpen] = useState(false);
  const status =
    isConnected && isSynced
      ? {
          icon: Wifi,
          label: collabType === "yjs" ? "Synced" : "Synced",
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
          dotColor: "bg-emerald-500",
          pulse: false,
        }
      : isConnected
        ? {
            icon: Wifi,
            label: "Syncing...",
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            dotColor: "bg-amber-500",
            pulse: true,
          }
        : {
            icon: WifiOff,
            label: "Offline",
            color: "text-slate-400",
            bgColor: "bg-slate-500/10",
            dotColor: "bg-slate-400",
            pulse: false,
          };

  const StatusIcon = status.icon;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${status.bgColor} backdrop-blur-sm transition-all duration-200`}
      role="status"
      aria-live="polite"
      aria-label={`Collaboration status: ${status.label}`}
    >
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-full ${status.dotColor} blur-sm ${
            status.pulse ? "animate-pulse" : ""
          }`}
          aria-hidden="true"
        />
        <StatusIcon className={`w-3.5 h-3.5 ${status.color} relative z-10`} />
      </div>
      <span
        className={`text-xs font-semibold ${status.color} whitespace-nowrap`}
      >
        {status.label}
      </span>
    </div>
  );
}

function ViewportSelector({
  currentView,
  setCurrentView,
}: Pick<EditorHeaderProps, "currentView" | "setCurrentView">) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-8 px-2 hover:bg-muted transition-colors"
          aria-label="Select viewport size"
          aria-expanded={open}
        >
          {VIEWPORT_OPTIONS.find((opt) => opt.view === currentView)?.icon &&
            React.createElement(
              VIEWPORT_OPTIONS.find((opt) => opt.view === currentView)!.icon,
              { className: "w-4 h-4" },
            )}
          <span className="text-xs font-medium capitalize hidden sm:inline">
            {currentView}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 opacity-50 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="end">
        <Command>
          <CommandList className="max-h-48">
            <CommandEmpty>No viewport found</CommandEmpty>
            <CommandGroup>
              {VIEWPORT_OPTIONS.map(({ view, icon: Icon, label }) => (
                <CommandItem
                  key={view}
                  value={view}
                  onSelect={() => {
                    setCurrentView(view);
                    setOpen(false);
                  }}
                  className={`cursor-pointer ${
                    currentView === view ? "bg-muted" : ""
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{label}</span>
                  {currentView === view && (
                    <Check className="w-4 h-4 ml-auto text-accent-foreground" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ControlsGroup({ projectId }: Pick<EditorHeaderProps, "projectId">) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-6 w-px bg-border" aria-hidden="true" />
      <CollaboratorIndicator projectId={projectId} />
      <CollaborationButton projectId={projectId} />
      <div className="h-6 w-px bg-border" aria-hidden="true" />
      <EventModeToggle />
      <ExportDialog />
    </div>
  );
}

export default function EditorHeader({
  currentView,
  setCurrentView,
  projectId,
  isConnected = false,
  isSynced = false,
  ydoc,
  collabType = "websocket",
}: EditorHeaderProps) {
  const [navigationCommandOpen, setNavigationCommandOpen] = useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setNavigationCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="relative z-40 flex items-center justify-between gap-3 sm:gap-4 border-b border-border bg-background shadow-sm px-3 sm:px-4 py-2.5 transition-colors duration-200">
        {/* Left Section: Logo/Branding + Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-none">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 hidden sm:flex">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary">Builder</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNavigationCommandOpen(true)}
            className="h-8 w-32 sm:w-40 px-3 py-1.5 text-xs rounded-lg bg-input border border-border hover:bg-muted transition-all"
            aria-label="Open navigation command"
          >
            <Search className="w-4 h-4 mr-2" />
            Navigate... (Cmd+K)
          </Button>
          <CssTextareaImporter />
        </div>

        {/* Center Section: Collaboration Status */}
        <div className="hidden md:flex items-center">
          <CollaborationStatus
            isConnected={isConnected}
            isSynced={isSynced}
            collabType={collabType}
          />
        </div>

        {/* Right Section: Controls, Viewport Selector */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <ControlsGroup projectId={projectId} />
          <div className="h-6 w-px bg-border" aria-hidden="true" />
          <ViewportSelector
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </div>

        {/* Mobile Collaboration Status */}
        <div className="md:hidden">
          <CollaborationStatus
            isConnected={isConnected}
            isSynced={isSynced}
            collabType={collabType}
          />
        </div>
      </header>

      <PageNavigationCommand
        open={navigationCommandOpen}
        setOpen={setNavigationCommandOpen}
      />
    </>
  );
}
