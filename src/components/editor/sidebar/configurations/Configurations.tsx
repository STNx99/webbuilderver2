import { Accordion } from "@/components/ui/accordion";
import useElementStore from "@/globalstore/elementstore";
import { AppearanceAccordion } from "./AppearanceAccordion";
import { ElementType } from "@/types/global.type";
import React from "react";
import { TypographyAccordion } from "./TypographyAccordion";

export default function Configurations() {
  const { selectedElement } = useElementStore();

  const renderChildElement = (type: ElementType): React.ReactNode => {
    if (!type) {
      return null;
    }

    switch (type) {
      case "Text":
        return <TypographyAccordion />;
      default:
        return null;
    }
  };

  if (!selectedElement) {
    return null;
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      <AppearanceAccordion />
      {renderChildElement(selectedElement.type)}
    </Accordion>
  );
}
