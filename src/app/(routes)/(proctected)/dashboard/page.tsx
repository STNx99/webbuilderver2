import { getQueryClient } from "@/client/queryclient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Projects from "./projects";
import { projectService } from "@/services/project";

export default async function DashBoardPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: projectService.getUserProjects,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Projects />
    </HydrationBoundary>
  );
}
