import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import {
  CarouselElement,
  CarouselSettings,
} from "@/interfaces/elements.interface";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/utils/element/elementhelper";
import React from "react";

interface Props {
  element: EditorElement;
}

const CarouselComponent = ({ element }: Props) => {
  const { getCommonProps } = useElementHandler();
  
  element = element as CarouselElement
  if (!element || !element.elements) {
    return <div>No carousel content available.</div>;
  }

  const carouselSettings: CarouselSettings = element.settings ?? {};
  const hasNavigation = carouselSettings.withNavigation ?? true;

  return (
    <Carousel
      {...getCommonProps(element)}
      opts={carouselSettings}
      className={cn("w-full")}
      role="region"
      aria-roledescription="carousel"
    >
      <CarouselContent>
        {element.elements.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="p-1">
              {elementHelper.renderChildElement(slide, {})}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {hasNavigation && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
};

export default CarouselComponent;
