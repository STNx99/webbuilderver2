import React from "react";
import { EditorElement } from "@/types/global.type";
import Image from "next/image";

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

  const imageWidth =
    typeof rawWidth === "number"
      ? rawWidth
      : parseFloat(rawWidth as string) || 100;
  const imageHeight =
    typeof rawHeight === "number"
      ? rawHeight
      : parseFloat(rawHeight as string) || 100;

  const containerStyle: React.CSSProperties = {
    width: rawWidth ?? "100%",
    height: rawHeight ?? "100%",
    display: "block",
    overflow: "hidden",
    position: "relative",
    ...containerRest,
  };

  const imageStyle: React.CSSProperties = {
    objectFit: (rawObjectFit as React.CSSProperties["objectFit"]) ?? "cover",
    display: "block",
  };

  const imageSrc = src && src.length > 0 ? src : "/placeholder.svg";

  return (
    <div style={containerStyle} aria-label={name ?? "image-wrapper"}>
      <Image
        className="object-cover"
        width={imageWidth}
        height={imageHeight}
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
