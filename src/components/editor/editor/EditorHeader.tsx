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
} from "lucide-react";
import { Viewport } from "@/hooks";
import CssTextareaImporter from "./CssTextareaImporter";
import { Button } from "@/components/ui/button";
import ExportDialog from "../ExportDialog";
import CollaborationButton from "./CollaborationButton";
import CollaboratorIndicator from "./CollaboratorIndicator";
import EventModeToggle from "../eventmode/EventModeToggle";
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
  handlePageNavigation: (e: React.FocusEvent<HTMLInputElement>) => void;
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
          className="gap-2 h-8 px-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
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
                    currentView === view ? "bg-slate-100 dark:bg-slate-800" : ""
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{label}</span>
                  {currentView === view && (
                    <Check className="w-4 h-4 ml-auto text-green-600 dark:text-green-400" />
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

function NavigationInput({
  handlePageNavigation,
}: Pick<EditorHeaderProps, "handlePageNavigation">) {
  const [value, setValue] = useState("/");
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handlePageNavigation(e);
    setOpen(false);
  };

  return (
    <div className="relative group">
      <input
        type="text"
        placeholder="Navigate... (e.g., /about)"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setOpen(true)}
        className="h-8 w-32 sm:w-40 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500 transition-all"
        aria-label="Page path navigation"
      />
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 hidden sm:block">
          <div className="p-2 text-xs text-slate-500 dark:text-slate-400">
            <p className="font-semibold mb-1">Navigation tips:</p>
            <ul className="space-y-0.5">
              <li>• Use "/" for home</li>
              <li>• Type any path to navigate</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlsGroup({ projectId }: Pick<EditorHeaderProps, "projectId">) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="h-6 w-px bg-slate-200 dark:bg-slate-700"
        aria-hidden="true"
      />
      <CollaboratorIndicator projectId={projectId} />
      <CollaborationButton projectId={projectId} />
      <div
        className="h-6 w-px bg-slate-200 dark:bg-slate-700"
        aria-hidden="true"
      />
      <EventModeToggle />
      <ExportDialog />
    </div>
  );
}

export default function EditorHeader({
  handlePageNavigation,
  currentView,
  setCurrentView,
  projectId,
  isConnected = false,
  isSynced = false,
  ydoc,
  collabType = "websocket",
}: EditorHeaderProps) {
  return (
    <header className="relative z-40 flex items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm px-3 sm:px-4 py-2.5 transition-colors duration-200">
      {/* Left Section: Logo/Branding + Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-none">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 hidden sm:flex">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            Builder
          </span>
        </div>
        <NavigationInput handlePageNavigation={handlePageNavigation} />
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
        <div
          className="h-6 w-px bg-slate-200 dark:bg-slate-700"
          aria-hidden="true"
        />
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
  );
}
