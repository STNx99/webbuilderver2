import React from "react";
import { Input } from "@/components/ui/input";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Viewport } from "@/hooks/useEditor";
import CssTextareaImporter from "./CssTextareaImporter";

type EditorHeaderProps = {
  handlePageNavigation: (e: React.FocusEvent<HTMLInputElement>) => void;
  currentView: Viewport;
  setCurrentView: (view: Viewport) => void;
};

const EditorHeader: React.FC<EditorHeaderProps> = ({
  handlePageNavigation,
  currentView,
  setCurrentView,
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
        <CssTextareaImporter/>
      </div>

      <div className="flex items-center ">
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
    </div>
  );
};

export default EditorHeader;
