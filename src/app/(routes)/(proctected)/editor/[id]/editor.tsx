"use client";
import { elementService } from "@/services/element";
import { EditorElement } from "@/types/global.type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import ElementLoader from "@/components/editor/ElementLoader";
import ElementLoading from "@/components/editor/skeleton/ElementLoading";

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
    <div className="flex h-full w-full flex-col">
      {/* Responsive View Controls */}
      <div className="flex items-center justify-between border-b shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Website Preview
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {(["mobile", "tablet", "desktop"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  currentView === view
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {view === "mobile" && "📱"}
                {view === "tablet" && "📱"}
                {view === "desktop" && "🖥️"}
                <span className="ml-1 capitalize">{view}</span>
              </button>
            ))}
          </div>

          {/* Dimensions display */}
          <div className="text-sm text-gray-500">
            {currentView !== "desktop"
              ? `${viewportSizes[currentView].width} × ${viewportSizes[currentView].height}`
              : "Full Width"}
          </div>
        </div>
      </div>
      {/* Preview Container */}
      <div className="flex-1 overflow-auto">
        <div className="flex justify-center">
          <div
            className={`transition-all duration-300 ${
              currentView === "desktop"
                ? "h-full w-full"
                : "rounded-lg border-2 shadow-lg"
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
                <div className="">
                  <div className="flex flex-col space-y-4">
                    {data && data.length > 0 ? (
                      <ElementLoader
                        elements={data}
                        setContextMenuPosition={setContextMenuPosition}
                        setShowContextMenu={setShowContextMenu}
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        No elements found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
