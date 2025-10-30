import { useCallback, useEffect, useState } from "react";
import { Editor } from "@/components/richtexteditor/blocks/editor/editor";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter some text...",
}: RichTextEditorProps) {
  const [editorState, setEditorState] = useState<any>(null);

  useEffect(() => {
    // Initialize with empty state if no value
    if (!value) {
      setEditorState(null);
      return;
    }

    // For now, just pass the value as initial content
    // The Editor component will handle initialization
    setEditorState(value);
  }, [value]);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange?.(newValue);
    },
    [onChange],
  );

  return (
    <div className="h-full w-full">
      <Editor
        initialContent={editorState}
        onContentChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
}
