import { BaseElement } from "@/interfaces/elements.interface";
import { EditorElement } from "@/types/global.type";
import React from "react";

type Props = {
  element: EditorElement;
};

const ImageComponent = ({ element }: Props) => {
  const imageElement = element as BaseElement;

  return (
    <div style={{ ...imageElement.styles, width: "100%", height: "100%" }}>
      {imageElement.src ? (
        <img
          src={"https://placehold.co/600x400"}
          alt={imageElement.name || "Image"}
          style={{
            ...imageElement.styles,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div style={{ ...imageElement.styles, width: "100%", height: "100%" }}>
          {imageElement.content}
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
