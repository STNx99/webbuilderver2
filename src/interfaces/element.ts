import { EditorElement } from "@/types/global.type";

// Interface from 
interface DBElement {
  type: string;
  id: string;
  content: string;
  name?: string;
  styles?: React.CSSProperties;
  tailwindStyles?: string;
  x: number;
  y: number;
  src?: string;
  href?: string;
  parentId?: string;
  projectId?: string;
}

interface Element extends DBElement {
  isSelected: boolean
  isHovered: boolean
  isDraggedOver: boolean
}

interface BaseElement extends Element {}

interface FrameElement extends Element {
  elements: EditorElement[];
}

interface SectionElement extends Element {
  elements: EditorElement[];
}
interface SectionElement extends Element {
  elements: EditorElement[];
}
// interface CarouselElement extends Element {
//   carouselSettings: SlickSettings;
//   elements: CarouselElementChild[];
// }
interface ButtonElement extends Element {
  buttonType: string;
  element?: FrameElement;
}
interface InputElement extends Element {
  inputSettings: Partial<HTMLInputElement>;
}
interface ListElement extends Element {
  elements: EditorElement[];
}
interface SelectElement extends Element {
  options: Array<Partial<HTMLOptionElement>>;
  selectSettings?: Partial<HTMLSelectElement>;
}

interface ChartElement extends Element {
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

interface DataTableElement extends Element {
  type: "DataTable";
  headers: string[];
  rows: Array<Array<string | number>>;
  tableSettings?: {
    sortable?: boolean;
    searchable?: boolean;
    pagination?: boolean;
    rowsPerPage?: number;
    striped?: boolean;
    bordered?: boolean;
    hoverEffect?: boolean;
  };
}

interface FormElement extends Element {
  elements: EditorElement[];
  formSettings?: Partial<HTMLFormElement>;
}

export type {
  BaseElement,
  SectionElement,
  FrameElement,
  ButtonElement,
  InputElement,
  ListElement,
  SelectElement,
  ChartElement,
  DataTableElement,
  FormElement,
};
