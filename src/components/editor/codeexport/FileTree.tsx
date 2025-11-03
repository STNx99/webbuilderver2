"use client";

import React from "react";
import { TreeNode } from "./TreeNode";
import { FileNode } from "./types";

interface FileTreeProps {
  files: FileNode[];
  selectedFile: string;
  onFileSelect: (path: string, content: string) => void;
}

export function FileTree({
  files,
  selectedFile,
  onFileSelect,
}: FileTreeProps) {
  return (
    <div className="w-64 border-r border-border overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Files
        </h2>
        <div className="space-y-1">
          {files.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              level={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
