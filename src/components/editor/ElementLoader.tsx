import { EditorElement, ElementType } from "@/types/global.type";
import React, { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { getComponentMap } from "@/constants/elements";
import ResizeHandler from "./resizehandler/ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementStore } from "@/globalstore/elementstore";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { LayoutGroup, motion, AnimatePresence, Reorder } from "framer-motion";
import { customComps } from "@/lib/customcomponents/customComponents";
import { useEditorPermissions } from "@/hooks/editor/useEditorPermissions";
import { CollaboratorRole } from "@/interfaces/collaboration.interface";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowRightLeft } from "lucide-react";

interface ElementLoaderProps {
  elements?: EditorElement[];
  data?: any;
  isReadOnly?: boolean;
  isLocked?: boolean;
  enableReorder?: boolean;
}

const swapAnimationVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};

// Drop zone animation variants
const dropZoneVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    height: 60,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 30,
    },
  },
};

// Dragging element ghost variants
const dragGhostVariants = {
  idle: {
    scale: 1,
    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
    zIndex: 1,
  },
  dragging: {
    scale: 1.02,
    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)",
    zIndex: 50,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

export default function ElementLoader({
  elements,
  data,
  isReadOnly = false,
  isLocked = false,
  enableReorder = false,
}: ElementLoaderProps = {}) {
  const { id } = useParams();
  const {
    draggedOverElement,
    draggingElement,
    setDraggingElement,
    setDraggedOverElement,
  } = useSelectionStore();
  const {
    elements: allElements,
    insertElement,
    swapElement,
  } = useElementStore();
  elements = elements ? elements : allElements;
  const [isDraggingLocal, setIsDraggingLocal] = useState<string | null>(null);

  const permissions = useEditorPermissions((id as string) || null);

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

  const handleDragStart = useCallback(
    (e: React.DragEvent, element: EditorElement) => {
      if (!canDrag) {
        e.preventDefault();
        return;
      }

      setIsDraggingLocal(element.id);
      setDraggingElement(element);

      // Set drag data for transfer
      e.dataTransfer.setData("elementId", element.id);
      e.dataTransfer.effectAllowed = "move";
    },
    [canDrag, setDraggingElement],
  );

  const handleDragEnd = useCallback(() => {
    setIsDraggingLocal(null);
    setDraggingElement(undefined);
    setDraggedOverElement(undefined);
  }, [setDraggingElement, setDraggedOverElement]);

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
        setIsDraggingLocal(null);
        return;
      }

      const elementType = e.dataTransfer.getData("elementType");
      const customElement = e.dataTransfer.getData("customComponentName");
      const draggedElementId = e.dataTransfer.getData("elementId");

      // Handle element swap (internal drag)
      if (draggedElementId && draggingElement) {
        if (draggedElementId !== element.id) {
          swapElement(draggedElementId, element.id);
          toast.success("Elements swapped successfully", {
            duration: 1500,
          });
        }
        setDraggedOverElement(undefined);
        setDraggingElement(undefined);
        setIsDraggingLocal(null);
        return;
      }

      if (elementType) {
        // Creating new element from element type
        if (!canCreate) {
          toast.error("Cannot add elements - editor is in read-only mode", {
            duration: 2000,
          });
          setDraggedOverElement(undefined);
          setDraggingElement(undefined);
          setIsDraggingLocal(null);
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
            setIsDraggingLocal(null);
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
      setIsDraggingLocal(null);
    },
    [
      insertElement,
      setDraggedOverElement,
      setDraggingElement,
      canDrag,
      canCreate,
      draggingElement,
      swapElement,
    ],
  );

  // Handle reorder for Reorder.Group
  const handleReorder = useCallback(
    (newOrder: EditorElement[]) => {
      if (!canDrag) return;

      const currentIds = elements?.map((e) => e.id) || [];
      const newIds = newOrder.map((e) => e.id);

      for (let i = 0; i < currentIds.length; i++) {
        if (currentIds[i] !== newIds[i]) {
          const originalIndex = newIds.indexOf(currentIds[i]);
          if (originalIndex !== -1 && originalIndex !== i) {
            swapElement(currentIds[i], newIds[i]);
            break;
          }
        }
      }
    },
    [canDrag, elements, swapElement],
  );

  // Render with Reorder support if enabled
  if (enableReorder && canDrag && elements && elements.length > 1) {
    return (
      <Reorder.Group
        axis="y"
        values={elements}
        onReorder={handleReorder}
        as="div"
        className="relative"
      >
        <LayoutGroup>
          {elements.map((element) => (
            <Reorder.Item
              key={element.id}
              value={element}
              as="div"
              className="relative"
              whileDrag={{
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)",
                zIndex: 50,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              <ResizeHandler
                element={element}
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
              </ResizeHandler>
            </Reorder.Item>
          ))}
        </LayoutGroup>
      </Reorder.Group>
    );
  }

  // Standard render with enhanced swap animations
  return (
    <LayoutGroup>
      <AnimatePresence mode="popLayout">
        {elements?.map((element) => {
          const isBeingDragged = isDraggingLocal === element.id;
          const isDropTarget =
            draggedOverElement?.id === element.id && !isBeingDragged;

          return (
            <motion.div
              key={element.id}
              layout
              layoutId={element.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={swapAnimationVariants}
              className={cn(
                "relative",
                isBeingDragged && "opacity-50 z-50",
                isDropTarget && "ring-2 ring-blue-500 ring-offset-2 rounded-lg",
              )}
              draggable={canDrag}
              onDragStart={(e) =>
                handleDragStart(e as unknown as React.DragEvent, element)
              }
              onDragEnd={handleDragEnd}
              style={{
                cursor: canDrag ? "grab" : "default",
              }}
              whileDrag={{
                cursor: "grabbing",
              }}
            >
              <ResizeHandler
                element={element}
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

                {/* Enhanced Drop Zone with Animation */}
                <motion.div
                  onDragOver={(e) =>
                    handleHover(e as unknown as React.DragEvent, element)
                  }
                  onDrop={(e) =>
                    handleDrop(e as unknown as React.DragEvent, element)
                  }
                  initial="hidden"
                  animate={isDropTarget ? "visible" : "hidden"}
                  variants={dropZoneVariants}
                  className={cn(
                    "relative flex items-center justify-center overflow-hidden rounded-lg mx-2 my-1",
                    "bg-primary/20",
                    "border-2 border-dashed border-primary/50",
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isDropTarget
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 text-primary font-semibold text-sm"
                  >
                    {/* Swap Icon */}
                    <motion.div
                      animate={{
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <ArrowRightLeft className="w-4.5 h-4.5 text-primary" />
                    </motion.div>
                    <span>{draggingElement ? "Swap Here" : "Insert Here"}</span>
                  </motion.div>

                  {/* Animated Background Pulse */}
                  <motion.div
                    className="absolute inset-0 bg-primary/10"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </ResizeHandler>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {isDraggingLocal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              background:
                "radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
