
import {
  CarouselElement,
  FormElement,
  InputElement,
} from "@/interfaces/elements.interface";
import { EditorElement, ElementType } from "@/types/global.type";

export type BuilderState = {
  id: string;
  type: ElementType;
  projectId: string;
  src?: string;
  parentId?: string;
  pageId?: string;
  baseProperties: {
    isSelected: boolean;
    isHovered: boolean;
    isDraggedOver: boolean;
  };
};

export interface ElementCreateStrategy {
  buildElement: (elementState: BuilderState) => EditorElement;
}

function createBaseElement(
  state: BuilderState,
  overrides: Partial<EditorElement> = {}
): EditorElement {
  return {
    id: state.id,
    type: state.type,
    projectId: state.projectId,
    src: state.src,
    parentId: state.parentId,
    pageId: state.pageId,
    ...state.baseProperties,
    content: "",
    styles: {},
    tailwindStyles: "",
    elements: [],
    settings: {},
    ...overrides,
  };
}

export class TextElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): EditorElement {
    return createBaseElement(state, {
      content: "Text",
    });
  }
}

export class FrameElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): EditorElement {
    return createBaseElement(state, {
      styles: {
        height: "200px",
        width: "50%",
        backgroundColor: "#ffffff",
        border: "2px dashed #cbd5e1",
      },
      tailwindStyles:
        "border-2 border-dashed border-slate-300 bg-white rounded-lg",
    });
  }
}

export class ButtonElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): EditorElement {
    return createBaseElement(state, {
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
    });
  }
}

export class InputElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): InputElement {
    return createBaseElement(state, {
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
    }) as InputElement;
  }
}

export class ListElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): EditorElement {
    return createBaseElement(state, {
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
    });
  }
}

export class SelectElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): EditorElement {
    return createBaseElement(state, {
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
    });
  }
}

export class FormElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): FormElement {
    return createBaseElement(state, {
      settings: {
        method: "post",
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
      tailwindStyles:
        "border border-gray-200 rounded-lg bg-white p-5 shadow-sm",
    }) as FormElement;
  }
}

export class SectionElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): EditorElement {
    return createBaseElement(state, {
      styles: {
        width: "100%",
        minHeight: "200px",
        backgroundColor: "#ffffff",
        padding: "24px",
      },
      tailwindStyles:
        "w-full min-h-[200px] h-1/4 border border-gray-200 rounded-lg bg-white p-6 shadow-sm",
    });
  }
}

export class CarouselElementCreateStrategy implements ElementCreateStrategy {
  buildElement(state: BuilderState): CarouselElement {
    return createBaseElement(state, {
      settings: {
        autoplay: true,
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
    }) as CarouselElement;
  }
}
