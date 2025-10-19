import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";

import { ContentEditable } from "@/components/richtexteditor/editor-ui/content-editable";

// Toolbar plugins
import { ToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/toolbar-plugin";
import { BlockFormatDropDown } from "@/components/richtexteditor/plugins/toolbar/block-format-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/element-format-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/font-format-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/font-size-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/font-family-toolbar-plugin";
import { FontColorToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/font-color-toolbar-plugin";
import { FontBackgroundToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/font-background-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/link-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/history-toolbar-plugin";
import { ClearFormattingToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/clear-formatting-toolbar-plugin";
import { SubSuperToolbarPlugin } from "@/components/richtexteditor/plugins/toolbar/subsuper-toolbar-plugin";

// Block format components
import { FormatParagraph } from "@/components/richtexteditor/plugins/toolbar/block-format/format-paragraph";
import { FormatHeading } from "@/components/richtexteditor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "@/components/richtexteditor/plugins/toolbar/block-format/format-numbered-list";
import { FormatBulletedList } from "@/components/richtexteditor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatCheckList } from "@/components/richtexteditor/plugins/toolbar/block-format/format-check-list";
import { FormatQuote } from "@/components/richtexteditor/plugins/toolbar/block-format/format-quote";

// Block insert plugins
import { InsertImage } from "@/components/richtexteditor/plugins/toolbar/block-insert/insert-image";
import { InsertEmbeds } from "@/components/richtexteditor/plugins/toolbar/block-insert/insert-embeds";
import { BlockInsertDropDown } from "@/components/richtexteditor/plugins/toolbar/block-insert-toolbar-plugin";

// Other plugins
import { AutoLinkPlugin } from "@/components/richtexteditor/plugins/auto-link-plugin";
import { AutocompletePlugin } from "@/components/richtexteditor/plugins/autocomplete-plugin";
import { DragDropPastePlugin } from "@/components/richtexteditor/plugins/drag-drop-paste-plugin";
import { DraggableBlockPlugin } from "@/components/richtexteditor/plugins/draggable-block-plugin";
import { FloatingLinkEditorPlugin } from "@/components/richtexteditor/plugins/floating-link-editor-plugin";
import { ImagesPlugin } from "@/components/richtexteditor/plugins/images-plugin";
import { LinkPlugin } from "@/components/richtexteditor/plugins/link-plugin";
import { ListMaxIndentLevelPlugin } from "@/components/richtexteditor/plugins/list-max-indent-level-plugin";

export function Plugins({
  placeholder = "Start typing...",
  initialContent,
}: {
  placeholder?: string;
  initialContent?: string;
}) {
  const [editor] = useLexicalComposerContext();
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  // Initialize editor with content when initialContent changes
  useEffect(() => {
    if (initialContent && initialContent.trim()) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialContent, "text/html");
        const generatedNodes = $generateNodesFromDOM(editor, dom);
        $insertNodes(generatedNodes);
      });
    }
  }, [editor, initialContent]);

  return (
    <>
      {/* Core plugins */}
      <RichTextPlugin
        contentEditable={
          <div className="relative">
            <ToolbarPlugin>
              {({ blockType }) => (
                <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-muted/30 sticky top-0 z-10">
                  <BlockFormatDropDown>
                    <FormatParagraph />
                    <FormatHeading levels={["h1", "h2", "h3"]} />
                    <FormatNumberedList />
                    <FormatBulletedList />
                    <FormatCheckList />
                    <FormatQuote />
                  </BlockFormatDropDown>
                  <ElementFormatToolbarPlugin />
                  <FontFormatToolbarPlugin />
                  <FontSizeToolbarPlugin />
                  <FontFamilyToolbarPlugin />
                  <FontColorToolbarPlugin />
                  <FontBackgroundToolbarPlugin />
                  <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
                  <HistoryToolbarPlugin />
                  <ClearFormattingToolbarPlugin />
                  <SubSuperToolbarPlugin />
                  <BlockInsertDropDown>
                    <InsertImage />
                    <InsertEmbeds />
                  </BlockInsertDropDown>
                </div>
              )}
            </ToolbarPlugin>
            <div className="flex-1 overflow-auto p-3 relative" ref={onRef}>
              <ContentEditable placeholder={placeholder} />
            </div>
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <TablePlugin />
      <TabIndentationPlugin />
      <AutoFocusPlugin />

      {/* Toolbar */}

      {/* Other plugins */}
      <AutoLinkPlugin />
      <AutocompletePlugin />
      <DragDropPastePlugin />
      <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
      <FloatingLinkEditorPlugin
        anchorElem={floatingAnchorElem}
        isLinkEditMode={isLinkEditMode}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <ImagesPlugin />
      <LinkPlugin />
      <ListMaxIndentLevelPlugin maxDepth={7} />
    </>
  );
}
