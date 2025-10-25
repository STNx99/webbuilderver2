import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/globalstore/projectstore";
import { elementService } from "@/services/element";
import { Snapshot } from "@/interfaces/snapshot.interface";
import { useElementStore } from "@/globalstore/elementstore";
import { History, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const SnapshotManager = () => {
  const [open, setOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const { project } = useProjectStore();
  const { loadElements } = useElementStore();
  const elements = useElementStore((s) => s.elements);
  const [saving, setSaving] = useState(false);

  const fetchSnapshots = useCallback(async () => {
    if (!project?.id) return;
    setLoading(true);
    try {
      const data = await elementService.getSnapshots(project.id);
      setSnapshots(data);
    } catch (error) {
      console.error("Failed to fetch snapshots:", error);
      toast.error("Failed to load snapshots");
    } finally {
      setLoading(false);
    }
  }, [project?.id]);

  useEffect(() => {
    if (open && project?.id) {
      fetchSnapshots();
    }
  }, [open, fetchSnapshots]);

  const handleSaveSnapshot = useCallback(async () => {
    if (!project?.id) return;
    if (!elements || elements.length === 0) {
      toast.error("No elements to save in snapshot");
      return;
    }

    setSaving(true);
    try {
      const snapshot: Snapshot = {
        id: `snapshot-${Date.now()}`,
        elements: elements,
        type: "version",
        name: `Version ${new Date().toLocaleString()}`,
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
      };

      await elementService.saveSnapshot(project.id, snapshot);
      toast.success("Snapshot saved successfully");
      await fetchSnapshots();
    } catch (err: unknown) {
      console.error("Failed to save snapshot:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save snapshot: ${msg}`);
    } finally {
      setSaving(false);
    }
  }, [project?.id, elements, fetchSnapshots]);

  const handleLoadSnapshot = useCallback(async (snapshotId: string) => {
    if (!project?.id) return;
    try {
      const elements = await elementService.loadSnapshot(project.id, snapshotId);
      loadElements(elements);
      toast.success("Snapshot loaded successfully");
      setOpen(false);
    } catch (error) {
      console.error("Failed to load snapshot:", error);
      toast.error("Failed to load snapshot");
    }
  }, [project?.id, loadElements]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full">
          <History className="h-4 w-4" />
          Manage Snapshots
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[75vw] max-h-[95vh] h-[75vw] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Snapshot Management
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Project Snapshots</h3>
            <Button onClick={handleSaveSnapshot} className="gap-2" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Current Version"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">Loading snapshots...</div>
            ) : snapshots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No snapshots found. Save your first version!
              </div>
            ) : (
              <div className="space-y-2">
                {snapshots.map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{snapshot.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(snapshot.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Type: {snapshot.type}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadSnapshot(snapshot.id)}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SnapshotManager;