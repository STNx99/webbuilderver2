import React from "react";
import { FrameElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import PreviewElementLoader from "./PreviewElementLoader";

interface PreviewFrameComponentProps {
  element: FrameElement;
  data?: any;
}

const PreviewFrameComponent = ({
  element,
  data,
}: PreviewFrameComponentProps) => {
  const safeStyles = elementHelper.getSafeStyles(element);

  return (
    <div className={element.tailwindStyles} style={safeStyles}>
      <PreviewElementLoader elements={element.elements} data={data} />
    </div>
  );
};

export default PreviewFrameComponent;
