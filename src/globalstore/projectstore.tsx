import { create } from "zustand";

type ProjectStore = {
  projectStyles: React.CSSProperties;
  updateProject: (styles: React.CSSProperties, id: string) => void;
  resetProject: () => void;
  loadProject: (styles: React.CSSProperties) => void;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projectStyles: {},
  updateProject: (styles: React.CSSProperties) => {
    set({
      projectStyles: styles,
    });
    //TODO: Implement api for updating project styles
  },
  resetProject: () => {
    set({
      projectStyles: {}
    });
    //TODO: Implement api for resetting project styles
  },
  loadProject: (styles) => set({ projectStyles: styles}),
}));
