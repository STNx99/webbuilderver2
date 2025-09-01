import EditorProvider from "@/providers/editorprovider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <EditorProvider>
            {children}
        </EditorProvider>
    );
}
