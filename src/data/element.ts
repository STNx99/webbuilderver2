import prisma from "@/lib/prisma";
import { EditorElement } from "@/types/global.type";
import { ButtonElement } from "@/interfaces/elements.interface";

export const ElementDAL = {
  updateElement: async (element: EditorElement, settings: string | null) => {
    if (settings) {
      await prisma.setting.updateMany({
        where: { ElementId: element.id },
        data: {
          Settings: settings,
        },
      });
    }

    return await prisma.element.update({
      where: { Id: element.id },
      data: {
        Type: element.type,
        Name: element.name || "",
        Styles: JSON.parse(JSON.stringify(element.styles)),
        Content: element.content || "",
        ParentId: element.parentId || null,
        Src: element.src || null,
        Href: element.href || null,
        TailwindStyles: element.tailwindStyles || "",
        ProjectId: element.projectId,
      },
    });
  },

  deleteElement: async (id: string) => {
    return await prisma.element.delete({
      where: { Id: id },
    });
  },
};
