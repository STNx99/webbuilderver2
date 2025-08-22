import { Page } from "@/interfaces/page.interface";
import { create } from "zustand";

/**
 * Type definition for the Zustand PageStore.
 */
type PageStore = {
  pages: Page[];
  /**
   * Update a page by its ID with new styles/data.
   * @param updatedPage The updated Page object.
   * @param id The ID of the page to update.
   */
  createPage: (newPage: Page) => void;

  updatePage: (updatedPage: Page, id: string) => void;

  deletePage: (id: string) => void;
  /**
   * Reset all pages to an empty array.
   */
  resetPage: () => void;
  /**
   * Load a set of pages into the store.
   * @param pages The array of Page objects to load.
   */
  loadPages: (pages: Page[]) => void;
};

export const usePageStore = create<PageStore>((set, get) => ({
  pages: [],
  updatePage: (updatedPage, id) => {
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === id ? { ...page, ...updatedPage } : page,
      ),
    }));
    // TODO: Optionally, call an API to persist the update
  },
  createPage: (newPage) => {
    set((state) => ({
      pages: [...state.pages, newPage],
    }));
  },

  deletePage: (id) => {
    set((state) => ({
      pages: state.pages.filter((page) => page.id !== id),
    }));
  },

  resetPage: () => {
    set({ pages: [] });
    // TODO: Optionally, call an API to reset pages on the backend
  },
  loadPages: (pages) => {
    set({ pages });
    // TODO: Optionally, call an API to fetch pages if needed
  },
}));
