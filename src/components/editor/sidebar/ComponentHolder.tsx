import React from "react";

type ComponentType =
  | "Button"
  | "Form"
  | "Carousel"
  | "Chart"
  | "DataTable"
  | "Image"
  | "Input"
  | "List"
  | "Select";

type HolderProps = {
  icons: React.ReactNode;
  type: ComponentType;
};

const ComponentHolder = ({ icons, type }: HolderProps) => {
  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    elementType: string
  ) => {
    e.dataTransfer.setData("elementType", elementType);
  };
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="flex flex-row justify-between items-center w-full"
    >
      <div>Button</div>
      {icons}
    </div>
  );
};

export default ComponentHolder;
