import { Accordion } from "@/components/ui/accordion";
import { AppearanceAccordion } from "./AppearanceAccordion";
import { ElementType } from "@/types/global.type";
import React, { useState } from "react";
import { TypographyAccordion } from "./TypographyAccordion";
import { LinkConfigurationAccordion } from "./LinkConfiguration";
import { FormConfigurationAccordion } from "./FormConfiguration";
import InputConfiguration from "./InputConfiguration";
import { useSelectionStore } from "@/globalstore/selectionstore";
import CarouselConfigurationAccordion from "./CarouselConfiguration";
import TailwindAccordion from "./TailwindAccordion";
import DataLoaderConfiguration from "./DataLoaderConfiguration";
import { BreakpointSelector } from "./BreakpointSelector";
import CMSConfiguration from "./CMSConfiguration";
import { ImageConfiguration } from "./ImageConfiguration";

export default function Configurations() {
  const { selectedElement } = useSelectionStore();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    "default" | "sm" | "md" | "lg" | "xl"
  >("default");

  const renderChildElement = (type: ElementType): React.ReactNode => {
    if (!type) {
      return null;
    }

    switch (type) {
      case "Text":
        return <TypographyAccordion currentBreakpoint={currentBreakpoint} />;
      case "Link":
        return <LinkConfigurationAccordion />;
      case "Form":
        return <FormConfigurationAccordion />;
      case "Input":
        return <InputConfiguration />;
      case "Image":
        return <ImageConfiguration />;
      case "Carousel":
        return <CarouselConfigurationAccordion />;
      case "DataLoader":
        return <DataLoaderConfiguration />;
      case "CMSContentList":
      case "CMSContentItem":
      case "CMSContentGrid":
        return selectedElement ? (
          <CMSConfiguration elementId={selectedElement.id} />
        ) : null;
      default:
        return null;
    }
  };

  if (!selectedElement) {
    return null;
  }
  return (
    <div className="w-full">
      <BreakpointSelector
        currentBreakpoint={currentBreakpoint}
        onBreakpointChange={setCurrentBreakpoint}
      />
      <Accordion type="multiple" className="w-full">
        <AppearanceAccordion currentBreakpoint={currentBreakpoint} />
        {renderChildElement(selectedElement.type)}
        <TailwindAccordion />
      </Accordion>
    </div>
  );
}
