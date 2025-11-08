"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EditorSideBar } from "@/components/editor/sidebar/EditorSideBar";
import LayoutSideBar from "@/components/editor/sidebar/LayoutSideBar";
import AIChatProvider from "./aiprovider";
import AIChatPanel from "@/components/editor/ai/AiChatPanel";
import { useAiChat } from "./aiprovider";
import { ElementCommentsPanel } from "@/components/editor/comments/ElementCommentsPanel";

interface EditorProviderProps {
  children: React.ReactNode;
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

export default function EditorProvider({ children }: EditorProviderProps) {
  return (
    <AIChatProvider>
      <EditorLayout>{children}</EditorLayout>
    </AIChatProvider>
  );
}
