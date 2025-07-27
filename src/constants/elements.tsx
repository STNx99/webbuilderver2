import { ElementType } from "@/types/global.type";
import { FormInput, Image, TextSelection, Type, CardSim, MousePointerClick, Link } from "lucide-react";
import React from "react";

interface ElementHolder {
  type: ElementType;
  icon: React.ReactNode;
}

export const CONTAINER_ELEMENT_TYPES = [
  "Frame",
  "Form", 
  "List",
  "Section",
  "Carousel"
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
    icon: <Type className="w-4 h-4" />
  },
  {
    type: "Button",
    icon: <MousePointerClick className="w-4 h-4" />
  },
  {
    type: "Section",
    icon: <CardSim className="w-4 h-4" />
  },
  {
    type: "Image",
    icon: <Image className="w-4 h-4" />
  },
  {
    type: "Input",
    icon: <FormInput className="w-4 h-4" />
  },
  {
    type: "Select",
    icon: <TextSelection className="w-4 h-4" />
  },
  {
    type: "Link",
    icon: <Link className="w-4 h-4" />
  },
  {
    type: "Form",
    icon: <FormInput className="w-4 h-4" />
  },
  {
    type: "Frame",
    icon: <CardSim className="w-4 h-4" />
  }
] as const;

export default elementHolders;

