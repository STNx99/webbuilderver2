import { getQueryClient } from "@/client/queryclient";
import { elementService } from "@/services/element";
import { projectService } from "@/services/project";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Editor from "./editor";

export const revalidate = 60;

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await projectService.getProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["elements", id],
    queryFn: () => elementService.getElements(id),
  }); 
  
  await queryClient.prefetchQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getProjectById(id),
  });
  
  // TODO: Prefetch fonts and other resources if needed
  await queryClient.prefetchQuery({
    queryKey: ["fonts"],
    queryFn: () => projectService.getFonts(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Editor />
    </HydrationBoundary>
  );
}
