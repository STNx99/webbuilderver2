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
import { useSelectionStore } from "@/globalstore/selectionstore";
import { FormElement, FormSettings } from "@/interfaces/elements.interface";
import React, { ChangeEvent } from "react";

export const FormConfigurationAccordion = () => {
  const { updateElement } = useElementStore<FormElement>();
  const {selectedElement} = useSelectionStore()

  if (!selectedElement || selectedElement.type !== "Form") {
    return <AccordionItem value="form-settings"></AccordionItem>;
  }

  const settings: Partial<FormSettings> = (selectedElement as FormElement).settings || {};

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    updateElement(selectedElement.id, {
      settings: {
        ...settings,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  // Helper for Selects to keep handler unified
  const handleSelectChange = (name: keyof FormSettings, value: string) => {
    updateElement(selectedElement.id, {
      settings: {
        ...settings,
        [name]: value,
      },
    });
  };

  return (
    <AccordionItem value="form-settings">
      <AccordionTrigger className="text-sm">Form Settings</AccordionTrigger>
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
                  <Label htmlFor="form-action" className="text-xs w-28">
                    Action URL
                  </Label>
                  <Input
                    id="form-action"
                    name="action"
                    type="text"
                    value={settings.action || ""}
                    onChange={handleChange}
                    className="w-48 h-7 px-2 py-1 text-xs"
                    placeholder="/api/submit"
                    autoComplete="off"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="form-method" className="text-xs w-28">
                    Method
                  </Label>
                  <Select
                    value={settings.method || "post"}
                    onValueChange={(value) => handleSelectChange("method", value)}
                  >
                    <SelectTrigger className="w-48 h-7 px-2 py-1 text-xs">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">POST</SelectItem>
                      <SelectItem value="get">GET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="form-encType" className="text-xs w-28">
                    Encoding Type
                  </Label>
                  <Select
                    value={settings.encType || "application/x-www-form-urlencoded"}
                    onValueChange={(value) => handleSelectChange("encType", value)}
                  >
                    <SelectTrigger className="w-48 h-7 px-2 py-1 text-xs">
                      <SelectValue placeholder="Select encoding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="application/x-www-form-urlencoded">
                        application/x-www-form-urlencoded
                      </SelectItem>
                      <SelectItem value="multipart/form-data">
                        multipart/form-data
                      </SelectItem>
                      <SelectItem value="text/plain">text/plain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="form-autoComplete" className="text-xs w-28">
                    Auto Complete
                  </Label>
                  <Select
                    value={settings.autoComplete || "on"}
                    onValueChange={(value) => handleSelectChange("autoComplete", value)}
                  >
                    <SelectTrigger className="w-48 h-7 px-2 py-1 text-xs">
                      <SelectValue placeholder="Select auto complete" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="form-target" className="text-xs w-28">
                    Target
                  </Label>
                  <Select
                    value={settings.target || "_self"}
                    onValueChange={(value) => handleSelectChange("target", value)}
                  >
                    <SelectTrigger className="w-48 h-7 px-2 py-1 text-xs">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_self">Self</SelectItem>
                      <SelectItem value="_blank">Blank (new tab)</SelectItem>
                      <SelectItem value="_parent">Parent</SelectItem>
                      <SelectItem value="_top">Top</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Validation */}
          <AccordionItem value="validation">
            <AccordionTrigger className="text-xs">Validation</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-4 py-1">
                <Input
                  id="validate-on-submit"
                  name="validateOnSubmit"
                  type="checkbox"
                  checked={!!settings.validateOnSubmit}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4"
                />
                <Label htmlFor="validate-on-submit" className="text-xs">
                  Validate on submit
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Advanced */}
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-xs">Advanced</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-4 py-1">
                <Label htmlFor="form-redirectUrl" className="text-xs w-28">
                  Redirect URL (after submit)
                </Label>
                <Input
                  id="form-redirectUrl"
                  name="redirectUrl"
                  type="text"
                  value={settings.redirectUrl || ""}
                  onChange={handleChange}
                  className="w-48 h-7 px-2 py-1 text-xs"
                  placeholder="/thank-you"
                  autoComplete="off"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
};