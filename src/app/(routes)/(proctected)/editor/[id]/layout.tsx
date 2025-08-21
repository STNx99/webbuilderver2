import EditorProvider from "@/providers/editorprovider";
import AIChatPanel from "@/components/editor/ai/AiChatPanel";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <EditorProvider>
            {children}
        </EditorProvider>
    );
}
