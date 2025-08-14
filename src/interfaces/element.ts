import { EditorElement, ElementType } from "@/types/global.type";

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

interface CarouselSettings {
  autoplay?: boolean;
  dots?: boolean;
  arrows?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
}

interface CarouselElement extends Element<CarouselSettings> {
  elements: EditorElement[];
}

interface ButtonElement extends Element<void> {
  element?: FrameElement;
}

interface InputElement extends Element<Partial<HTMLInputElement>> {}

interface ListElement extends Element<void> {
  elements: EditorElement[];
}

interface SelectElement extends Element<Partial<HTMLSelectElement>> {
  options: Array<Partial<HTMLOptionElement>>;
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

interface FormElement extends Element<Partial<HTMLFormElement>> {
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
