import { CONTAINER_ELEMENT_TYPES, EDITABLE_ELEMENT_TYPES } from "@/constants/elements";
import {
  BaseElement,
  ButtonElement,
  ChartElement,
  DataTableElement,
  FormElement,
  FrameElement,
  InputElement,
  ListElement,
  SectionElement,
  SelectElement,
  TextElement,
  CarouselElement,
} from "@/interfaces/element";

type ContainerElement =
  | FrameElement
  | SectionElement
  | FormElement
  | ListElement
  | CarouselElement;

type EditorElement =
  | BaseElement
  | FrameElement
  | ButtonElement
  | ListElement
  | InputElement
  | SelectElement
  | ChartElement
  | DataTableElement
  | FormElement
  | SectionElement
  | TextElement
  | CarouselElement;

type ElementType =
  | "Frame"
  | "Button"
  | "List"
  | "Input"
  | "Select"
  | "Chart"
  | "DataTable"
  | "Form"
  | "Section"
  | "Text"
  | "Carousel"
  | "Base"
  | "Image"
  | "Link";

type ContainerElementType = (typeof CONTAINER_ELEMENT_TYPES)[number];

type EditableElementType =(typeof EDITABLE_ELEMENT_TYPES)[number]

export type {
  EditorElement,
  EditableElementType,
  ContainerElement,
  ElementType,
  ContainerElementType,
};

export type Breakpoint = "base" | "mobile" | "tablet" | "desktop";

export type ResponsiveValue<T> = {
  base?: T; 
  mobile?: T;
  tablet?: T;
  desktop?: T;
};

export type ResponsiveCSSProperties = {
  [K in keyof React.CSSProperties]?:
    | React.CSSProperties[K]
    | ResponsiveValue<React.CSSProperties[K]>;
};

export function resolveResponsiveStyles(
  styles: React.CSSProperties | ResponsiveCSSProperties | undefined,
  breakpoint: Breakpoint
): React.CSSProperties {
  if (!styles) return {};
  const resolved: React.CSSProperties = {};
  for (const key in styles) {
    const value = styles[key as keyof typeof styles];
    if (
      value &&
      typeof value === "object" &&
      ("base" in value || "mobile" in value || "tablet" in value || "desktop" in value)
    ) {
      resolved[key as keyof React.CSSProperties] =
        (value as ResponsiveValue<any>)[breakpoint] ??
        (value as ResponsiveValue<any>).base ??
        undefined;
    } else {
      resolved[key as keyof React.CSSProperties] = value as any;
    }
  }
  return resolved;
}
