import { BaseElement } from "@/interfaces/element";
import { EditorElement } from "@/types/global.type";
import React from "react";

type Props = {
  element: EditorElement;
};

const ImageComponent = ({ element }: Props) => {
  const imageElement = element as BaseElement;

  return (
    <div className="">
      {imageElement.src ? (
        <img
          src={imageElement.src}
          alt={imageElement.name || "Image"}
          style={imageElement.styles}
        />
      ) : (
        <div>{imageElement.content}</div>
      )}
    </div>
  );
};

export default ImageComponent;
