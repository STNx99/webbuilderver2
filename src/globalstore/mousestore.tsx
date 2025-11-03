import { create } from "zustand";
import { User } from "@/interfaces/realtime.interface";

type MousePosition = {
  x: number;
  y: number;
};

type Collaborator = User;

type MouseStore = {
  mousePositions: Record<string, MousePosition>;
  selectedElements: Record<string, string>;
  users: Record<string, Collaborator>;
  updateMousePosition: (userId: string, position: MousePosition) => void;
  removeMousePosition: (userId: string) => void;
  setSelectedElement: (userId: string, elementId: string) => void;
  removeSelectedElement: (userId: string) => void;
  setMousePositions: (positions: Record<string, MousePosition>) => void;
  setSelectedElements: (elements: Record<string, string>) => void;
  setUsers: (users: Record<string, Collaborator>) => void;
  removeUser: (userId: string) => void;
  clear: () => void;
};

export const useMouseStore = create<MouseStore>((set, get) => ({
  mousePositions: {},
  selectedElements: {},
  users: {},

  updateMousePosition: (userId: string, position: MousePosition) => {
    set((state) => ({
      mousePositions: {
        ...state.mousePositions,
        [userId]: position,
      },
    }));
  },

  removeMousePosition: (userId: string) => {
    set((state) => {
      const { [userId]: _, ...rest } = state.mousePositions;
      return {
        mousePositions: rest,
      };
    });
  },

  setSelectedElement: (userId: string, elementId: string) => {
    set((state) => ({
      selectedElements: {
        ...state.selectedElements,
        [userId]: elementId,
      },
    }));
  },

  removeSelectedElement: (userId: string) => {
    set((state) => {
      const { [userId]: _, ...rest } = state.selectedElements;
      return {
        selectedElements: rest,
      };
    });
  },

  setMousePositions: (positions: Record<string, MousePosition>) => {
    set({ mousePositions: positions });
  },

  setSelectedElements: (elements: Record<string, string>) => {
    set({ selectedElements: elements });
  },

  setUsers: (users: Record<string, Collaborator>) => {
    set({ users });
  },

  removeUser: (userId: string) => {
    set((state) => {
      const { [userId]: _, ...rest } = state.users;
      return {
        users: rest,
      };
    });
  },

  clear: () => {
    set({ mousePositions: {}, selectedElements: {}, users: {} });
  },
}));

export const MouseStore = useMouseStore;
