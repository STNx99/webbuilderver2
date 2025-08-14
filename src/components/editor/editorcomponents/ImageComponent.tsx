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
          src={"https://placehold.co/600x400"}
          alt={imageElement.name || "Image"}
          className="w-full h-full object-cover"
          style={imageElement.styles}
        />
      ) : (
        <div>{imageElement.content}</div>
      )}
    </div>
  );
};

export default ImageComponent;
