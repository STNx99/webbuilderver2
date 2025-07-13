import { EditorElement, ContainerElement } from "@/types/global.type";
import React from "react";
import {
  BaseComponent,
  CarouselComponent,
  FormComponent,
  FrameComponent,
  ButtonComponent,
  ChartComponent,
  DataTableComponent,
  InputComponent,
  ListComponent,
  SelectComponent,
  SectionComponent,
} from "@/types/editor";
import { useElementHandler } from "@/hooks/useElementHandler";
import { useParams } from "next/navigation";
import { elementHelper } from "@/utils/elements/elementhelper";

type Props = {
  elements: EditorElement[];
  setContextMenuPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  setShowContextMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const ElementLoader = ({
  elements,
  setContextMenuPosition,
  setShowContextMenu,
}: Props) => {
  const renderElement = (element: EditorElement) => {
    const commonProps = {
      element,
      setContextMenuPosition,
      setShowContextMenu,
    };

    switch (element.type) {
    case "Frame":
        return <FrameComponent key={element.id} {...commonProps} />;
      case "Form":
        return <FormComponent key={element.id} {...commonProps} />;
      case "Carousel":
        return <CarouselComponent key={element.id} {...commonProps} />;
      case "Button":
        return <ButtonComponent key={element.id} {...commonProps} />;
      case "Chart":
        return <ChartComponent key={element.id} {...commonProps} />;
      case "DataTable":
        return <DataTableComponent key={element.id} {...commonProps} />;
      case "Input":
        return <InputComponent key={element.id} {...commonProps} />;
      case "List":
        return <ListComponent key={element.id} {...commonProps} />;
      case "Select":
        return <SelectComponent key={element.id} {...commonProps} />;
      case "Section":
        return <SectionComponent key={element.id} {...commonProps} />;
      default:
        return <BaseComponent key={element.id} {...commonProps} />;
    }
  };
  return (
    <>
      {elements.map((element) => (
        <div key={element.id}>{renderElement(element)}</div>
      ))}
    </>
  );
};

export default ElementLoader;
