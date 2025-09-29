import { EditorElement, ElementType } from "@/types/global.type";
import { ValidationRule } from "./validate.interface";
import { EmblaOptionsType } from "embla-carousel";

type CSSStyles = React.CSSProperties;

// Interface from

interface Element<Settings = undefined> {
  type: ElementType;
  id: string;
  content: string;
  name?: string;
  styles?: CSSStyles;
  tailwindStyles?: string;
  src?: string;
  href?: string;
  parentId?: string;
  pageId?: string;
  projectId: string;
  settings?: Settings | null;
  order?: number;
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
}

interface CarouselElement extends Element<CarouselSettings> {
  elements: EditorElement[];
}

interface ButtonElement extends Element<void> {
  element?: FrameElement;
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

export type {
  BaseElement,
  TextElement,
  SectionElement,
  FrameElement,
  ButtonElement,
  InputElement,
  ListElement,
  SelectElement,
  FormElement,
  CarouselElement,
  DataLoaderElement,
};
//Export settings
export type {
  CarouselSettings,
  FormSettings,
  InputSettings,
  DataLoaderSettings,
};
export type { CSSStyles };
