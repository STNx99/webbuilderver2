"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { Category } from "@/lib/types";

export function MarketplaceFilters() {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "category",
    "type",
    "features",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-4 space-y-6">
        <div>
          <h2 className="text-sm font-semibold mb-4">Filter Templates</h2>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full text-sm font-medium"
          >
            Category
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.includes("category") ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.includes("category") && (
            <div className="space-y-3 pl-1">
              {categories.map((category: Category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={category.id} />
                  <Label
                    htmlFor={category.id}
                    className="text-sm text-muted-foreground cursor-pointer flex items-center justify-between flex-1"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs">{category.count}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => toggleSection("type")}
            className="flex items-center justify-between w-full text-sm font-medium"
          >
            Template Type
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.includes("type") ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.includes("type") && (
            <div className="space-y-3 pl-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="full-site" />
                <Label
                  htmlFor="full-site"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Full Website
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="page" />
                <Label
                  htmlFor="page"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Single Page
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="section" />
                <Label
                  htmlFor="section"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Section
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="block" />
                <Label
                  htmlFor="block"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Block
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Features Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("features")}
            className="flex items-center justify-between w-full text-sm font-medium"
          >
            Features
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.includes("features") ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.includes("features") && (
            <div className="space-y-3 pl-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="dark-mode" />
                <Label
                  htmlFor="dark-mode"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Dark Mode
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="responsive" />
                <Label
                  htmlFor="responsive"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Responsive
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="animated" />
                <Label
                  htmlFor="animated"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Animated
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Author Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("author")}
            className="flex items-center justify-between w-full text-sm font-medium"
          >
            Author
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.includes("author") ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.includes("author") && (
            <div className="space-y-3 pl-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" />
                <Label
                  htmlFor="verified"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Verified Only
                </Label>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
