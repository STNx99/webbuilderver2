import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { BaseElement } from "@/interfaces/elements.interface";
import React, { ChangeEvent } from "react";

export const ImageConfiguration = () => {
  const { updateElement } = useElementStore<BaseElement>();
  const { selectedElement } = useSelectionStore<BaseElement>();

  if (!selectedElement || selectedElement.type !== "Image") {
    return <AccordionItem value="image-settings"></AccordionItem>;
  }

  const src = selectedElement.src ?? "";
  const alt = selectedElement.name ?? "";

  const handleSrcChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateElement(selectedElement.id, {
      src: e.target.value,
    });
  };

  const handleAltChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateElement(selectedElement.id, {
      name: e.target.value,
    });
  };

  return (
    <AccordionItem value="image-settings">
      <AccordionTrigger className="text-sm">Image Settings</AccordionTrigger>
      <AccordionContent>
        <div className="flex items-center gap-4 py-1">
          <Label htmlFor="image-src" className="text-xs w-28">
            Image URL
          </Label>
          <Input
            id="image-src"
            name="src"
            type="text"
            value={src}
            onChange={handleSrcChange}
            className="w-48 h-7 px-2 py-1 text-xs"
            placeholder="https://example.com/image.jpg"
            autoComplete="off"
          />
        </div>
        <div className="flex items-center gap-4 py-1">
          <Label htmlFor="image-alt" className="text-xs w-28">
            Alt Text
          </Label>
          <Input
            id="image-alt"
            name="alt"
            type="text"
            value={alt}
            onChange={handleAltChange}
            className="w-48 h-7 px-2 py-1 text-xs"
            placeholder="Describe the image"
            autoComplete="off"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
