"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileNode } from "./types";

interface TreeNodeProps {
  node: FileNode;
  selectedFile: string;
  onFileSelect: (path: string, content: string) => void;
  level: number;
}

export function TreeNode({
  node,
  selectedFile,
  onFileSelect,
  level,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.path, node.content || "");
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm hover:bg-secondary/50 transition-colors",
          isSelected && "bg-secondary text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {node.type === "folder" ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-primary" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="w-4 h-4 text-muted-foreground" />
          </>
        )}
        <span
          className={cn(
            "truncate",
            isSelected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {node.name}
        </span>
      </button>
      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
