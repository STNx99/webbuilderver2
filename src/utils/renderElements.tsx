import ResizeHandler from "@/components/editor/ResizeHandler";
import {
  BaseComponent,
  ButtonComponent,
  CarouselComponent,
  ChartComponent,
  DataTableComponent,
  FormComponent,
  ImageComponent,
  InputComponent,
  ListComponent,
  SelectComponent,
  FrameComponent,
} from "@/types/editor";
import { EditorElement, ElementType } from "@/types/global.type";

export function renderChildElement (element: EditorElement, props: any) : React.ReactNode {
    const renderElement = (element: EditorElement) => { 
        switch (element.type as ElementType) {
          case "Frame":
            return <FrameComponent key={element.id} element={element} {...props} />;
          case "Form":
            return <FormComponent key={element.id} element={element} {...props} />;
          case "Carousel":
            return (
              <CarouselComponent key={element.id} element={element} {...props} />
            );
          case "Button":
            return <ButtonComponent key={element.id} element={element} {...props} />;
          case "Chart":
            return <ChartComponent key={element.id} element={element} {...props} />;
          case "DataTable":
            return (
              <DataTableComponent key={element.id} element={element} {...props} />
            );
          case "Image":
            return <ImageComponent key={element.id} element={element} {...props} />;
          case "Input":
            return <InputComponent key={element.id} element={element} {...props} />;
          case "List":
            return <ListComponent key={element.id} element={element} {...props} />;
          case "Select":
            return <SelectComponent key={element.id} element={element} {...props} />;
          default:
            return <BaseComponent key={element.id} element={element} {...props} />;
        }
    }
    return (
      <ResizeHandler element={element} key={element.id}>
        {renderElement(element)}
      </ResizeHandler>
  )
};
