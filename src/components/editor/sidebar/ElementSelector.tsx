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
          {[...elementHolders]
            .sort((a, b) => a.type.localeCompare(b.type))
            .map((element) => (
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
          {customComps
            .map((_, i) => i)
            .sort((a, b) =>
              (
                customComps[a].name ||
                customComps[a].content ||
                ""
              ).localeCompare(
                customComps[b].name || customComps[b].content || "",
              ),
            )
            .map((originalIdx) => {
              const customComponent = customComps[originalIdx];
              return (
                <CommandItem
                  key={`${customComponent.name || customComponent.content}-${originalIdx}`}
                  value={customComponent.name || customComponent.content}
                >
                  <CustomComponentHolder
                    name={customComponent.name || ""}
                    index={originalIdx}
                  />
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
