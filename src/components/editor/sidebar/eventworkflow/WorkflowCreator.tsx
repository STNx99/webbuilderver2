"use client";

import React, { useState } from "react";
import { useCreateEventWorkflow } from "@/hooks/editor/eventworkflow/useEventWorkflows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Zap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface WorkflowCreatorProps {
  projectId: string;
  onSuccess: (workflowId: string) => void;
  onCancel: () => void;
}

export const WorkflowCreator = ({
  projectId,
  onSuccess,
  onCancel,
}: WorkflowCreatorProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createMutation = useCreateEventWorkflow();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a workflow name");
      return;
    }

    createMutation.mutate(
      {
        projectId,
        input: {
          name: name.trim(),
          description: description.trim() || undefined,
          handlers: [],
        },
      },
      {
        onSuccess: (data: any) => {
          toast.success("Workflow created! Now design your workflow visually.");
          onSuccess(data.id);
        },
        onError: () => {
          toast.error("Failed to create workflow");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="gap-2 mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Workflows
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Create New Workflow</CardTitle>
              <CardDescription>
                Give your workflow a name and description
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">
                Workflow Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="workflow-name"
                placeholder="e.g., Send Welcome Email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createMutation.isPending}
                autoFocus
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Choose a descriptive name for your workflow
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflow-description">
                Description{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="workflow-description"
                placeholder="Describe what this workflow does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createMutation.isPending}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Help others understand the purpose of this workflow
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={!name.trim() || createMutation.isPending}
                className="flex-1 gap-2"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Create & Design Workflow
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
            What happens next?
          </h4>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
            <li>Your workflow will be created</li>
            <li>The visual editor will open automatically</li>
            <li>Add nodes by clicking the "Add Node" buttons</li>
            <li>Connect nodes by clicking on their connection ports</li>
            <li>Save your workflow and connect it to element events</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowCreator;
