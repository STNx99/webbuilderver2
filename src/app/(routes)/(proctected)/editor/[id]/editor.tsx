"use client";
import { elementService } from "@/services/element";
import { EditorElement } from "@/types/global.type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import ElementLoader from "@/components/editor/ElementLoader";
import ElementLoading from "@/components/editor/skeleton/ElementLoading";
import { Monitor, Smartphone, Table, Tablet } from "lucide-react";

export default function Editor() {
  const params = useParams();
  const id = params.id as string;
  // Responsive view state
  const [currentView, setCurrentView] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  // Test elements state

  const { data, isLoading } = useQuery<EditorElement[]>({
    queryKey: ["elements", id],
    queryFn: () => elementService.getElements(id),
  });

  // Define viewport dimensions for each device
  const viewportSizes = {
    mobile: { width: "375px", height: "667px" },
    tablet: { width: "768px", height: "1024px" },
    desktop: { width: "100%", height: "100%" },
  };
  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      {/* Responsive View Controls */}
      <div className="flex items-center justify-between border-b border-border bg-card shadow-sm p-2">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-card-foreground font-sans">
            Responsive Preview
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex gap-4">
            {(["mobile", "tablet", "desktop"] as const).map((view) => (
              <button
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
              </button>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* Preview Container */}
      <div className="flex-1 overflow-auto bg-muted/20">
        <div className="flex justify-center">
          <div
            className={`transition-all duration-300 bg-card ${
              currentView === "desktop"
                ? "h-full w-full"
                : "rounded-lg border-2 border-border shadow-lg"
            }`}
            style={{
              width: viewportSizes[currentView].width,
              height:
                currentView === "desktop"
                  ? "100%"
                  : viewportSizes[currentView].height,
              minHeight:
                currentView === "desktop"
                  ? "auto"
                  : viewportSizes[currentView].height,
            }}
          >
            <div className="h-full w-full overflow-auto">
              {isLoading ? (
                <ElementLoading count={6} variant="mixed" />
              ) : (
                <div className="flex flex-col space-y-4">
                  {data && data.length > 0 ? (
                    <ElementLoader
                      elements={data}
                      setContextMenuPosition={setContextMenuPosition}
                      setShowContextMenu={setShowContextMenu}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No elements found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
