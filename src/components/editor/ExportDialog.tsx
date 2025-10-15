"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Code } from "lucide-react";
import { useElementStore } from "@/globalstore/elementstore";
import { usePageStore } from "@/globalstore/pagestore";
import {
  generateCodeFromElements,
  GeneratedCode,
} from "@/lib/utils/code-export/codeGenerator";
import { EditorElement } from "@/types/global.type";
import { CodeEditor } from "./codeexport/CodeEditor";
import { FileTree } from "./codeexport/FileTree";
import { ExportOptions as ExportOptionsComponent } from "./codeexport/ExportOptions";
import { FileActions } from "./codeexport/FileActions";
import { buildFileStructure } from "./codeexport/fileStructureBuilder";
import {
  copyToClipboard,
  downloadFile,
  downloadZip,
} from "./codeexport/fileUtils";
import { ExportOptions } from "./codeexport/types";

interface ExportDialogProps {
  children?: React.ReactNode;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ children }) => {
  const { elements } = useElementStore();
  const { currentPage } = usePageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    includeTailwind: false,
    responsiveBreakpoints: true,
    minify: false,
    exportFormat: "html",
  });
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode>({
    html: "",
    css: "",
    js: "",
    fullPage: "",
    reactApp: "",
    reactComponents: {},
    reactIndex: "",
    packageJson: "",
  });
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedContent, setSelectedContent] = useState("");

  useEffect(() => {
    if (isOpen && elements.length > 0) {
      console.log("Generating code for", elements.length, "elements");
      console.log("Export options:", options);
      console.log("Current page:", currentPage);
      setIsGenerating(true);
      generateCodeFromElements(elements as EditorElement[], {
        ...options,
        page: currentPage || undefined,
      })
        .then((code) => {
          console.log("Generated code:", {
            htmlLength: code.html.length,
            cssLength: code.css.length,
            jsLength: code.js.length,
            fullPageLength: code.fullPage.length,
          });
          setGeneratedCode(code);
          const structure = buildFileStructure(code, options);
          console.log("Built file structure:", structure);
          if (structure.length > 0) {
            setSelectedFile(structure[0].path);
            setSelectedContent(structure[0].content || "");
            console.log(
              "Selected file:",
              structure[0].path,
              "with content length:",
              structure[0].content?.length || 0,
            );
          }
          setIsGenerating(false);
        })
        .catch((err) => {
          console.error("Error generating code:", err);
          setIsGenerating(false);
        });
    } else if (isOpen) {
      console.warn("Export dialog opened but no elements found");
    }
  }, [elements, options, isOpen, currentPage]);

  const handleOptionChange = (option: keyof ExportOptions, value?: any) => {
    setOptions((prev) => ({
      ...prev,
      [option]: value !== undefined ? value : !prev[option],
    }));
  };

  const handleCopy = async (text: string) => {
    try {
      await copyToClipboard(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDownloadAll = () => {
    if (generatedCode.zipBlob && !isGenerating) {
      downloadZip(generatedCode.zipBlob, options.exportFormat);
    }
  };

  const handleFileSelect = (path: string, content: string) => {
    setSelectedFile(path);
    setSelectedContent(content);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Code className="w-4 h-4 mr-2" />
            Export Code
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-[75vw] max-h-[95vh] h-[75vw] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Editor Components as Code</DialogTitle>
          <DialogDescription>
            Generate HTML, CSS, and JavaScript code from your editor components.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {isGenerating ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Generating code...</span>
            </div>
          ) : (
            <>
              <FileTree
                files={buildFileStructure(generatedCode, options)}
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
              />
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b space-y-4">
                  <ExportOptionsComponent
                    options={options}
                    onOptionChange={handleOptionChange}
                    isGenerating={isGenerating}
                  />
                  <FileActions
                    selectedFile={selectedFile}
                    selectedContent={selectedContent}
                    onCopy={handleCopy}
                    onDownload={downloadFile}
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    fileName={selectedFile}
                    content={selectedContent}
                    onChange={(content: string) => setSelectedContent(content)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            disabled={isGenerating || !generatedCode.zipBlob}
          >
            <Download className="w-4 h-4 mr-2" />
            Download All Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
