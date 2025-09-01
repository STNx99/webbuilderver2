import React from "react";
import { viewportSizes } from "@/constants/viewports";
import { Viewport } from "@/hooks/useEditor";

type PreviewContainerProps = {
  currentView: Viewport;
  children: React.ReactNode;
};

const PreviewContainer: React.FC<PreviewContainerProps> = ({
  currentView,
  children,
}) => {
  const isDesktop = currentView === "desktop";

  const containerStyle: React.CSSProperties = {
    width: isDesktop ? "100%" : viewportSizes[currentView].width,
    height: isDesktop ? "100%" : viewportSizes[currentView].height,
    minHeight: isDesktop ? "auto" : viewportSizes[currentView].height,
  };

  const containerClasses = `transition-all duration-300 bg-card ${
    isDesktop ? "h-full w-full" : "rounded-lg border-2 border-border shadow-lg"
  }`;

  return (
    <div className="flex-1 overflow-auto bg-muted/20">
      <div className="flex justify-center h-full">
        <div className={containerClasses} style={containerStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PreviewContainer;
