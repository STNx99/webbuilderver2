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
import { elementHelper } from "@/lib/utils/element/elementhelper";
import React from "react";
import ElementLoader from "../ElementLoader";

const CarouselComponent = ({ element, data }: EditorComponentProps) => {
  const { getCommonProps } = useElementHandler();

  element = element as CarouselElement;
  if (!element || !element.elements) {
    return <div>No carousel content available.</div>;
  }

  const carouselSettings: CarouselSettings = element.settings ?? {};
  const hasNavigation = carouselSettings.withNavigation ?? true;

  // Defensive check: ensure styles is a valid object
  const safeStyles =
    element.styles &&
    typeof element.styles === "object" &&
    !Array.isArray(element.styles)
      ? element.styles
      : {};

  return (
    <Carousel
      {...getCommonProps(element)}
      opts={carouselSettings}
      className={cn("w-full h-full")}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
      role="region"
      aria-roledescription="carousel"
    >
      <CarouselContent>
        {element.elements.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="p-1 h-full w-full">
              <ElementLoader elements={[slide]} data={data} />
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
