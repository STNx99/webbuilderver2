type ExportItem = ExportFolder | ExportFile;

interface ExportFolder {
  type: "folder";
  parentPath: string;
  name: string;
}

interface ExportFile {
  type: "file";
  parentPath: string;
  name: string;
  content: string;
  encoding?: "utf-8" | "base64";
  mimeType?: string;
  size?: number;
}

type ExportCodePayload = ExportItem[];

interface ExportOptions {
  includeTailwind: boolean;
  responsiveBreakpoints: boolean;
  minify: boolean;
  exportFormat: "html" | "react";
}

export type {
  ExportCodePayload,
  ExportItem,
  ExportFolder,
  ExportFile,
  ExportOptions,
};
