import { EditorSideBar } from "@/components/editor/sidebar/EditorSideBar";
import LayoutSideBar from "@/components/editor/sidebar/LayoutSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex h-screen w-screen overflow-hidden">
      <EditorSideBar />
      <main className="flex-1 relative h-screen overflow-hidden">
        <SidebarTrigger />
        {children}
      </main>
      <LayoutSideBar />
    </SidebarProvider>
  );
}
