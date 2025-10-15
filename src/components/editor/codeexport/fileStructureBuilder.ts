import { GeneratedCode } from "@/lib/utils/code-export/codeGenerator";
import { FileNode, ExportOptions } from "./types";

export function buildFileStructure(
  code: GeneratedCode,
  options: ExportOptions
): FileNode[] {
  if (options.exportFormat === "react") {
    return buildReactFileStructure(code);
  } else {
    return buildHtmlFileStructure(code);
  }
}

function buildReactFileStructure(code: GeneratedCode): FileNode[] {
  const components: FileNode[] = [
    {
      name: "index.js",
      type: "file",
      path: "components/index.js",
      content: code.reactIndex || "",
    },
    ...Object.entries(code.reactComponents || {}).map(
      ([filename, content]) => ({
        name: filename,
        type: "file" as const,
        path: `components/${filename}`,
        content,
      })
    ),
  ];

  return [
    {
      name: "App.js",
      type: "file",
      path: "App.js",
      content: code.reactApp || "",
    },
    {
      name: "components",
      type: "folder",
      path: "components",
      children: components,
    },
    {
      name: "package.json",
      type: "file",
      path: "package.json",
      content: code.packageJson || "",
    },
  ];
}

function buildHtmlFileStructure(code: GeneratedCode): FileNode[] {
  return [
    {
      name: "index.html",
      type: "file",
      path: "index.html",
      content: code.fullPage,
    },
    {
      name: "styles.css",
      type: "file",
      path: "styles.css",
      content: code.css,
    },
    {
      name: "script.js",
      type: "file",
      path: "script.js",
      content: code.js,
    },
  ];
}
