import { FormInput, Image, TextSelection, Type, CardSim, MousePointerClick, Link } from "lucide-react";
import React from "react";

export type ElementType = "Text" | "Button" | "Image" | "Input" | "Select" | "Link" | "Form" | "Frame" | "Section";

interface ElementHolder {
  type: ElementType;
  icon: React.ReactNode;
}

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
];

export default elementHolders;