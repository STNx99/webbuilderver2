/**
 * Custom hooks for the application
 * Organized by functionality into folders
 */

// =============================================================================
// TABLE MANAGEMENT HOOKS
// =============================================================================
export { useTableEditing } from "./table/use-table-editing";
export { useTableState } from "./table/use-table-state";

// =============================================================================
// CMS HOOKS
// =============================================================================
export {
  useCMSContent,
  useCMSContentItem,
  getFieldValue,
  getFieldValues,
  useCMSContentTypes,
  useCMSManager,
} from "./cms";

// =============================================================================
// EDITOR HOOKS
// =============================================================================
export { useEditor } from "./editor/useEditor";
export type { Viewport } from "./editor/useEditor";
export { useElementHandler } from "./editor/useElementHandler";
export { useGridEditor } from "./editor/useGridEditor";
export { useResizeHandler } from "./editor/useResizeHandler";

// =============================================================================
// UI HOOKS
// =============================================================================
export { useInView } from "./ui/useInView";
export { useIsMobile } from "./ui/use-mobile";

// =============================================================================
// FEATURE HOOKS
// =============================================================================
export {
  useMarketplaceItems,
  useMarketplaceItem,
  useCreateMarketplaceItem,
  useUpdateMarketplaceItem,
  useDeleteMarketplaceItem,
  useIncrementDownloads,
  useDownloadMarketplaceItem,
  useIncrementLikes,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useTags,
  useCreateTag,
  useDeleteTag,
  useMarketplaceManager,
} from "./features/useMarketplace";
export {
  projectKeys,
  useUserProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  usePublishProject,
} from "./features/useProjects";
