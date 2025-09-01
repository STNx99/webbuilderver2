import { getQueryClient } from "@/client/queryclient";
import { elementService } from "@/services/element";
import { projectService } from "@/services/project";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Editor from "./editor";

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["elements", id],
      queryFn: () => elementService.getElements(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["project", id],
      queryFn: () => projectService.getProjectById(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["pages", id],
      queryFn: () => projectService.getProjectPages(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["fonts"],
      queryFn: () => projectService.getFonts(),
    }),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Editor id={id} pageId={page} />
    </HydrationBoundary>
  );
}
