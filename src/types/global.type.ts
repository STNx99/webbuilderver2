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
} from "@/interfaces/element";

type ContainerElement =
  | FrameElement
  | SectionElement
  | FormElement
  | ListElement;

type EditorElement =
  | BaseElement
  | FrameElement
  | ButtonElement
  | ListElement
  | InputElement
  | SelectElement
  | ChartElement
  | DataTableElement
  | FormElement;

export type { EditorElement, ContainerElement };
