import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface BreakpointSelectorProps {
  currentBreakpoint: "default" | "sm" | "md" | "lg" | "xl";
  onBreakpointChange: (
    breakpoint: "default" | "sm" | "md" | "lg" | "xl",
  ) => void;
}

export const BreakpointSelector = ({
  currentBreakpoint,
  onBreakpointChange,
}: BreakpointSelectorProps) => {
  return (
    <div className="mb-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Label className="text-xs cursor-help">Breakpoint</Label>
        </HoverCardTrigger>
        <HoverCardContent>
          Select the responsive breakpoint to edit styles for specific screen
          sizes.
        </HoverCardContent>
      </HoverCard>
      <Select
        value={currentBreakpoint}
        onValueChange={(value: "default" | "sm" | "md" | "lg" | "xl") =>
          onBreakpointChange(value)
        }
      >
        <SelectTrigger className="w-32 max-h-6 px-1 py-0 text-xs border">
          <SelectValue placeholder="Select breakpoint" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="sm">Small (640px+)</SelectItem>
          <SelectItem value="md">Medium (768px+)</SelectItem>
          <SelectItem value="lg">Large (1024px+)</SelectItem>
          <SelectItem value="xl">Extra Large (1280px+)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
