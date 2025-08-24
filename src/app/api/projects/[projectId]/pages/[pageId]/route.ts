import { pageDAL } from "@/data/page";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string; pageId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorize", { status: 401 });
    }
    const { projectId, pageId } = await params;
    if (!projectId || !pageId) {
      return new NextResponse("Please provide a projectId or pageId", {
        status: 400,
      });
    }

    const result = await pageDAL.deletePage(pageId, projectId);
    if (result) {
      return new NextResponse(null, { status: 204 });
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Page not found or could not be deleted" }),
        { status: 404 },
      );
    }
  } catch (error) {
    console.log("Error when deleting page", error);
    return new NextResponse(JSON.stringify({ error: "Error deleting page" }), {
      status: 500,
    });
  }
}
