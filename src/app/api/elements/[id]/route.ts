import { ElementDAL } from "@/data/element";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/utils/element/elementhelper";
import { auth } from "@clerk/nextjs/server";

interface ApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
  data?: any;
}

interface UpdatePayload {
  element?: Partial<EditorElement>;
  data?: Partial<EditorElement>;
  settings?: string;
  [key: string]: any;
}

function createErrorResponse(
  error: string,
  message: string,
  status: number,
): Response {
  return new Response(JSON.stringify({ error, message } as ApiResponse), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function createSuccessResponse(data: any, message: string): Response {
  return new Response(
    JSON.stringify({
      success: true,
      message,
      data,
    } as ApiResponse),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

async function parseRequestBody(req: Request): Promise<UpdatePayload> {
  try {
    return await req.json();
  } catch {
    throw new Error("Invalid JSON in request body");
  }
}

function normalizeElementData(payload: UpdatePayload): Partial<EditorElement> {
  if (payload.element) return payload.element;
  if (payload.data) return payload.data;
  const { element, data, settings, ...elementData } = payload;
  return elementData as Partial<EditorElement>;
}

function validateElementData(element: Partial<EditorElement>): void {
  if (!element || typeof element !== "object") {
    throw new Error("Element data must be a valid object");
  }

  if (element.type !== undefined && typeof element.type !== "string") {
    throw new Error("Element type must be a string if provided");
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(
        "Unauthorized",
        "You must be logged in to update elements",
        401,
      );
    }

    const { id: elementId } = await params;
    if (!elementId?.trim()) {
      return createErrorResponse(
        "Invalid element ID",
        "Element ID is required and must be a valid string",
        400,
      );
    }

    const payload = await parseRequestBody(req);
    const element = normalizeElementData(payload);

    validateElementData(element);

    if (element.id && element.id !== elementId) {
      return createErrorResponse(
        "Element ID mismatch",
        "Element ID in body does not match URL parameter",
        400,
      );
    }
    element.id = elementId;

    // Determine settings (explicit or computed)
    const settings =
      payload.settings !== undefined
        ? payload.settings
        : elementHelper.getElementSettings(element as EditorElement);

    // Update element using DAL
    const updatedElement = await ElementDAL.updateElement(
      element as EditorElement,
      settings ?? undefined,
    );

    // Return success response with updated element info
    return createSuccessResponse(
      {
        id: elementId,
        type: element.type,
        updatedAt: new Date().toISOString(),
      },
      `Element with ID ${elementId} updated successfully`,
    );
  } catch (error) {
    console.error("Error in PUT /api/elements/[id]:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "Invalid JSON in request body") {
        return createErrorResponse(
          "Invalid JSON",
          "Request body must be valid JSON",
          400,
        );
      }
      if (error.message === "Element data must be a valid object") {
        return createErrorResponse("Invalid element data", error.message, 400);
      }
      if (error.message === "Element type must be a string if provided") {
        return createErrorResponse("Invalid element type", error.message, 400);
      }
    }

    // Generic error fallback
    return createErrorResponse(
      "Internal server error",
      "An unexpected error occurred while updating the element",
      500,
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(
        "Unauthorized",
        "You must be logged in to delete elements",
        401,
      );
    }

    // Validate element ID from URL params
    const { id: elementId } = await params;
    if (!elementId?.trim()) {
      return createErrorResponse(
        "Invalid element ID",
        "Element ID is required and must be a valid string",
        400,
      );
    }

    const deleteResult = await ElementDAL.deleteElement(elementId);

    if (deleteResult === false) {
      return createErrorResponse(
        "Element not found",
        "The specified element does not exist",
        404,
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/elements/[id]:", error);

    return createErrorResponse(
      "Internal server error",
      "An unexpected error occurred while deleting the element",
      500,
    );
  }
}
