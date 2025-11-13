import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventModeState {
  // Event mode state
  isEventModeEnabled: boolean;
  setEventModeEnabled: (enabled: boolean) => void;
  toggleEventMode: () => void;

  // Per-element event override
  disabledElementEvents: Set<string>;
  disableElementEvents: (elementId: string) => void;
  enableElementEvents: (elementId: string) => void;
  toggleElementEvents: (elementId: string) => void;
  isElementEventsDisabled: (elementId: string) => boolean;
  clearDisabledElements: () => void;
}

export const useEventModeStore = create<EventModeState>()(
  persist(
    (set, get) => ({
      // Global event mode (default: disabled to not interfere with element handler)
      isEventModeEnabled: false,
      setEventModeEnabled: (enabled: boolean) => {
        set({ isEventModeEnabled: enabled });
      },
      toggleEventMode: () => {
        set((state) => ({
          isEventModeEnabled: !state.isEventModeEnabled,
        }));
      },

      // Per-element event tracking
      disabledElementEvents: new Set<string>(),

      disableElementEvents: (elementId: string) => {
        set((state) => {
          const newSet = new Set(state.disabledElementEvents);
          newSet.add(elementId);
          return { disabledElementEvents: newSet };
        });
      },

      enableElementEvents: (elementId: string) => {
        set((state) => {
          const newSet = new Set(state.disabledElementEvents);
          newSet.delete(elementId);
          return { disabledElementEvents: newSet };
        });
      },

      toggleElementEvents: (elementId: string) => {
        set((state) => {
          const newSet = new Set(state.disabledElementEvents);
          if (newSet.has(elementId)) {
            newSet.delete(elementId);
          } else {
            newSet.add(elementId);
          }
          return { disabledElementEvents: newSet };
        });
      },

      isElementEventsDisabled: (elementId: string) => {
        return get().disabledElementEvents.has(elementId);
      },

      clearDisabledElements: () => {
        set({ disabledElementEvents: new Set<string>() });
      },
    }),
    {
      name: "event-mode-store",
      // Custom serialization for Set
      serialize: (state) => {
        return JSON.stringify({
          state: {
            isEventModeEnabled: state.state.isEventModeEnabled,
            disabledElementEvents: Array.from(
              state.state.disabledElementEvents
            ),
          },
          version: state.version,
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          state: {
            ...parsed.state,
            disabledElementEvents: new Set(parsed.state.disabledElementEvents),
          },
          version: parsed.version,
        };
      },
    }
  )
);
