import prisma from "@/lib/prisma";
import { EditorElement } from "@/types/global.type";
import type { Prisma, Element } from "@/generated/prisma";

export const ElementDAL = {
  async updateElement(
    element: Partial<EditorElement>,
    settings?: string | null,
  ): Promise<Element> {
    if (!element?.id) {
      throw new Error("updateElement failed: element id is required");
    }

    if (settings !== undefined) {
      await prisma.setting.updateMany({
        where: { ElementId: element.id },
        data: { Settings: settings ?? undefined },
      });
    }

    try {
      return await prisma.element.update({
        where: { Id: element.id },
        data: {
          Type: element.type ?? undefined,
          Styles: element.styles as Prisma.InputJsonValue | undefined,
          Content: element.content ?? undefined,
          ParentId: element.parentId ?? undefined,
          Href: element.href ?? undefined,
          Src: element.src ?? undefined,
          Name: element.name ?? undefined,
          TailwindStyles: element.tailwindStyles ?? undefined,
        },
      });
    } catch (error) {
      console.error("[ElementDAL.updateElement] update error:", error);
      throw new Error(
        `Failed to update element: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  async deleteElement(id: string): Promise<boolean> {
    try {
      await prisma.element.delete({ where: { Id: id } });
      return true;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "P2025"
      ) {
        return false;
      }
      console.error("[ElementDAL.deleteElement] delete error:", error);
      throw new Error(
        `Failed to delete element: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
};
