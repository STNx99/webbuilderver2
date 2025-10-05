import React from "react";
import { EditorElement } from "@/types/global.type";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import Image from "next/image";
import { elementHelper } from "@/lib/utils/element/elementhelper";

type Props = EditorComponentProps;

const ImageComponent: React.FC<Props> = ({ element, data }) => {
  const { src = "", name } = element;
  const safeStyles = elementHelper.getSafeStyles(element);

  const processedSrc =
    data && typeof data === "object"
      ? elementHelper.replacePlaceholders(src, data)
      : src;

  const {
    objectFit: rawObjectFit,
    width: rawWidth,
    height: rawHeight,
    ...containerRest
  } = safeStyles;

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

  const imageSrc =
    processedSrc && processedSrc.length > 0 ? processedSrc : "/placeholder.svg";

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
