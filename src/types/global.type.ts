import {
  CONTAINER_ELEMENT_TYPES,
  EDITABLE_ELEMENT_TYPES,
} from "@/constants/elements";
import {
  BaseElement,
  ButtonElement,
  FormElement,
  FrameElement,
  InputElement,
  ListElement,
  SectionElement,
  SelectElement,
  TextElement,
  CarouselElement,
} from "@/interfaces/elements.interface";

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
  | "Form"
  | "Section"
  | "Text"
  | "Carousel"
  | "Base"
  | "Image"
  | "Link";

type ExcludeType =
  | "isSelected"
  | "isHovered"
  | "isDraggedOver"
  | "id"
  | "pageId"
  | "projectId"
  | "parentId";

type ContainerElementTemplate = Partial<Omit<EditorElement, ExcludeType>> & {
  type: ContainerElementType;
  elements?: ElementTemplate[];
};

type LeafElementTemplate = Partial<Omit<EditorElement, ExcludeType>> & {
  type: Exclude<ElementType, ContainerElementType>;
};

type ElementTemplate = ContainerElementTemplate | LeafElementTemplate;
type ContainerElementType = (typeof CONTAINER_ELEMENT_TYPES)[number];

type EditableElementType = (typeof EDITABLE_ELEMENT_TYPES)[number];

export type {
  EditorElement,
  EditableElementType,
  ContainerElement,
  ElementType,
  ContainerElementType,
  ContainerElementTemplate,
  LeafElementTemplate,
  ElementTemplate,
};
