import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useElementHandler } from "@/hooks";
import { useElementEvents } from "@/hooks/editor/eventworkflow/useElementEvents";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import {
  CarouselElement,
  CarouselSettings,
} from "@/interfaces/elements.interface";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import React, { useEffect } from "react";
import ElementLoader from "../ElementLoader";

const CarouselComponent = ({ element, data }: EditorComponentProps) => {
  const { getCommonProps } = useElementHandler();
  const { elementRef, registerEvents, createEventHandlers, eventsActive } =
    useElementEvents({
      elementId: element.id,
    });

  element = element as CarouselElement;
  if (!element || !element.elements) {
    return <div>No carousel content available.</div>;
  }

  const carouselSettings: CarouselSettings = element.settings ?? {};
  const hasNavigation = carouselSettings.withNavigation ?? true;

  const safeStyles = elementHelper.getSafeStyles(element);

  // Register events when element events change
  useEffect(() => {
    if (element.events) {
      registerEvents(element.events);
    }
  }, [element.events, registerEvents]);

  const eventHandlers = createEventHandlers();

  return (
    <Carousel
      ref={elementRef as any}
      {...getCommonProps(element)}
      {...eventHandlers}
      opts={carouselSettings}
      className={cn("w-full h-full")}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
        cursor: eventsActive ? "pointer" : "inherit",
        userSelect: eventsActive ? "none" : "auto",
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
