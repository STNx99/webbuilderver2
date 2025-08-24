import { ElementType } from "@/types/global.type";
import { Component } from "lucide-react";
import React from "react";

type HolderProps = {
  icon: React.ReactNode;
  type: ElementType;
};

const ComponentHolder = ({ icon, type }: HolderProps) => {
  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    elementType: string,
  ) => {
    e.dataTransfer.setData("elementType", elementType);
  };
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="flex flex-row justify-between items-center w-full px-2 h-full text-xs rounded-md cursor-grab active:cursor-grabbing transition-colors"
    >
      <div>{type}</div>
      {icon}
    </div>
  );
};

type CustomComponentHolderProps = {
  name: string;
};

export function CustomComponentHolder({ name }: CustomComponentHolderProps) {
  const type = "customComponents";

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    elementType: string,
  ) => {
    e.dataTransfer.setData("elementType", elementType);
    e.dataTransfer.setData("customComponentName", name);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="flex flex-row justify-between items-center w-full px-2 h-full text-xs rounded-md cursor-grab active:cursor-grabbing transition-colors"
    >
      <div>{name}</div>
      <Component />
    </div>
  );
}

export default ComponentHolder;
