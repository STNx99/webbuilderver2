import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical";
import { Button } from "./button";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

export function RichTextToolbar() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatElement = (format: "left" | "center" | "right") => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  return (
    <div className="flex gap-2 p-2 border-b">
      <Button variant="outline" size="sm" onClick={() => formatText("bold")}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => formatText("italic")}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatText("underline")}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button variant="outline" size="sm" onClick={() => formatElement("left")}>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatElement("center")}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => formatElement("right")}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
