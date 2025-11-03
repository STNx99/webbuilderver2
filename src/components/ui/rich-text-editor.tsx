import { useCallback, useEffect, useState } from "react";
import { Editor } from "@/components/richtexteditor/blocks/editor/editor";
import { AIChatbotBubble } from "@/components/ui/ai-chatbot-bubble";

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

  const handleAIContentGenerated = useCallback(
    (content: string) => {
      // Append AI generated content to current value
      const newValue = value ? `${value}\n${content}` : content;
      onChange?.(newValue);
    },
    [value, onChange],
  );

  return (
    <div className="h-full w-full relative">
      <Editor
        initialContent={editorState}
        onContentChange={handleChange}
        placeholder={placeholder}
      />
      <AIChatbotBubble
        onContentGenerated={handleAIContentGenerated}
        fieldName="Rich Text Content"
        currentContent={value}
      />
    </div>
  );
}
