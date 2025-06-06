import React from "react";
import { motion } from "framer-motion";
import { EditorComponentProps } from "@/interfaces/editor";
import { FrameElement } from "@/interfaces/element";
import {
  BaseComponent,
  CarouselComponent,
  FormComponent,
  FrameComponent as Frame,
  ButtonComponent,
  ChartComponent,
  DataTableComponent,
  InputComponent,
  ListComponent,
  SelectComponent,
} from "@/types/editor";
import { EditorElement } from "@/types/global.type";

const renderChildElement = (element: EditorElement, props: any) => {
  switch (element.type) {
    case "Frame":
      return <Frame key={element.id} element={element} {...props} />;
    case "Form":
      return <FormComponent key={element.id} element={element} {...props} />;
    case "Carousel":
      return (
        <CarouselComponent key={element.id} element={element} {...props} />
      );
    case "Button":
      return <ButtonComponent key={element.id} element={element} {...props} />;
    case "Chart":
      return <ChartComponent key={element.id} element={element} {...props} />;
    case "DataTable":
      return (
        <DataTableComponent key={element.id} element={element} {...props} />
      );
    case "Input":
      return <InputComponent key={element.id} element={element} {...props} />;
    case "List":
      return <ListComponent key={element.id} element={element} {...props} />;
    case "Select":
      return <SelectComponent key={element.id} element={element} {...props} />;
    default:
      return <BaseComponent key={element.id} element={element} {...props} />;
  }
};

const FrameComponent = ({
  element,
  setContextMenuPosition,
  setShowContextMenu,
}: EditorComponentProps) => {
  const frameElement = element as FrameElement;
  const childProps = { setContextMenuPosition, setShowContextMenu };

  return (
    <motion.div
      style={frameElement.styles}
      className={frameElement.tailwindStyles}
    >
      {frameElement.elements?.map((child) =>
        renderChildElement(child, childProps)
      )}
    </motion.div>
  );
};

export default FrameComponent;
