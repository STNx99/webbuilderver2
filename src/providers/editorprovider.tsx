"use client";

import React, { createContext, useContext } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EditorSideBar } from "@/components/editor/sidebar/EditorSideBar";
import LayoutSideBar from "@/components/editor/sidebar/LayoutSideBar";
import AIChatProvider from "./aiprovider";
import AIChatPanel from "@/components/editor/ai/AiChatPanel";
import { useAiChat } from "./aiprovider";
import { ElementCommentsPanel } from "@/components/editor/comments/ElementCommentsPanel";

interface EditorProviderProps {
  children: React.ReactNode;
  projectId?: string;
  userId?: string;
}

interface EditorContextType {
  projectId: string | null;
  userId: string | null;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within EditorProvider");
  }
  return context;
}

function EditorLayout({ children }: EditorProviderProps) {
  const { chatOpen } = useAiChat();

  return (
    <SidebarProvider className="flex h-screen w-screen overflow-hidden">
      <EditorSideBar />
      {chatOpen && <AIChatPanel />}
      <main className="flex-1 relative h-screen overflow-hidden">
        <SidebarTrigger />
        {children}
      </main>
      <LayoutSideBar />
      <ElementCommentsPanel />
    </SidebarProvider>
  );
}

export default function EditorProvider({
  children,
  projectId,
  userId,
}: EditorProviderProps) {
  return (
    <EditorContext.Provider
      value={{ projectId: projectId || null, userId: userId || null }}
    >
      <AIChatProvider>
        <EditorLayout>{children}</EditorLayout>
      </AIChatProvider>
    </EditorContext.Provider>
  );
}
