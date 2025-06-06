import useElementStore from "@/globalstore/elementstore";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/global.type";

function useElementHandler(element: EditorElement) {
  const {
    addElement,
    deleteElement,
    setSelectedElement,
    setHoveredElement,
    updateElement,
  } = useElementStore();

  const handleDoubleClick = (e: React.MouseEvent, element: EditorElement) => {
    e.stopPropagation();
    if (element.isSelected) {
      setSelectedElement(undefined);
    } else {
      setSelectedElement(element);
    }
    updateElement(element.id, { isSelected: !element.isSelected });
  };

  const handleMouseOver = (event: React.MouseEvent) => {
    console.log("Mouse over element:", event.currentTarget);
  };
  
  const tailwindStyles = cn("", element.tailwindStyles, {
    "border-2 border-dashed border-gray-300": element.isSelected,
  });
  const commonProps = {
    style: element.styles,
    className: tailwindStyles,
    onMouseOver: handleMouseOver,
    onDoubleClick: (e: React.MouseEvent) => handleDoubleClick(e, element),
  };

  return {
    handleMouseOver,
    tailwindStyles,
    commonProps,
  };
}
