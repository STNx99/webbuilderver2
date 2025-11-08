"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FontComboboxProps {
  fonts: string[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const FontCombobox: React.FC<FontComboboxProps> = ({
  fonts,
  value,
  onValueChange,
  placeholder = "Select font...",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredFonts = useMemo(() => {
    if (!Array.isArray(fonts) || fonts.length === 0) {
      return [];
    }
    return fonts.filter((font) =>
      font.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [fonts, searchValue]);

  const virtualizer = useVirtualizer({
    count: filteredFonts.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  useEffect(() => {
    console.log("[FontCombobox] Debug:", {
      filteredFontsCount: filteredFonts.length,
      virtualItemsCount: virtualItems.length,
      totalSize,
      open,
      scrollContainerRefCurrent: scrollContainerRef.current,
    });
  }, [filteredFonts.length, virtualItems.length, totalSize, open]);

  useEffect(() => {
    if (open) {
      console.log("[FontCombobox] Measuring virtualizer");
      virtualizer.measure();
    }
  }, [open, virtualizer]);

  const handleSelect = (font: string) => {
    onValueChange(font);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between w-full",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search fonts..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9"
          />
          {filteredFonts.length === 0 ? (
            <CommandEmpty>No fonts found.</CommandEmpty>
          ) : (
            <CommandGroup>
              <div
                ref={scrollContainerRef}
                style={{
                  height: "300px",
                  width: "100%",
                  overflow: "auto",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: `${totalSize}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {virtualItems.map((virtualItem) => {
                    const font = filteredFonts[virtualItem.index];
                    const isSelected = value === font;

                    return (
                      <div
                        key={`${virtualItem.key}`}
                        data-index={virtualItem.index}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "32px",
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        <CommandItem
                          value={font}
                          onSelect={() => handleSelect(font)}
                          className="h-full justify-start cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-shrink-0",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="truncate text-sm">{font}</span>
                        </CommandItem>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
