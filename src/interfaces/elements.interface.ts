import { EditorElement, ElementType } from "@/types/global.type";
import { ValidationRule } from "./validate.interface";
import { EmblaOptionsType } from "embla-carousel";
import { ElementEvents } from "./events.interface";

type CSSStyles = React.CSSProperties;

type ResponsiveStyles = {
  default?: React.CSSProperties;
  sm?: React.CSSProperties;
  md?: React.CSSProperties;
  lg?: React.CSSProperties;
  xl?: React.CSSProperties;
};

// Interface from

interface Element<Settings = undefined> {
  type: ElementType;
  id: string;
  content: string;
  name?: string;
  styles?: ResponsiveStyles;
  tailwindStyles?: string;
  src?: string;
  href?: string;
  parentId?: string;
  pageId: string;
  settings?: Settings | null;
  order?: number;
  events?: ElementEvents; // Direct event handlers for actions
  eventWorkflowConnections?: string[]; // Connection IDs linking to backend ElementEventWorkflow records
}

interface BaseElement extends Element {}

interface TextElement extends Element<void> {
  type: "Text";
}

interface FrameElement extends Element<void> {
  elements: EditorElement[];
}

interface SectionElement extends Element<void> {
  elements: EditorElement[];
}

interface CarouselSettings extends EmblaOptionsType {
  withNavigation?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  breakpoints?: Record<string, Partial<EmblaOptionsType>>;
}

interface CarouselElement extends Element<CarouselSettings> {
  elements: EditorElement[];
}

interface ButtonElement extends Element<void> {
  element?: FrameElement;
}

interface ImageSettings {
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  sizes?: string;
  srcset?: string;
}

interface ImageElement extends Element<ImageSettings> {
  type: "Image";
}

interface InputSettings {
  name?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea";
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  pattern?: string;
  validationMessage?: string;
  autoComplete?: string;
  validateRules?: ValidationRule[];
}
interface InputElement extends Element<InputSettings> {}

interface ListElement extends Element<void> {
  elements: EditorElement[];
}

interface SelectElement extends Element<Partial<HTMLSelectElement>> {
  elements: EditorElement[];
}

interface FormSettings {
  action?: string;
  method?: "get" | "post";
  autoComplete?: "on" | "off";
  target?: "_self" | "_blank" | "_parent" | "_top";
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
  validateOnSubmit?: boolean;
  redirectUrl?: string;
  noValidate?: boolean;
  acceptCharset?: string;
}

interface FormElement extends Element<FormSettings> {
  elements: EditorElement[];
}

interface DataLoaderSettings {
  apiUrl: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
  authToken?: string;
}

interface DataLoaderElement extends Element<DataLoaderSettings> {
  elements: EditorElement[];
}

interface CMSContentSettings {
  contentTypeId?: string;
  displayMode?: "list" | "grid" | "single";
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  fieldsToShow?: string[];
  itemSlug?: string; // For single item display
  filterBy?: Record<string, any>;
}

interface CMSContentListElement extends Element<CMSContentSettings> {
  elements: EditorElement[]; // Template for each item
}

interface CMSContentItemElement extends Element<CMSContentSettings> {
  elements: EditorElement[]; // Template for the item
}

interface CMSContentGridElement extends Element<CMSContentSettings> {
  elements: EditorElement[]; // Template for each grid item
}

export type {
  BaseElement,
  TextElement,
  SectionElement,
  FrameElement,
  ButtonElement,
  ImageElement,
  InputElement,
  ListElement,
  SelectElement,
  FormElement,
  CarouselElement,
  DataLoaderElement,
  CMSContentListElement,
  CMSContentItemElement,
  CMSContentGridElement,
};
//Export settings
export type {
  CarouselSettings,
  ImageSettings,
  FormSettings,
  InputSettings,
  DataLoaderSettings,
  CMSContentSettings,
};
export type { CSSStyles, ResponsiveStyles };
