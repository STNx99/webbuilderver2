import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { elementService } from "@/services/element";
import { Snapshot } from "@/interfaces/snapshot.interface";
import { toast } from "sonner";

export const useSnapshots = (projectId?: string) => {
  return useQuery({
    queryKey: ["snapshots", projectId],
    queryFn: () => elementService.getSnapshots(projectId!),
    enabled: !!projectId,
  });
};

export const useSaveSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, snapshot }: { projectId: string; snapshot: Snapshot }) =>
      elementService.saveSnapshot(projectId, snapshot),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["snapshots", projectId] });
      toast.success("Snapshot saved successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save snapshot: ${error.message}`);
    },
  });
};

export const useLoadSnapshot = () => {
  return useMutation({
    mutationFn: ({ projectId, snapshotId }: { projectId: string; snapshotId: string }) =>
      elementService.loadSnapshot(projectId, snapshotId),
    onSuccess: (elements) => {
      toast.success("Snapshot loaded successfully");
      return elements;
    },
    onError: (error: Error) => {
      toast.error(`Failed to load snapshot: ${error.message}`);
    },
  });
};