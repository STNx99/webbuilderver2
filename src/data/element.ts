import prisma from "@/lib/prisma";
import { EditorElement } from "@/types/global.type";
import type { Prisma, Element } from "@/generated/prisma";

// Field mapping from EditorElement to Prisma Element
const FIELD_MAPPING: Record<string, keyof Element> = {
  type: "Type",
  name: "Name",
  content: "Content",
  parentId: "ParentId",
  src: "Src",
  href: "Href",
  tailwindStyles: "TailwindStyles",
  projectId: "ProjectId",
  pageId: "PageId",
};

/**
 * Build a Prisma.ElementUncheckedUpdateInput from a partial EditorElement.
 * Only includes fields that are explicitly provided (not undefined).
 * Handles special cases like styles JSON serialization.
 */
function buildUpdateData(
  element: Partial<EditorElement>,
): Prisma.ElementUncheckedUpdateInput {
  const updateData: Record<string, unknown> = {};

  // Handle regular fields using the mapping
  Object.entries(FIELD_MAPPING).forEach(([editorField, dbField]) => {
    const value = (element as any)[editorField];
    if (value !== undefined) {
      updateData[dbField] = value;
    }
  });

  // Handle styles separately (JSON serialization)
  if ("styles" in element && element.styles !== undefined) {
    updateData.Styles = element.styles
      ? (JSON.parse(JSON.stringify(element.styles)) as Prisma.InputJsonValue)
      : ({} as Prisma.InputJsonValue);
  }

  return updateData as Prisma.ElementUncheckedUpdateInput;
}

export const ElementDAL = {
  async updateElement(
    element: Partial<EditorElement>,
    settings?: string | null,
  ): Promise<Element> {
    if (!element?.id) {
      throw new Error("updateElement failed: element id is required");
    }

    // Update settings if provided
    if (settings !== undefined) {
      await prisma.setting.updateMany({
        where: { ElementId: element.id },
        data: { Settings: settings ?? undefined },
      });
    }

    const updateData = buildUpdateData(element);

    if (Object.keys(updateData).length === 0) {
      throw new Error("No update fields provided");
    }

    try {
      return await prisma.element.update({
        where: { Id: element.id },
        data: updateData,
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
