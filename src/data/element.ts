import prisma from "@/lib/prisma";
import { EditorElement } from "@/types/global.type";
import type { Prisma, Element } from "@/generated/prisma";

/**
 * Build a Prisma.ElementUncheckedUpdateInput using Object.fromEntries.
 * Only include keys that are explicitly provided on the incoming element object.
 * - If a property is not present (=== undefined) it's omitted.
 * - If a property is present and explicitly `null`, it will be included so nullable DB fields can be cleared.
 * - `styles` is JSON-serialized when provided.
 */
function buildUpdateData(
  element: Partial<EditorElement>,
): Prisma.ElementUncheckedUpdateInput {
  const entries: Array<[keyof Element, unknown]> = [];

  if (element.type !== undefined) entries.push(["Type", element.type]);

  if (element.name !== undefined) entries.push(["Name", element.name]);

  if ("styles" in element) {
    const stylesValue: Prisma.InputJsonValue | undefined =
      element.styles === undefined
        ? undefined
        : element.styles
          ? (JSON.parse(
              JSON.stringify(element.styles),
            ) as unknown as Prisma.InputJsonValue)
          : ({} as Prisma.InputJsonValue);

    if (stylesValue !== undefined) entries.push(["Styles", stylesValue]);
  }

  if (element.content !== undefined) entries.push(["Content", element.content]);

  if ("parentId" in element)
    entries.push(["ParentId", element.parentId as string | null | undefined]);

  if (element.src !== undefined)
    entries.push(["Src", element.src as string | null | undefined]);

  if (element.href !== undefined)
    entries.push(["Href", element.href as string | null | undefined]);

  if (element.tailwindStyles !== undefined)
    entries.push(["TailwindStyles", element.tailwindStyles]);

  if (element.projectId !== undefined)
    entries.push(["ProjectId", element.projectId]);

  if ("pageId" in element)
    entries.push(["PageId", element.pageId as string | null | undefined]);

  return Object.fromEntries(
    entries,
  ) as unknown as Prisma.ElementUncheckedUpdateInput;
}

export const ElementDAL = {
  async updateElement(
    element: Partial<EditorElement>,
    settings?: string | null,
  ): Promise<Element> {
    if (!element || !element.id) {
      throw new Error("updateElement failed: element id is required");
    }


    if (settings !== undefined) {
      await prisma.setting.updateMany({
        where: { ElementId: element.id },
        data: { Settings: settings ?? undefined },
      });
    }

    const data = buildUpdateData(element);

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update fields provided");
    }

    try {
      const updated = await prisma.element.update({
        where: { Id: element.id },
        data,
      });
      return updated;
    } catch (err) {
      console.error("[ElementDAL.updateElement] update error:", err);
      throw err;
    }
  },

  async deleteElement(id: string): Promise<boolean> {
    try {
      await prisma.element.delete({ where: { Id: id } });
      return true;
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code?: string }).code === "P2025"
      ) {
        return false;
      }
      throw err;
    }
  },
};
