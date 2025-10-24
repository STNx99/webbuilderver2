"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./rich-text-editor";

interface RichTextEditorDialogProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  trigger?: React.ReactNode;
  title?: string;
}

export function RichTextEditorDialog({
  value,
  onChange,
  placeholder = "Enter some text...",
  trigger,
  title = "Edit Content",
}: RichTextEditorDialogProps) {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempValue(value || "");
    }
    setOpen(newOpen);
  };

  const handleSave = () => {
    onChange?.(tempValue);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        )}
      </DialogTrigger>
        <DialogContent className="!max-w-none !w-[90vw] !h-[90vh] !max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 min-h-[70vh]">
            <div className="flex-1 overflow-hidden">
              <RichTextEditor
                value={tempValue}
                onChange={setTempValue}
                placeholder={placeholder}
              />
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
    </Dialog>
  );
}
