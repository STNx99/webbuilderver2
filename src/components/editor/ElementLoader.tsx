import { EditorElement } from "@/types/global.type";
import React from "react";
import { getComponentMap } from "@/constants/elements";
import ResizeHandler from "./resizehandler/ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";
import { EditorComponentProps } from "@/interfaces/editor.interface";

type Props = {
  elements: EditorElement[];
};
// Load element from the provided element array EditorElement[] base on the type
// 
export default function ElementLoader({ elements }: Props) {
  const renderElement = (element: EditorElement) => {
    const commonProps: EditorComponentProps = {
      element,
    };

    const Component = getComponentMap(commonProps);
    if (Component) {
      return <Component {...commonProps} />;
    }
    return null;
  };
  return (
    <>
      {elements.map((element) => (
        <ResizeHandler element={element} key={element.id}>
          <EditorContextMenu element={element}>
            {renderElement(element)}
          </EditorContextMenu>
        </ResizeHandler>
      ))}
    </>
  );
}
