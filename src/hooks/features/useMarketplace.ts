"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplace";
import {
  MarketplaceItemWithRelations,
  MarketplaceFilters,
  CreateMarketplaceItemRequest,
  UpdateMarketplaceItemRequest,
} from "@/interfaces/market.interface";
import { toast } from "sonner";

export const marketplaceKeys = {
  all: ["marketplace"] as const,
  items: () => [...marketplaceKeys.all, "items"] as const,
  itemsList: (filters?: MarketplaceFilters) =>
    [...marketplaceKeys.items(), { filters }] as const,
  item: (id: string) => [...marketplaceKeys.items(), id] as const,
  categories: () => [...marketplaceKeys.all, "categories"] as const,
  tags: () => [...marketplaceKeys.all, "tags"] as const,
};

export function useMarketplaceItems(filters?: MarketplaceFilters) {
  return useQuery({
    queryKey: marketplaceKeys.itemsList(filters),
    queryFn: async () => {
      try {
        const result = await marketplaceService.getMarketplaceItems(filters);
        const items = Array.isArray(result) ? result : [];
        return items;
      } catch (error) {
        console.error("Failed to fetch marketplace items:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMarketplaceItem(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: marketplaceKeys.item(id),
    queryFn: async () => {
      try {
        return await marketplaceService.getMarketplaceItemByID(id);
      } catch (error) {
        console.error("Failed to fetch marketplace item:", error);
        throw error;
      }
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function useCreateMarketplaceItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMarketplaceItemRequest) =>
      marketplaceService.createMarketplaceItem(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.items() });
      toast.success("Template created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
  });
}

export function useUpdateMarketplaceItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMarketplaceItemRequest;
    }) => marketplaceService.updateMarketplaceItem(id, data),
    onSuccess: (updatedItem, variables) => {
      queryClient.setQueryData(marketplaceKeys.item(variables.id), updatedItem);
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.items() });
      toast.success("Template updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });
}

export function useDeleteMarketplaceItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketplaceService.deleteMarketplaceItem(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: marketplaceKeys.item(id) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.items() });
      toast.success("Template deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete template: ${error.message}`);
    },
  });
}

export function useIncrementDownloads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketplaceService.incrementDownloads(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        marketplaceKeys.item(id),
        (old: MarketplaceItemWithRelations | undefined) => {
          if (!old) return old;
          return {
            ...old,
            downloads: (old.downloads || 0) + 1,
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.item(id) });
    },
    onError: (error: Error) => {
      toast.error(`Failed to record download: ${error.message}`);
    },
  });
}

export function useDownloadMarketplaceItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (marketplaceItemId: string) => {
      // First increment the download count
      await marketplaceService.incrementDownloads(marketplaceItemId);

      // Then create a new project from the template
      const newProject =
        await marketplaceService.downloadMarketplaceItem(marketplaceItemId);

      return newProject;
    },
    onSuccess: (newProject, marketplaceItemId) => {
      // Invalidate projects query to show the new project
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      // Update the marketplace item download count
      queryClient.setQueryData(
        marketplaceKeys.item(marketplaceItemId),
        (old: MarketplaceItemWithRelations | undefined) => {
          if (!old) return old;
          return {
            ...old,
            downloads: (old.downloads || 0) + 1,
          };
        },
      );

      toast.success(`Template downloaded! Created project: ${newProject.Name}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to download template: ${error.message}`);
    },
  });
}

export function useIncrementLikes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketplaceService.incrementLikes(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        marketplaceKeys.item(id),
        (old: MarketplaceItemWithRelations | undefined) => {
          if (!old) return old;
          return {
            ...old,
            likes: (old.likes || 0) + 1,
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.item(id) });
      toast.success("Thanks for liking this template!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to like template: ${error.message}`);
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: marketplaceKeys.categories(),
    queryFn: async () => {
      try {
        const result = await marketplaceService.getCategories();
        const cats = Array.isArray(result) ? result : [];
        return cats;
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => marketplaceService.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.categories() });
      toast.success("Category created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketplaceService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.categories() });
      toast.success("Category deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
}

export function useTags() {
  return useQuery({
    queryKey: marketplaceKeys.tags(),
    queryFn: async () => {
      try {
        const result = await marketplaceService.getTags();
        const cats = Array.isArray(result) ? result : [];
        return cats;
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => marketplaceService.createTag(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.tags() });
      toast.success("Tag created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create tag: ${error.message}`);
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketplaceService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.tags() });
      toast.success("Tag deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete tag: ${error.message}`);
    },
  });
}

export function useMarketplaceManager() {
  const createItem = useCreateMarketplaceItem();
  const updateItem = useUpdateMarketplaceItem();
  const deleteItem = useDeleteMarketplaceItem();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();

  return {
    createItem,
    updateItem,
    deleteItem,
    createCategory,
    deleteCategory,
    createTag,
    deleteTag,
  };
}
