"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuPortal,
} from "@/components/ui/context-menu";
import { Copy, Trash2, Layers, ArrowUp, ArrowDown } from "lucide-react";
import { KeyboardEvent as EditorKeyboardEvent } from "@/lib/utils/element/keyBoardEvents";
import { EditorElement } from "@/types/global.type";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";

interface EditorContextMenuProps {
  children: React.ReactNode;
  element: EditorElement;
}

/**
 * Shared keyboard handler instance.
 */
const keyboardEventHandler = new EditorKeyboardEvent();

/**
 * EditorContextMenu
 *
 * Renders the ContextMenu for editor elements. When the trigger lives inside an
 * iframe (i.e. it has a different `ownerDocument` than the top-level `document`)
 * we render the context menu content into that iframe's `body` so the menu is
 * displayed within the iframe. For top-level triggers we use the project's
 * `ContextMenuContent` primitive which handles its own portal.
 *
 * Important notes:
 * - We intentionally avoid modifying `components/ui/context-menu.tsx`.
 * - We detect the correct container at the moment the menu opens by reading
 *   `triggerRef.current?.ownerDocument`.
 */
export const EditorContextMenu: React.FC<EditorContextMenuProps> = ({
  children,
  element,
}) => {
  const { updateElement } = useElementStore();
  const { setSelectedElement } = useSelectionStore();

  const onCopy = () => {
    keyboardEventHandler.copyElement();
  };

  const onCut = () => {
    keyboardEventHandler.cutElement();
  };

  const onPaste = () => {
    keyboardEventHandler.pasteElement();
  };

  const onBringToFront = () => {
    keyboardEventHandler.bringToFront();
  };

  const onSendToBack = () => {
    keyboardEventHandler.sendToBack();
  };

  const onDelete = () => {
    keyboardEventHandler.deleteElement();
  };

  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null);

  return (
    <ContextMenu
      onOpenChange={(open: boolean) => {
        if (open) {
          const ownerDoc = triggerRef.current?.ownerDocument;
          const container =
            (ownerDoc && ownerDoc.body) ||
            (typeof document !== "undefined" ? document.body : null);

          setPortalContainer(container);

          setSelectedElement(element);
        } else {
          setPortalContainer(null);
        }
      }}
    >
      <ContextMenuTrigger asChild>
        <div
          ref={triggerRef}
          onContextMenu={(e) => e.stopPropagation()}
          style={{ width: "100%", height: "100%" }}
        >
          {children}
        </div>
      </ContextMenuTrigger>
      {portalContainer &&
        portalContainer !==
          (typeof document !== "undefined" ? document.body : null) && (
          <ContextMenuPortal container={portalContainer}>
            <ContextMenuPrimitive.Content
              data-slot="context-menu-content"
              className={
                "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out " +
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 " +
                "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
                "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) " +
                "min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md w-48"
              }
            >
              <ContextMenuItem asChild>
                <div
                  onClick={onCopy}
                  className="flex justify-between cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                >
                  <div className="flex">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-left mr-1">
                    ⌘C
                  </span>
                </div>
              </ContextMenuItem>

              <ContextMenuItem asChild>
                <div
                  onClick={onCut}
                  className="flex justify-between cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                >
                  <div className="flex">
                    <Layers className="mr-2 h-4 w-4" />
                    Cut
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-left mr-1">
                    ⌘X
                  </span>
                </div>
              </ContextMenuItem>

              <ContextMenuItem asChild>
                <div
                  onClick={onPaste}
                  className="flex justify-between cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                >
                  <div className="flex">
                    <Layers className="mr-2 h-4 w-4" />
                    Paste
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-left mr-1">
                    ⌘V
                  </span>
                </div>
              </ContextMenuItem>

              <ContextMenuSeparator className="bg-border -mx-1 my-1 h-px" />

              <ContextMenuItem asChild>
                <div
                  onClick={onBringToFront}
                  className="flex justify-between cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                >
                  <div className="flex">
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Bring to Front
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-left mr-1">
                    ⌘↑
                  </span>
                </div>
              </ContextMenuItem>

              <ContextMenuItem asChild>
                <div
                  onClick={onSendToBack}
                  className="flex justify-between cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                >
                  <div className="flex">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Send to Back
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-left mr-1">
                    ⌘↓
                  </span>
                </div>
              </ContextMenuItem>

              <ContextMenuSeparator className="bg-border -mx-1 my-1 h-px" />

              <ContextMenuItem asChild>
                <div
                  onClick={onDelete}
                  className="text-destructive flex justify-between cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                >
                  <div className="flex">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-left mr-1">
                    ⌘⌫
                  </span>
                </div>
              </ContextMenuItem>
            </ContextMenuPrimitive.Content>
          </ContextMenuPortal>
        )}
    </ContextMenu>
  );
};

export default EditorContextMenu;
