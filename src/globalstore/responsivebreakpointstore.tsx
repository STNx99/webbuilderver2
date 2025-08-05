import { create } from "zustand";
import type { Breakpoint } from "@/types/global.type";

interface BreakpointState {
  breakpoint: Breakpoint;
  setBreakpoint: (bp: Breakpoint) => void;
}

export const useBreakpointStore = create<BreakpointState>((set) => ({
  breakpoint: "desktop",
  setBreakpoint: (bp) => set({ breakpoint: bp }),
}));
