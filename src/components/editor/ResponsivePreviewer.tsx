"use client"

import type React from "react"
import { useState } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { viewportSizes } from "@/constants/viewports"

type Breakpoint = "mobile" | "tablet" | "desktop"

interface ResponsivePreviewProps {
  currentView: Breakpoint
  onViewChange: (view: Breakpoint) => void
  children: React.ReactNode
}

const breakpointInfo = {
  mobile: {
    icon: <Smartphone className="w-4 h-4" />,
    label: "Mobile",
    range: "≤ 767px",
    description: "Phone screens",
  },
  tablet: {
    icon: <Tablet className="w-4 h-4" />,
    label: "Tablet",
    range: "768px - 1023px",
    description: "Tablet screens",
  },
  desktop: {
    icon: <Monitor className="w-4 h-4" />,
    label: "Desktop",
    range: "≥ 1024px",
    description: "Desktop screens",
  },
}

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({ currentView, onViewChange, children }) => {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Responsive Controls Header */}
      <div className="flex items-center justify-between border-b border-border bg-card shadow-sm p-3">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-card-foreground">Responsive Preview</h2>
          <div className="flex items-center gap-2">
            {breakpointInfo[currentView].icon}
            <span className="text-sm text-muted-foreground">{breakpointInfo[currentView].label}</span>
            <Badge variant="outline" className="text-xs">
              {breakpointInfo[currentView].range}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Breakpoint Selector */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["mobile", "tablet", "desktop"] as Breakpoint[]).map((view) => (
              <Button
                key={view}
                onClick={() => onViewChange(view)}
                size="sm"
                variant={currentView === view ? "default" : "ghost"}
                className={`flex items-center gap-2 h-8 px-3 transition-all ${
                  currentView === view
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                title={`Switch to ${breakpointInfo[view].label} view (${breakpointInfo[view].range})`}
              >
                {breakpointInfo[view].icon}
                <span className="text-xs font-medium hidden sm:inline">{breakpointInfo[view].label}</span>
              </Button>
            ))}
          </div>

          {/* Info Toggle */}
          <Button size="sm" variant="outline" onClick={() => setShowInfo(!showInfo)} className="h-8 px-3">
            <span className="text-xs">Info</span>
          </Button>
        </div>
      </div>

      {/* Breakpoint Info Panel */}
      {showInfo && (
        <div className="border-b border-border bg-blue-50 p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(["mobile", "tablet", "desktop"] as Breakpoint[]).map((bp) => (
              <div
                key={bp}
                className={`p-2 rounded-md border transition-all cursor-pointer ${
                  currentView === bp ? "border-blue-500 bg-blue-100" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => onViewChange(bp)}
              >
                <div className="flex items-center gap-2 mb-1">
                  {breakpointInfo[bp].icon}
                  <span className="text-sm font-medium">{breakpointInfo[bp].label}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <div>{breakpointInfo[bp].range}</div>
                  <div>{breakpointInfo[bp].description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div className="flex-1 overflow-auto bg-muted/20 p-4">
        <div className="flex justify-center h-full">
          <div
            className={`transition-all duration-300 bg-card overflow-hidden relative ${
              currentView === "desktop" ? "h-full w-full" : "rounded-lg border-2 border-border shadow-lg"
            }`}
            style={{
              width: viewportSizes[currentView].width,
              height: currentView === "desktop" ? "100%" : viewportSizes[currentView].height,
              minHeight: currentView === "desktop" ? "auto" : viewportSizes[currentView].height,
            }}
          >
            {/* Viewport Label */}
            {currentView !== "desktop" && (
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="secondary" className="text-xs">
                  {viewportSizes[currentView].width} × {viewportSizes[currentView].height}
                </Badge>
              </div>
            )}

            {/* Content */}
            <div className="h-full w-full overflow-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
