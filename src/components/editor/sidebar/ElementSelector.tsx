import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import elementHolders from "@/constants/elements";
import ComponentHolder, { CustomComponentHolder } from "./ComponentHolder";
import { customComps } from "@/lib/customcomponents/customComponents";

export function ElementSelector() {
  return (
    <Command className="rounded-lg border shadow-md w-full">
      <CommandInput placeholder="Type an element or search..." />
      <CommandList>
        <CommandGroup heading="Default components">
          {elementHolders.map((element) => (
            <CommandItem
              key={element.type}
              value={element.type}
              className="h-6"
            >
              <ComponentHolder icon={element.icon} type={element.type} />
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Custom components">
          {customComps.map((customComponent, idx) => (
            <CommandItem
              key={`${customComponent.name || customComponent.content}-${idx}`}
              value={customComponent.name || customComponent.content}
            >
              <CustomComponentHolder
                name={customComponent.name || ""}
                index={idx}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
