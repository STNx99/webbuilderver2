import { ElementDAL } from "@/data/element";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/utils/elements/elementhelper";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  req: Request,
  res: Response,
  { params }: { params: Promise<{ id: string }> }
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
        { status: 401 }
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
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON",
          message: "Request body must be valid JSON",
        }),
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || !body.data) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          message:
            "Request body must contain a 'data' field with element information",
        }),
        { status: 400 }
      );
    }

    const element: Partial<EditorElement> = body.data;

    // Validate element data
    if (!element || typeof element !== "object") {
      return new Response(
        JSON.stringify({
          error: "Invalid element data",
          message: "Element data must be a valid object",
        }),
        { status: 400 }
      );
    }

    // Ensure element ID matches the URL parameter
    if (element.id && element.id !== elementId) {
      return new Response(
        JSON.stringify({
          error: "Element ID mismatch",
          message: "Element ID in body does not match URL parameter",
        }),
        { status: 400 }
      );
    }

    // Set the element ID to ensure consistency
    element.id = elementId;

    // Validate required fields
    if (!element.type || typeof element.type !== "string") {
      return new Response(
        JSON.stringify({
          error: "Invalid element type",
          message: "Element type is required and must be a string",
        }),
        { status: 400 }
      );
    }

    // Get element settings
    const settings = elementHelper.getElementSettings(element as EditorElement);

    // Update the element
    const updatedElement = await ElementDAL.updateElement(
      element as EditorElement,
      settings
    );

    if (!updatedElement) {
      return new Response(
        JSON.stringify({
          error: "Update failed",
          message:
            "Element could not be updated. It may not exist or you may not have permission to modify it.",
        }),
        { status: 404 }
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
      }
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
        { status: 400 }
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
          { status: 404 }
        );
      }
      if (error.code === "P2002") {
        // Prisma unique constraint
        return new Response(
          JSON.stringify({
            error: "Constraint violation",
            message: "Element update violates database constraints",
          }),
          { status: 409 }
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while updating the element",
      }),
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
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
    if (!response) {
      return new Response(
        JSON.stringify({ error: "Failed to delete element" }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({ message: `Element with ID ${elementId} deleted` }),
      { status: 204 }
    );
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 }
    );
  }
}
