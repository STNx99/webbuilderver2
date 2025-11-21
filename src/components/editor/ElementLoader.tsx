import { EditorElement, ElementType } from "@/types/global.type";
import React, { useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { getComponentMap } from "@/constants/elements";
import ResizeHandler from "./resizehandler/ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { usePageStore } from "@/globalstore/pagestore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementStore } from "@/globalstore/elementstore";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { LayoutGroup } from "framer-motion";
import { customComps } from "@/lib/customcomponents/customComponents";
import { useEditorPermissions } from "@/hooks/editor/useEditorPermissions";
import { CollaboratorRole } from "@/interfaces/collaboration.interface";
import { toast } from "sonner";

interface ElementLoaderProps {
  elements?: EditorElement[];
  data?: any;
  isReadOnly?: boolean;
  isLocked?: boolean;
}

export default function ElementLoader({
  elements,
  data,
  isReadOnly = false,
  isLocked = false,
}: ElementLoaderProps = {}) {
  const { id } = useParams();
  const {
    draggedOverElement,
    draggingElement,
    setDraggingElement,
    setDraggedOverElement,
  } = useSelectionStore();
  const { elements: allElements, insertElement } = useElementStore();
  elements = elements ? elements : allElements;
  // Get permissions
  const permissions = useEditorPermissions((id as string) || null);

  // Determine if operations are allowed
  const canDrag = !isReadOnly && !isLocked && permissions.canEditElements;
  const canCreate = !isReadOnly && !isLocked && permissions.canCreateElements;

  const renderElement = (element: EditorElement) => {
    const commonProps: EditorComponentProps = {
      element,
      data,
    };

    const Component = getComponentMap(commonProps);
    return Component ? <Component {...commonProps} /> : null;
  };

  const handleHover = useCallback(
    (e: React.DragEvent, element: EditorElement) => {
      e.preventDefault();
      e.stopPropagation();

      // Prevent hover effects in read-only mode
      if (!canDrag) {
        return;
      }

      if (draggedOverElement?.id !== element.id) {
        setDraggedOverElement(element);
      }
    },
    [draggedOverElement, setDraggedOverElement, canDrag],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, element: EditorElement) => {
      e.preventDefault();
      e.stopPropagation();

      // Prevent drop if read-only, locked, or no permissions
      if (!canDrag && !canCreate) {
        toast.error(
          "Cannot perform this action - editor is in read-only mode",
          {
            duration: 2000,
          },
        );
        setDraggedOverElement(undefined);
        setDraggingElement(undefined);
        return;
      }

      const elementType = e.dataTransfer.getData("elementType");
      const customElement = e.dataTransfer.getData("customComponentName");

      if (elementType) {
        // Creating new element from element type
        if (!canCreate) {
          toast.error("Cannot add elements - editor is in read-only mode", {
            duration: 2000,
          });
          setDraggedOverElement(undefined);
          setDraggingElement(undefined);
          return;
        }

        const newElement = elementHelper.createElement.create(
          elementType as ElementType,
          element.pageId,
          undefined,
        );
        if (newElement) insertElement(element, newElement);
      }

      if (customElement) {
        try {
          if (!canCreate) {
            toast.error("Cannot add elements - editor is in read-only mode", {
              duration: 2000,
            });
            setDraggedOverElement(undefined);
            setDraggingElement(undefined);
            return;
          }

          const customComp = customComps[parseInt(customElement)];
          const newElement = elementHelper.createElement.createFromTemplate(
            customComp,
            element.pageId,
          );
          if (newElement) insertElement(element, newElement);
        } catch (error) {
          // Silent error handling
        }
      }

      setDraggedOverElement(undefined);
      setDraggingElement(undefined);
    },
    [
      insertElement,
      setDraggedOverElement,
      setDraggingElement,
      canDrag,
      canCreate,
    ],
  );

  return (
    <LayoutGroup>
      {elements?.map((element) => (
        <ResizeHandler
          element={element}
          key={element.id}
          isReadOnly={isReadOnly}
          isLocked={isLocked}
        >
          {permissions.role === CollaboratorRole.VIEWER ? (
            renderElement(element)
          ) : (
            <EditorContextMenu
              element={element}
              isReadOnly={isReadOnly}
              isLocked={isLocked}
            >
              {renderElement(element)}
            </EditorContextMenu>
          )}
          <div
            onDragOver={(e) => handleHover(e, element)}
            onDrop={(e) => handleDrop(e, element)}
            className="bg-blue-400 border-2 border-dashed border-blue-600 flex items-center justify-center text-blue-800 font-semibold transition-all duration-100"
            style={{
              width: "100%",
              height: draggedOverElement?.id === element.id ? "50px" : "0px",
              opacity: draggedOverElement?.id === element.id ? 0.7 : 0,
              overflow: "hidden",
            }}
          >
            {draggingElement ? "Swap Here" : "Insert Here"}
          </div>
        </ResizeHandler>
      ))}
    </LayoutGroup>
  );
}
