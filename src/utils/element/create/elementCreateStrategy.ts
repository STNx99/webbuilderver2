import { ButtonElement, FormElement } from "@/interfaces/element";
import { EditorElement, ElementType } from "@/types/global.type";

export type BuilderState = {
    id: string;
    type: ElementType;
    projectId: string;
    src?: string;
    parentId?: string;
    baseProperties: {
        isSelected: boolean;
        isHovered: boolean;
        isDraggedOver: boolean;
    };
};

export interface ElementCreateStrategy {
    buildElement: (elementState: BuilderState) => EditorElement;
}

export class TextElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            ...elementState.baseProperties,
            styles: {},
            tailwindStyles: "",
            content: "Text",
        };
    }
}

export class FrameElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            content: "",
            ...elementState.baseProperties,
            elements: [],
            styles: {
                height: "200px",
                width: "50%",
                backgroundColor: "#ffffff",
                border: "2px dashed #cbd5e1",
            },
            tailwindStyles:
                "border-2 border-dashed border-slate-300 bg-white rounded-lg",
        };
    }
}

export class ButtonElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            ...elementState.baseProperties,
            content: "Click me",
            styles: {
                width: "120px",
                height: "40px",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
            },
            tailwindStyles:
                "bg-blue-500 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm font-medium hover:bg-blue-600 transition-colors",
        };
    }
}

export class InputElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            ...elementState.baseProperties,
            content: "",
            settings: {
                type: "text",
                placeholder: "Enter text...",
            },
            styles: {
                width: "200px",
                height: "40px",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
            },
            tailwindStyles:
                "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        };
    }
}

export class ListElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            content: "",
            ...elementState.baseProperties,
            elements: [],
            styles: {
                width: "250px",
                height: "200px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "12px",
            },
            tailwindStyles:
                "border border-gray-200 rounded-md bg-white p-3 shadow-sm",
        };
    }
}

export class SelectElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            ...elementState.baseProperties,
            content: "",
            options: [
                { value: "option1", text: "Option 1" },
                { value: "option2", text: "Option 2" },
            ],
            settings: {},
            styles: {
                width: "180px",
                height: "40px",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
                cursor: "pointer",
            },
            tailwindStyles:
                "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500",
        };
    }
}

export class ChartElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            ...elementState.baseProperties,
            content: "",
            chartType: "bar",
            chartData: {
                labels: ["January", "February", "March", "April", "May"],
                datasets: [
                    {
                        label: "Sample Data",
                        data: [12, 19, 3, 5, 2],
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                        ],
                        borderColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            chartOptions: {},
            styles: {
                width: "400px",
                height: "300px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
            },
            tailwindStyles:
                "border border-gray-200 rounded-lg bg-white p-4 shadow-sm",
        };
    }
}

export class DataTableElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            ...elementState.baseProperties,
            content: "",
            headers: ["Name", "Age", "City"],
            rows: [
                ["John Doe", 25, "New York"],
                ["Jane Smith", 30, "London"],
                ["Bob Johnson", 35, "Paris"],
            ],
            settings: {
                sortable: true,
                searchable: true,
                pagination: true,
                rowsPerPage: 10,
                striped: true,
                bordered: false,
                hoverEffect: true,
            },
            styles: {
                width: "500px",
                height: "350px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                overflow: "auto",
            },
            tailwindStyles:
                "border border-gray-200 rounded-lg bg-white p-4 shadow-sm overflow-auto",
        };
    }
}


export class FormElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            content: "",
            ...elementState.baseProperties,
            elements:[],
            settings: {
                method: "post", // lowercase for HTML forms
                action: "",
                autoComplete: "on",
                encType: "application/x-www-form-urlencoded",
                target: "_self",
                validateOnSubmit: false,
                redirectUrl: "",
            },
            styles: {
                width: "350px",
                height: "400px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "20px",
            },
            tailwindStyles: "border border-gray-200 rounded-lg bg-white p-5 shadow-sm",
        } as FormElement;
    }
}
export class SectionElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            content: "",
            ...elementState.baseProperties,
            elements: [],
            styles: {
                width: "100%",
                minHeight: "200px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "24px",
            },
            tailwindStyles:
                "w-full min-h-[200px] border border-gray-200 rounded-lg bg-white p-6 shadow-sm",
        };
    }
}

export class CarouselElementCreateStrategy implements ElementCreateStrategy {
    buildElement(elementState: BuilderState): EditorElement {
        return {
            id: elementState.id,
            type: elementState.type,
            projectId: elementState.projectId,
            src: elementState.src,
            parentId: elementState.parentId,
            content: "",
            ...elementState.baseProperties,
            elements: [],
            settings: {
                autoplay: true,
                dots: true,
                arrows: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
            },
            styles: {
                width: "500px",
                height: "300px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                overflow: "hidden",
            },
            tailwindStyles:
                "w-[500px] h-[300px] border border-gray-200 rounded-lg bg-white p-4 shadow-sm overflow-hidden",
        };
    }
}
