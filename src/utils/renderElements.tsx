import EditorContextMenu from "@/components/editor/EditorContextMenu";
import ResizeHandler from "@/components/editor/resizehandler/ResizeHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { getComponentMap } from "@/constants/elements";
import { EditorElement, ElementType } from "@/types/global.type";

export function renderChildElement(
  element: EditorElement,
  props: EditorComponentProps,
  excludes: ElementType[] = [],
): React.ReactNode {
  const renderElement = (element: EditorElement) => {
    if (excludes.includes(element.type as ElementType)) {
      return null;
    }
    const childProps: EditorComponentProps = {
      element,
    };
    const Component = getComponentMap(childProps);
    if (Component) {
      return <Component {...childProps} />;
    }
    return null;
  };
  return (
    <ResizeHandler element={element} key={element.id}>
      <EditorContextMenu element={element}>
        {renderElement(element)}
      </EditorContextMenu>
    </ResizeHandler>
  );
}
