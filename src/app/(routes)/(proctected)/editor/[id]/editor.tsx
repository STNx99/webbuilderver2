"use client";
import { elementService } from "@/services/element";
import { EditorElement, ElementType } from "@/types/global.type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ElementLoader from "@/components/editor/ElementLoader";
import ElementLoading from "@/components/editor/skeleton/ElementLoading";
import { Monitor, Smartphone, Table, Tablet } from "lucide-react";
import { viewportSizes } from "@/constants/viewports";
import useElementStore from "@/globalstore/elementstore";
import { elementHelper } from "@/utils/element/elementhelper";
import { mockElements } from "@/mock/elmentMock";
import GenerateButton from "@/components/editor/ai/GenerateButton";

export default function Editor() {
    const params = useParams();
    const id = params.id as string;
    // Responsive view state

    const [currentView, setCurrentView] = useState<
        "mobile" | "tablet" | "desktop"
    >("desktop");

    const { addElement, loadElements, elements } = useElementStore();

    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const { data, isLoading } = useQuery<EditorElement[]>({
        queryKey: ["elements", id],
        queryFn: () => elementService.getElements(id),
    });

    useEffect(() => {
        if (data && data.length > 0) {
            loadElements(data);
        } 
        // else {
        //     loadElements(mockElements);
        // }
    }, [data, loadElements]);

    // Define viewport dimensions for each device
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        const elementType = e.dataTransfer.getData("elementType");

        const newElement = elementHelper.createElement(
            elementType as ElementType,
            id,
        );
        if (!newElement) return;
        addElement(newElement);
    };

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground relative">
            {/* Responsive View Controls */}
            <div className="flex items-center justify-between border-b border-border bg-card shadow-sm p-2">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-card-foreground font-sans">
                        Responsive Preview
                    </h1>
                    <GenerateButton/>
                </div>

                <div className="flex items-center ">
                    <div className="flex gap-4">
                        {(["mobile", "tablet", "desktop"] as const).map(
                            (view) => (
                                <button
                                    key={view}
                                    onClick={() => setCurrentView(view)}
                                    className={`flex rounded-md p-1 font-medium transition-colors font-sans items-center ${
                                        currentView === view
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                >
                                    {view === "mobile" && (
                                        <Smartphone className="w-5" />
                                    )}
                                    {view === "tablet" && (
                                        <Tablet className="w-5" />
                                    )}
                                    {view === "desktop" && (
                                        <Monitor className="w-5" />
                                    )}
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </div>
            {/* Preview Container */}
            <div className="flex-1 overflow-auto bg-muted/20">
                <div className="flex justify-center h-full">
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
                        <div
                            className={`h-full w-full overflow-auto m-2 ${isDraggingOver ? "bg-primary/10" : ""}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDraggingOver(true);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                setIsDraggingOver(false);
                            }}
                            onDrop={handleDrop}
                            id="canvas"
                        >
                            {isLoading ? (
                                <ElementLoading count={6} variant="mixed" />
                            ) : (
                                <ElementLoader elements={elements || []} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
