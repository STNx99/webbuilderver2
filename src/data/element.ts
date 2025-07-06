import prisma from "@/lib/prisma";
import { EditorElement } from "@/types/global.type";
import { ButtonElement } from "@/interfaces/element";

export const ElementDAL = {
  updateElement: async (element: EditorElement, settings: string | null) => {
    if (settings) {
      await prisma.settings.updateMany({
        where: { ElementId: element.id },
        data: {
          Settings: settings,
        },
      })
    }
    
    return await prisma.elements.update({
      where: { Id: element.id },
      data: {
        Type: element.type,
        Name: element.name || "",
        Styles: JSON.stringify(element.styles) || "",
        Content: JSON.stringify(element.content) || "",
        ParentId: element.parentId || null,
        X: element.x || 0,
        Y: element.y || 0,
        Src: element.src || null,
        Href: element.href || null,
        TailwindStyles: element.tailwindStyles || "",
        ButtonType: (element as ButtonElement).buttonType || null,
        ProjectId: element.projectId,
      },
    });
  },
  
  deleteElement: async (id: string) => {
    return await prisma.elements.delete({
      where: { Id: id },
    });
  },
};
