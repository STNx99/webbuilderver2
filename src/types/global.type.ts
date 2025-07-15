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

type ContainerType = "Frame" | "Form" | "List" | "Section" | "Carousel";

export type { EditorElement, ContainerElement, ElementType, ContainerType };
