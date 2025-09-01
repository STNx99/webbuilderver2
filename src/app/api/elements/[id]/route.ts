import { ElementDAL } from "@/data/element";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/utils/element/elementhelper";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "You must be logged in to update elements",
        }),
        { status: 401 },
      );
    }

    // Parse and validate element ID from params
    const { id: elementId } = await params;
    if (
      !elementId ||
      typeof elementId !== "string" ||
      elementId.trim() === ""
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid element ID",
          message: "Element ID is required and must be a valid string",
        }),
        { status: 400 },
      );
    }

    // Parse request body and normalize payload.
    // Accept shapes:
    //  - { element: { ... }, settings: ... }
    //  - { data: { ... } }
    //  - raw element object
    let payload;
    try {
      payload = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON",
          message: "Request body must be valid JSON",
        }),
        { status: 400 },
      );
    }

    // Normalize element payload (element field takes precedence, then data, then raw)
    const maybeElement =
      payload && typeof payload === "object"
        ? "element" in payload
          ? (payload as any).element
          : "data" in payload
            ? (payload as any).data
            : payload
        : undefined;

    const element: Partial<EditorElement> =
      (maybeElement as Partial<EditorElement>) ??
      ({} as Partial<EditorElement>);

    if (!element || typeof element !== "object") {
      return new Response(
        JSON.stringify({
          error: "Invalid element data",
          message: "Request body must be an object",
        }),
        { status: 400 },
      );
    }

    // Ensure element ID matches the URL parameter if provided; otherwise set it
    if (element.id && element.id !== elementId) {
      return new Response(
        JSON.stringify({
          error: "Element ID mismatch",
          message: "Element ID in body does not match URL parameter",
        }),
        { status: 400 },
      );
    }
    element.id = elementId;

    // Minimal type check: if provided, it must be a string
    if (element.type !== undefined && typeof element.type !== "string") {
      return new Response(
        JSON.stringify({
          error: "Invalid element type",
          message: "If provided, element.type must be a string",
        }),
        { status: 400 },
      );
    }

    // Determine settings: prefer explicit settings in the request payload if present,
    // otherwise compute from the element using elementHelper.
    const payloadSettings =
      payload && typeof payload === "object" && "settings" in payload
        ? (payload as any).settings
        : undefined;

    const settings =
      payloadSettings !== undefined
        ? payloadSettings
        : elementHelper.getElementSettings(element as EditorElement);

    // Update the element (pass undefined when settings intentionally absent)
    const updatedElement = await ElementDAL.updateElement(
      element as EditorElement,
      settings ?? undefined,
    );

    if (!updatedElement) {
      return new Response(
        JSON.stringify({
          error: "Update failed",
          message:
            "Element could not be updated. It may not exist or you may not have permission to modify it.",
        }),
        { status: 404 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Element with ID ${elementId} updated successfully`,
        data: {
          id: elementId,
          type: element.type,
          updatedAt: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error in PUT /api/elements/[id]:", error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON",
          message: "Request body contains invalid JSON",
        }),
        { status: 400 },
      );
    }

    // Database-related errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        // Prisma record not found
        return new Response(
          JSON.stringify({
            error: "Element not found",
            message: "The specified element does not exist",
          }),
          { status: 404 },
        );
      }
      if (error.code === "P2002") {
        // Prisma unique constraint
        return new Response(
          JSON.stringify({
            error: "Constraint violation",
            message: "Element update violates database constraints",
          }),
          { status: 409 },
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while updating the element",
      }),
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const { id: elementId } = await params;

    if (!elementId) {
      return new Response(JSON.stringify({ error: "Element ID is required" }), {
        status: 400,
      });
    }

    const response = await ElementDAL.deleteElement(elementId);
    if (response === false) {
      return new Response(JSON.stringify({ error: "Element not found" }), {
        status: 404,
      });
    }
    if (!response) {
      return new Response(
        JSON.stringify({ error: "Failed to delete element" }),
        { status: 500 },
      );
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 },
    );
  }
}
