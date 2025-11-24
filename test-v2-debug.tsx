"use client";

import { TestV2Connection } from "@/components/collaboration/TestV2Connection";

export default function V2TestPage() {
  // Use the same pageId and projectId from your server logs
  const pageId = "7c3abf85-02f7-4fbe-9ce0-2182e13200c0";
  const projectId = "96269660-af6d-46aa-827c-0b491a178752";

  return (
    <div className="min-h-screen bg-gray-50">
      <TestV2Connection
        pageId={pageId}
        projectId={projectId}
        wsUrl="ws://localhost:8082"
      />
    </div>
  );
}
