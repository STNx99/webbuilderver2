import { EditorElement } from "@/types/global.type";
import React from "react";
import {
  BaseComponent,
  CarouselComponent,
  FormComponent,
  FrameComponent,
  ButtonComponent,
  InputComponent,
  ListComponent,
  SelectComponent,
  SectionComponent,
} from "@/types/editor";
import ResizeHandler from "./ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";

type Props = {
  elements: EditorElement[];
};

export default function ElementLoader({ elements }: Props) {
  const renderElement = (element: EditorElement) => {
    const commonProps = {
      element,
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
        <ResizeHandler element={element} key={element.id}>
          <EditorContextMenu element={element}>
            {renderElement(element)}
          </EditorContextMenu>
        </ResizeHandler>
      ))}
    </>
  );
}
