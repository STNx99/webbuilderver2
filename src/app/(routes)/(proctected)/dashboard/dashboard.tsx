"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { projectService } from "@/services/project";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import createProject from "@/app/actions/project";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getUserProjects,
  });

  const projectSchema = z.object({
    name: z.string().min(2, "Project name must be at least 2 characters long"),
    subdomain: z.string().optional(),
    description: z.string().optional(),
    published: z.boolean().optional(),
    styles: z.record(z.string(), z.any()),
  });
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      subdomain: "",
      description: "",
      published: false,
      styles: {},
    },
  });

  function onSubmit(data: z.infer<typeof projectSchema>) {
    createProject(data);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {isLoading ? (
        <p>Loading projects...</p>
      ) : (
        <ul className="list-disc">
          {data?.map((project) => (
            <li key={project.id} className="mb-2">
              <a
                href={`/editor/${project.id}`}
                className="text-blue-600 hover:underline"
              >
                {project.name}
              </a>
            </li>
          ))}
        </ul>
      )}{" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md"
        >
          {/* Project Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormDescription>
                  Choose a descriptive name for your project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subdomain Field */}
          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdomain (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="my-awesome-site" {...field} />
                </FormControl>
                <FormDescription>
                  Custom subdomain for your project URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Describe your project" {...field} />
                </FormControl>
                <FormDescription>
                  Brief description of what your project is about.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Published Field - using Input since we don't have Checkbox */}
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Published Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value ? "true" : "false"}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="false">Draft</option>
                    <option value="true">Published</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Choose whether to publish your project immediately.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </form>
      </Form>
    </div>
  );
}
