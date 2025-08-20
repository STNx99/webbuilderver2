import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useElementStore } from "@/globalstore/elementstore";
import { CarouselElement, CarouselSettings } from "@/interfaces/elements.interface";
import { Label } from "@radix-ui/react-label";

export default function CarouselConfigurationAccordion  () {
  const { selectedElement, updateElement } = useElementStore<CarouselElement>();

  if (!selectedElement || selectedElement.type !== "Carousel") {
    return null;
  }
  const settings: CarouselSettings = selectedElement.settings || {};

  // Handler for text inputs and switches
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateElement(selectedElement.id, {
      settings: {
        ...settings,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  // Handler for Select components
  const handleSelectChange = (name: keyof CarouselSettings, value: string) => {
    updateElement(selectedElement.id, {
      settings: {
        ...settings,
        [name]: value,
      },
    });
  };

  // Handler for Switch components (since they don't have a change event with `target.name`)
  const handleSwitchChange = (name: keyof CarouselSettings, value: boolean) => {
    updateElement(selectedElement.id, {
      settings: {
        ...settings,
        [name]: value,
      },
    });
  };

  return (
    <AccordionItem value="carousel-settings">
      <AccordionTrigger className="text-sm">Carousel Settings</AccordionTrigger>
      <AccordionContent>
        <Accordion type="multiple" defaultValue={["general"]}>
          {/* General Settings */}
          <AccordionItem value="general">
            <AccordionTrigger className="text-xs">General</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 py-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="carousel-loop" className="text-xs">Loop</Label>
                  <Switch
                    id="carousel-loop"
                    name="loop"
                    checked={!!settings.loop}
                    onCheckedChange={(value) => handleSwitchChange("loop", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="carousel-navigation" className="text-xs">With Navigation</Label>
                  <Switch
                    id="carousel-navigation"
                    name="withNavigation"
                    checked={settings.withNavigation !== undefined ? settings.withNavigation : true}
                    onCheckedChange={(value) => handleSwitchChange("withNavigation", value)}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Label htmlFor="carousel-align" className="text-xs w-28">Align</Label>
                  <Select
                    value={settings.align as string || "start"}
                    onValueChange={(value) => handleSelectChange("align", value)}
                  >
                    <SelectTrigger className="w-48 h-7 px-2 py-1 text-xs">
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="end">End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Autoplay Settings */}
          <AccordionItem value="autoplay">
            <AccordionTrigger className="text-xs">Autoplay</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 py-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="carousel-autoplay" className="text-xs">Enable Autoplay</Label>
                  <Switch
                    id="carousel-autoplay"
                    name="autoplay"
                    checked={settings.autoplay }
                    onCheckedChange={(value) => handleSwitchChange("autoplay", value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="carousel-autoplay-speed" className="text-xs w-28">Speed (ms)</Label>
                  <Input
                    id="carousel-autoplay-speed"
                    name="autoplaySpeed"
                    type="number"
                    value={settings.autoplaySpeed || 0}
                    onChange={handleInputChange}
                    className="w-48 h-7 px-2 py-1 text-xs"
                    placeholder="3000"
                    autoComplete="off"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
};