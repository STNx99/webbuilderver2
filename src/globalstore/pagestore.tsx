import { create } from "zustand";

type PageStore = {
  pageStyles: React.CSSProperties;
  updatePage: (styles: React.CSSProperties, id: string) => void;
  resetPage: () => void;
  loadPage: (styles: React.CSSProperties) => void;
};

export const usePageStore = create<PageStore>((set, get) => ({
  pageStyles: {},
  updatePage: (styles: React.CSSProperties) => {
    set({
      pageStyles: styles,
    });
    //TODO: Implement api for updating page styles
  },
  resetPage: () => {
    set({
      pageStyles: {}
    });
    //TODO: Implement api for resetting page styles
  },
  loadPage: (styles) => set({ pageStyles: styles}),
}));
