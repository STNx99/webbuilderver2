import { EditorSideBar } from "@/components/editor/sidebar/EditorSideBar";
import LayoutSideBar from "@/components/editor/sidebar/LayoutSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <EditorSideBar />
      <main className="w-full h-full">
        <SidebarTrigger />
        {children}
      </main>
      <LayoutSideBar />
    </SidebarProvider>
  );
}
