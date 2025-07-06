import { getQueryClient } from "@/client/queryclient";
import { projectService } from "@/services/project";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getUserProjects(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
