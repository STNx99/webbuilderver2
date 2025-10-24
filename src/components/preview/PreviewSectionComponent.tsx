import React from "react";
import { SectionElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import PreviewElementLoader from "./PreviewElementLoader";

interface PreviewSectionComponentProps {
  element: SectionElement;
  data?: any;
}

const PreviewSectionComponent = ({
  element,
  data,
}: PreviewSectionComponentProps) => {
  const safeStyles = elementHelper.getSafeStyles(element);

  return (
    <section className={element.tailwindStyles} style={safeStyles}>
      <PreviewElementLoader elements={element.elements} data={data} />
    </section>
  );
};

export default PreviewSectionComponent;
