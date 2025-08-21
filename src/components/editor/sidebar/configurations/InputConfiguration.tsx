import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useElementStore } from "@/globalstore/elementstore";

import { InputElement, InputSettings } from "@/interfaces/elements.interface";
import React, { ChangeEvent } from "react";
import ValidationConfiguration from "./ValidationConfigration";

export default function InputConfiguration() {
  const { updateElement, selectedElement } = useElementStore<InputElement>();

  if (!selectedElement || selectedElement.type !== "Input") {
    return <AccordionItem value="input-settings"></AccordionItem>;
  }

  const [settings, setSettings] = React.useState<InputSettings>(
    {} as InputSettings,
  );

  React.useEffect(() => {
    if (selectedElement && selectedElement.settings) {
      setSettings(selectedElement.settings);
    } else {
      setSettings({} as InputSettings);
    }
  }, [selectedElement]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateElement(selectedElement.id, {
      settings: {
        ...settings,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const handleSelectChange = (name: keyof InputSettings, value: string) => {
    updateElement(selectedElement.id, {
      settings: {
        ...settings,
        [name]: value,
      },
    });
  };

  return (
    <AccordionItem value="input-settings">
      <AccordionTrigger className="text-sm">Input Settings</AccordionTrigger>
      <AccordionContent>
        <Accordion
          type="multiple"
          defaultValue={["general", "validation", "advanced"]}
        >
          {/* General */}
          <AccordionItem value="general">
            <AccordionTrigger className="text-xs">General</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 py-1">
                <div className="flex items-center gap-4">
                  <Label htmlFor="input-name" className="text-xs w-28">
                    Name
                  </Label>
                  <Input
                    id="input-name"
                    name="name"
                    type="text"
                    value={settings.name || ""}
                    onChange={handleChange}
                    className="w-48 h-7 px-2 py-1 text-xs"
                    placeholder="inputName"
                    autoComplete="off"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="input-type" className="text-xs w-28">
                    Type
                  </Label>
                  <Select
                    value={settings.type || "text"}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger className="w-48 h-7 px-2 py-1 text-xs">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="password">Password</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="tel">Tel</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="input-placeholder" className="text-xs w-28">
                    Placeholder
                  </Label>
                  <Input
                    id="input-placeholder"
                    name="placeholder"
                    type="text"
                    value={settings.placeholder || ""}
                    onChange={handleChange}
                    className="w-48 h-7 px-2 py-1 text-xs"
                    placeholder="Enter value"
                    autoComplete="off"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="input-defaultValue" className="text-xs w-28">
                    Default Value
                  </Label>
                  <Input
                    id="input-defaultValue"
                    name="defaultValue"
                    type="text"
                    value={settings.defaultValue ?? ""}
                    onChange={handleChange}
                    className="w-48 h-7 px-2 py-1 text-xs"
                    placeholder="Default value"
                    autoComplete="off"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Validation */}
          <AccordionItem value="validation">
            <AccordionTrigger className="text-xs">Validation</AccordionTrigger>
            <AccordionContent>
              <ValidationConfiguration />
            </AccordionContent>
          </AccordionItem>
          {/* Advanced */}
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-xs">Advanced</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-4 py-1">
                <Label htmlFor="input-autoComplete" className="text-xs w-28">
                  Auto Complete
                </Label>
                <Input
                  id="input-autoComplete"
                  name="autoComplete"
                  type="text"
                  value={settings.autoComplete || ""}
                  onChange={handleChange}
                  className="w-48 h-7 px-2 py-1 text-xs"
                  placeholder="on/off or browser hint"
                  autoComplete="off"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
