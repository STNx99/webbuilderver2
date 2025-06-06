"use client";
import { projectService, type Project } from "@/services/project";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Projects() {
  const { data } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: projectService.getUserProjects,
  });
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Projects</h1>
      <ul className="mt-4 space-y-2">
        {data?.map((project) => (
          <li key={project.id} className="p-4 border rounded shadow">
            <Link
              href={`/editor/${project.id}`}
              className="text-xl font-semibold"
            >
              {project.name}
            </Link>
            <p className="text-gray-600">{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
