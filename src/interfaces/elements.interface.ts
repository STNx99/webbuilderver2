import { EditorElement, ElementType } from "@/types/global.type";
import { ValidationRule } from "./validate.interface";
import { EmblaOptionsType } from "embla-carousel";

// Interface from
interface DBElement<Settings = undefined> {
  type: ElementType;
  id: string;
  content: string;
  name?: string;
  styles?: React.CSSProperties;
  tailwindStyles?: string;
  src?: string;
  href?: string;
  parentId?: string;
  projectId: string;
  settings?: Settings | null;
}

interface Element<Settings = undefined> extends DBElement<Settings> {
  isSelected: boolean;
  isHovered: boolean;
  isDraggedOver: boolean;
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
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
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
  elements: EditorElement[]
}

interface ChartElement extends Element<Record<string, unknown>> {
  type: "Chart";
  chartType: "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea";
  chartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
    }>;
  };
  chartOptions?: Record<string, <T>(data: T) => T>;
}

interface DataTableSettings {
  sortable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  rowsPerPage?: number;
  striped?: boolean;
  bordered?: boolean;
  hoverEffect?: boolean;
}

interface DataTableElement extends Element<DataTableSettings> {
  headers: string[] | undefined;
  rows: Array<Array<string | number>> | undefined;
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

export type {
  BaseElement,
  TextElement,
  SectionElement,
  FrameElement,
  ButtonElement,
  InputElement,
  ListElement,
  SelectElement,
  ChartElement,
  DataTableElement,
  FormElement,
  CarouselElement,
};
//Export settings
export type { CarouselSettings, FormSettings, InputSettings };
