"use client";

import { useRef, useState, useEffect } from "react";

interface CodeEditorProps {
  fileName: string;
  content: string;
  onChange: (content: string) => void;
}

export function CodeEditor({ fileName, content, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = content.split("\n").length;
    setLineCount(lines);
  }, [content]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--editor-bg)]">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-[var(--sidebar-bg)] flex-shrink-0">
        <div className="px-3 py-1.5 bg-[var(--editor-bg)] rounded-t text-sm text-foreground border-t-2 border-primary">
          {fileName}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 py-4 pr-4 pl-6 bg-[var(--editor-bg)] border-r border-border select-none overflow-y-hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className="text-[var(--line-number)] text-sm font-mono text-right whitespace-nowrap"
              style={{
                lineHeight: "24px",
                height: "24px",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex-1 relative overflow-auto min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            className="w-full py-4 px-4 bg-transparent text-foreground font-mono text-sm resize-none outline-none border-none block"
            style={{
              tabSize: 2,
              lineHeight: "24px",
              minHeight: "100%",
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
}
