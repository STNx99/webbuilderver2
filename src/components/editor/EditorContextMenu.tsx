// webbuilderv2/src/components/editor/ContextMenu.tsx
"use client";

import * as React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash2, Layers, ArrowUp, ArrowDown } from "lucide-react";
import { KeyboardEvent as EditorKeyboardEvent } from "@/utils/element/keyBoardEvents";
import { EditorElement } from "@/types/global.type";
import { useElementStore } from "@/globalstore/elementstore";

interface EditorContextMenuProps {
  children: React.ReactNode;
  element: EditorElement;
}

// Instantiate the KeyboardEvent handler
const keyboardEventHandler = new EditorKeyboardEvent();

export const EditorContextMenu: React.FC<EditorContextMenuProps> = ({
  children,
  element,
}) => {
  const { setSelectedElement, updateElement, deselectAll } = useElementStore();
  const onCopy = React.useCallback(() => {
    keyboardEventHandler.copyElement();
  }, []);

  const onCut = React.useCallback(() => {
    keyboardEventHandler.cutElement();
  }, []);

  const onPaste = React.useCallback(() => {
    keyboardEventHandler.pasteElement();
  }, []);

  const onBringToFront = React.useCallback(() => {
    keyboardEventHandler.bringToFront();
  }, []);

  const onSendToBack = React.useCallback(() => {
    keyboardEventHandler.sendToBack();
  }, []);

  const onDelete = React.useCallback(() => {
    keyboardEventHandler.deleteElement();
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onContextMenu={(e) => {
            e.stopPropagation();
            deselectAll();
            setSelectedElement(element);
            updateElement(element.id, {
              isSelected: true,
            });
          }}
          style={{ width: "100%", height: "100%" }}
        >
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent
        className="w-48 z-[100] bg-background border shadow-lg"
        onContextMenu={(e) => e.preventDefault()}
      >
        <ContextMenuItem onClick={onCopy} className="flex justify-between">
          <div className="flex">
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </div>
          <span className="text-xs text-muted-foreground w-10 text-left mr-1">
            ⌘C
          </span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCut} className="flex justify-between">
          <div className="flex">
            <Layers className="mr-2 h-4 w-4" />
            Cut
          </div>
          <span className="text-xs text-muted-foreground w-10 text-left mr-1">
            ⌘X
          </span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onPaste} className="flex justify-between">
          <div className="flex">
            <Layers className="mr-2 h-4 w-4" />
            Paste
          </div>
          <span className="text-xs text-muted-foreground w-10 text-left mr-1">
            ⌘V
          </span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={onBringToFront}
          className="flex justify-between"
        >
          <div className="flex">
            <ArrowUp className="mr-2 h-4 w-4" />
            Bring to Front
          </div>
          <span className="text-xs text-muted-foreground w-10 text-left mr-1">
            ⌘↑
          </span>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onSendToBack}
          className="flex justify-between"
        >
          <div className="flex">
            <ArrowDown className="mr-2 h-4 w-4" />
            Send to Back
          </div>
          <span className="text-xs text-muted-foreground w-10 text-left mr-1">
            ⌘↓
          </span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={onDelete}
          className="text-destructive flex justify-between"
        >
          <div className="flex">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </div>
          <span className="text-xs text-muted-foreground w-10 text-left mr-1">
            ⌘⌫
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default EditorContextMenu;
