import { EditorComponentProps } from "@/interfaces/editor.interface";

import { EditorElement, ElementType } from "@/types/global.type";
import {
  FormInput,
  Image,
  TextSelection,
  Type,
  CardSim,
  MousePointerClick,
  Link,
  SlidersHorizontal,
  List,
} from "lucide-react";
import React from "react";
import BaseComponent from "@/components/editor/editorcomponents/BaseComponent";
import ButtonComponent from "@/components/editor/editorcomponents/ButtonComponent";
import CarouselComponent from "@/components/editor/editorcomponents/CarouselComponent";
import FormComponent from "@/components/editor/editorcomponents/FormComponent";
import FrameComponent from "@/components/editor/editorcomponents/FrameComponent";
import ImageComponent from "@/components/editor/editorcomponents/ImageComponent";
import InputComponent from "@/components/editor/editorcomponents/InputComponent";
import ListComponent from "@/components/editor/editorcomponents/ListComponent";
import SectionComponent from "@/components/editor/editorcomponents/SectionComponent";
import SelectComponent from "@/components/editor/editorcomponents/SelectComponent";

interface ElementHolder {
  type: ElementType;
  icon: React.ReactNode;
}

export const CONTAINER_ELEMENT_TYPES = [
  "Frame",
  "Form",
  "List",
  "Section",
  "Carousel",
] as const;

export const EDITABLE_ELEMENT_TYPES = [
  "Text",
  "Button",
  "Input",
  "Select",
  "Link",
] as const;

export const elementHolders: ElementHolder[] = [
  {
    type: "Text",
    icon: <Type className="w-4 h-4" />,
  },
  {
    type: "Button",
    icon: <MousePointerClick className="w-4 h-4" />,
  },
  {
    type: "Section",
    icon: <CardSim className="w-4 h-4" />,
  },
  {
    type: "Image",
    icon: <Image className="w-4 h-4" />,
  },
  {
    type: "Input",
    icon: <FormInput className="w-4 h-4" />,
  },
  {
    type: "Select",
    icon: <TextSelection className="w-4 h-4" />,
  },
  {
    type: "Link",
    icon: <Link className="w-4 h-4" />,
  },
  {
    type: "Form",
    icon: <FormInput className="w-4 h-4" />,
  },
  {
    type: "Frame",
    icon: <CardSim className="w-4 h-4" />,
  },
  {
    type: "Carousel",
    icon: <SlidersHorizontal className="w-4 h-4" />,
  },
  {
    type: "List",
    icon: <List className="w-4 h-4" />,
  },
] as const;

const ComponentMap = new Map<
  ElementType,
  React.ComponentType<EditorComponentProps>
>([
  ["Text", BaseComponent],
  ["Button", ButtonComponent],
  ["Section", SectionComponent],
  ["Image", ImageComponent],
  ["Input", InputComponent],
  ["Select", SelectComponent],
  ["Link", BaseComponent],
  ["Form", FormComponent],
  ["Frame", FrameComponent],
  ["Carousel", CarouselComponent],
  ["List", ListComponent],
]);

export const getComponentMap = (
  props: EditorComponentProps,
): React.ComponentType<EditorComponentProps> | undefined => {
  return ComponentMap.get(props.element.type);
};

export default elementHolders;
