"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Download } from "lucide-react";

interface FileActionsProps {
  selectedFile: string;
  selectedContent: string;
  onCopy: (text: string) => void;
  onDownload: (content: string, filename: string) => void;
}

export function FileActions({
  selectedFile,
  selectedContent,
  onCopy,
  onDownload,
}: FileActionsProps) {
  if (!selectedFile) {
    return null;
  }

  const filename = selectedFile.split("/").pop() || selectedFile;

  return (
    <div className="flex justify-between items-center">
      <Label>{selectedFile}</Label>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(selectedContent)}
        >
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(selectedContent, filename)}
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
}
