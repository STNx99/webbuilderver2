import { EditorElement } from "@/types/global.type";
import React from "react";

type Props = {
  element: EditorElement;
};

const ImageComponent: React.FC<Props> = ({ element }) => {
  const { styles = {}, src = "", name } = element;

  return (
    <div style={{ ...styles, width: "100%", height: "100%" }}>
      <img
        src={src === "" ? "/placeholder.svg" : src}
        alt={name || "Image"}
        style={{
          ...styles,
          width: "100%",
          height: "100%",
          objectFit: "-moz-initial"
        }}
        role="img"
      />
    </div>
  );
};

export default ImageComponent;
