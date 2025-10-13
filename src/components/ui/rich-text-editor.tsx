import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect } from "react";
import { RichTextToolbar } from "./rich-text-toolbar";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function Placeholder({ placeholder }: { placeholder: string }) {
  return (
    <div className="absolute top-4 left-4 text-muted-foreground">
      {placeholder}
    </div>
  );
}

function OnChangePluginWrapper({
  onChange,
}: {
  onChange?: (value: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor);
        onChange?.(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}

function LoadContentPlugin({ html }: { html?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (html && html.trim()) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $insertNodes(nodes);
      });
    }
  }, [editor, html]);

  return null;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter some text...",
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "RichTextEditor",
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
      },
    },
    onError: (error: Error) => {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded-md">
        <RichTextToolbar />
        <div className="relative p-4 min-h-[200px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[180px] outline-none" />
            }
            placeholder={<Placeholder placeholder={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <LoadContentPlugin html={value} />
          <OnChangePluginWrapper onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}
