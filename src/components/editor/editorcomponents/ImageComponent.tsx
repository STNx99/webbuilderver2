import React from "react";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import { ImageIcon } from "lucide-react";

type Props = EditorComponentProps;

const ImageComponent: React.FC<Props> = ({ element, data }) => {
  const safeStyles = elementHelper.getSafeStyles(element);

  const { objectFit: rawObjectFit } = safeStyles;

  const imageStyle: React.CSSProperties = {
    objectFit: (rawObjectFit as React.CSSProperties["objectFit"]) ?? "cover",
  };

  return element.src ? (
    <img
      src={element.src}
      alt={"Image"}
      style={imageStyle}
      loading="lazy"
      decoding="async"
      role="img"
    />
  ) : (
    <Empty className="w-full h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ImageIcon />
        </EmptyMedia>
        <EmptyTitle>No image selected</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
};

export default ImageComponent;
