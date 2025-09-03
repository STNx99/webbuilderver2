import React from "react";
import { EditorElement } from "@/types/global.type";

type Props = {
  element: EditorElement;
};

const ImageComponent: React.FC<Props> = ({ element }) => {
  const { styles = {}, src = "", name } = element;

  const {
    objectFit: rawObjectFit,
    width: rawWidth,
    height: rawHeight,
    ...containerRest
  } = styles as React.CSSProperties;

  const containerStyle: React.CSSProperties = {
    width: rawWidth ?? "100%",
    height: rawHeight ?? "100%",
    display: "block",
    overflow: "hidden",
    ...containerRest,
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: (rawObjectFit as React.CSSProperties["objectFit"]) ?? "cover",
    display: "block",
  };

  const imageSrc = src && src.length > 0 ? src : "/placeholder.svg";

  return (
    <div style={containerStyle} aria-label={name ?? "image-wrapper"}>
      <img
        src={imageSrc}
        alt={name ?? "Image"}
        style={imageStyle}
        loading="lazy"
        decoding="async"
        role="img"
      />
    </div>
  );
};

export default ImageComponent;
