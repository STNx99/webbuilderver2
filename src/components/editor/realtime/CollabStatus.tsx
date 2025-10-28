"use client";

import React from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollabStatusProps {
  isConnected: boolean;
  connectionState: "connected" | "disconnected" | "connecting" | "error";
  isSynced?: boolean;
  error?: string | null;
  className?: string;
}

export function CollabStatus({
  isConnected,
  connectionState,
  isSynced = false,
  error,
  className,
}: CollabStatusProps) {
  const getStatusColor = () => {
    if (error) return "text-red-500";
    switch (connectionState) {
      case "connected":
        return isSynced ? "text-green-500" : "text-yellow-500";
      case "connecting":
        return "text-yellow-500";
      case "disconnected":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = () => {
    if (error) return "Offline Mode";
    switch (connectionState) {
      case "connected":
        return isSynced ? "Live" : "Syncing...";
      case "connecting":
        return "Connecting...";
      case "disconnected":
        return "Offline Mode";
      case "error":
        return "Offline Mode";
      default:
        return "Offline Mode";
    }
  };

  const getStatusIcon = () => {
    if (error) {
      return <WifiOff className="w-4 h-4" />;
    }

    switch (connectionState) {
      case "connected":
        return isSynced ? (
          <div className="relative">
            <Wifi className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        ) : (
          <Loader2 className="w-4 h-4 animate-spin" />
        );
      case "connecting":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "disconnected":
        return <WifiOff className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md bg-background/50 border border-border/50 backdrop-blur-sm",
        className,
      )}
      title={
        error
          ? "Collaboration server unavailable - working offline"
          : getStatusText()
      }
    >
      <div className={cn("transition-colors duration-200", getStatusColor())}>
        {getStatusIcon()}
      </div>
      <span
        className={cn(
          "text-xs font-medium transition-colors duration-200",
          getStatusColor(),
        )}
      >
        {getStatusText()}
      </span>
    </div>
  );
}

export function CollabStatusMinimal({
  isConnected,
  connectionState,
  isSynced = false,
  error,
  className,
}: CollabStatusProps) {
  const getStatusColor = () => {
    if (error) return "bg-orange-500";
    switch (connectionState) {
      case "connected":
        return isSynced ? "bg-green-500" : "bg-yellow-500";
      case "connecting":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-gray-400";
      case "error":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  const getTooltip = () => {
    if (error)
      return "Collaboration server unavailable - working offline. Changes saved locally.";
    switch (connectionState) {
      case "connected":
        return isSynced ? "Live collaboration active" : "Syncing changes...";
      case "connecting":
        return "Connecting to collaboration server...";
      case "disconnected":
        return "Offline - changes saved locally";
      case "error":
        return "Collaboration server unavailable - working offline. Changes saved locally.";
      default:
        return "Offline - changes saved locally";
    }
  };

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      title={getTooltip()}
    >
      <div className="relative">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-colors duration-200",
            getStatusColor(),
            connectionState === "connected" && isSynced && "animate-pulse",
          )}
        />
      </div>
    </div>
  );
}
