import { getQueryClient } from "@/client/queryclient";
import { projectService } from "@/services/project";
import { elementService } from "@/services/element";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PreviewRenderer from "./PreviewRenderer";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getProjectPublic(id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["elements", id],
    queryFn: () => elementService.getElementsPublic(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PreviewRenderer projectId={id} />
    </HydrationBoundary>
  );
}
