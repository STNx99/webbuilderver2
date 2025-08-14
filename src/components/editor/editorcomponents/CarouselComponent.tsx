import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";

const CarouselComponent = ({
  element,
}: EditorComponentProps) => {
  return (
    <div style={element.styles} className={element.tailwindStyles}>
      {element.content || "Carousel Component"}
    </div>
  );
};

export default CarouselComponent;
