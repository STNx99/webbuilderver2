"use client"
import React from "react";
import { elementHelper } from "@/utils/element/elementhelper";
import { useElementHandler } from "@/hooks/useElementHandler";
import { SectionElement } from "@/interfaces/elements.interface";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";

const SectionComponent = ({ element }: EditorComponentProps) => {
  const sectionElement = element as SectionElement;
  const { insertElement } = useElementStore();
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { getCommonProps } = useElementHandler();
  const handleCreateSeciont = () => {
    const newElement = elementHelper.createElement<SectionElement>(
      "Section",
      id as string,
      undefined,
      searchParams.get("page") || undefined,
    );
    if (newElement) insertElement(element, newElement);
  };
  return (
    <div
      {...getCommonProps(sectionElement)}
      style={{
        ...(sectionElement.styles || {}),
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {sectionElement.elements.map((childElement) => {
        return elementHelper.renderChildElement(childElement, {});
      })}
      {sectionElement.isSelected && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: -20,
            zIndex: 10,
          }}
        >
          <Button
            className="h-6"
            onClick={handleCreateSeciont}
          >
            + Add Section
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionComponent;
