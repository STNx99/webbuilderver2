import { EditorElement } from "@/types/global.type";
import React from "react";
import { getComponentMap } from "@/constants/elements";
import ResizeHandler from "./resizehandler/ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { usePageStore } from "@/globalstore/pagestore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface ElementLoaderProps {
  elements?: EditorElement[];
}

export default function ElementLoader({ elements }: ElementLoaderProps = {}) {
  const { currentPage } = usePageStore();
  const { draggedOverElement, draggingElement } = useSelectionStore();

  const filteredElements =
    elements ||
    elementHelper.filterElementByPageId(currentPage?.Id || undefined);
  const renderElement = (element: EditorElement) => {
    const commonProps: EditorComponentProps = {
      element,
    };

    const Component = getComponentMap(commonProps);
    return Component ? <Component {...commonProps} /> : null;
  };
  return (
    <LayoutGroup>
      {filteredElements.map((element) => (
        <motion.div key={element.id} layout="position">
          <AnimatePresence>
            {draggedOverElement?.id === element.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 0.7,
                  height: 50,
                }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-400 border-2 border-dashed border-blue-600 flex items-center justify-center text-blue-800 font-semibold"
                style={{ width: "100%" }}
              >
                {draggingElement ? "Swap Here" : "Drop Here"}
              </motion.div>
            )}
          </AnimatePresence>
          <ResizeHandler element={element}>
            <EditorContextMenu element={element}>
              {renderElement(element)}
            </EditorContextMenu>
          </ResizeHandler>
        </motion.div>
      ))}
    </LayoutGroup>
  );
}
