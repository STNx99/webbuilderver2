import { ElementType } from "@/constants/elements";
import React from "react";

type HolderProps = {
  icon: React.ReactNode;
  type: ElementType;
};

const ComponentHolder = ({ icon, type }: HolderProps) => {
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
      className="flex flex-row justify-between items-center w-full px-2 hover:bg-secondary rounded-md cursor-grab active:cursor-grabbing transition-colors"
    >
      <div>{type}</div>
      {icon}
    </div>
  );
};

export default ComponentHolder;
