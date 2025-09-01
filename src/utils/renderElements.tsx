import EditorContextMenu from "@/components/editor/EditorContextMenu";
import ResizeHandler from "@/components/editor/resizehandler/ResizeHandler";
import {
  BaseComponent,
  ButtonComponent,
  CarouselComponent,
  FormComponent,
  ImageComponent,
  InputComponent,
  ListComponent,
  SelectComponent,
  FrameComponent,
} from "@/types/editor";
import { EditorElement, ElementType } from "@/types/global.type";

export function renderChildElement(
  element: EditorElement,
  props: any,
  excludes: ElementType[] = []
): React.ReactNode {
  const renderElement = (element: EditorElement) => {
    if (excludes.includes(element.type as ElementType)) {
      return null;
    }
    switch (element.type as ElementType) {
      case "Frame":
        return <FrameComponent element={element} {...props} />;
      case "Form":
        return <FormComponent element={element} {...props} />;
      case "Carousel":
        return <CarouselComponent element={element} {...props} />;
      case "Button":
        return <ButtonComponent element={element} {...props} />;
      case "Image":
        return <ImageComponent element={element} {...props} />;
      case "Input":
        return <InputComponent element={element} {...props} />;
      case "List":
        return <ListComponent element={element} {...props} />;
      case "Select":
        return <SelectComponent element={element} {...props} />;
      default:
        return <BaseComponent element={element} {...props} />;
    }
  };
  return (
    <ResizeHandler element={element} key={element.id}>
      <EditorContextMenu element={element}>
        {renderElement(element)}
      </EditorContextMenu>
    </ResizeHandler>
  );
}
