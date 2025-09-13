import { EditorElement } from "@/types/global.type";
import React from "react";
import { getComponentMap } from "@/constants/elements";
import ResizeHandler from "./resizehandler/ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { useElementStore } from "@/globalstore/elementstore";
import { usePageStore } from "@/globalstore/pagestore";
import { elementHelper } from "@/utils/element/elementhelper";

// Load element from the provided element array EditorElement[] base on the type
//
export default function ElementLoader() {
  const { currentPage } = usePageStore();

  const filteredElements = elementHelper.filterElementByPageId(
    currentPage?.Id || undefined,
  );
  const renderElement = (element: EditorElement) => {
    const commonProps: EditorComponentProps = {
      element,
    };

    const Component = getComponentMap(commonProps);
    return Component ? <Component {...commonProps} /> : null;
  };
  return (
    <>
      {filteredElements.map((element) => (
        <ResizeHandler element={element} key={element.id}>
          <EditorContextMenu element={element}>
            {renderElement(element)}
          </EditorContextMenu>
        </ResizeHandler>
      ))}
    </>
  );
}
