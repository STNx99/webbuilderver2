"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Code2, Save, Eye, ArrowLeft, Palette } from "lucide-react";
import { Project } from "@/interfaces/project.interface";
import { projectService } from "@/services/project";
import ProjectPreview from "./ProjectPreview";
import { useProjectStore } from "@/globalstore/projectstore";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

const PRESET_COLORS = [
  { name: "Blue Ocean", colors: { primary: "#3b82f6", secondary: "#e0e7ff", accent: "#1e40af" } },
  { name: "Green Forest", colors: { primary: "#10b981", secondary: "#d1fae5", accent: "#047857" } },
  { name: "Purple Magic", colors: { primary: "#8b5cf6", secondary: "#ede9fe", accent: "#5b21b6" } },
  { name: "Orange Sunset", colors: { primary: "#f59e0b", secondary: "#fef3c7", accent: "#d97706" } },
  { name: "Red Passion", colors: { primary: "#ef4444", secondary: "#fee2e2", accent: "#dc2626" } },
  { name: "Pink Rose", colors: { primary: "#ec4899", secondary: "#fce7f3", accent: "#be185d" } }
];

export default function ProjectSettings() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { updateProject } = useProjectStore();
  const projectId = params.id as string;

  const [customCSS, setCustomCSS] = useState("");
  const [selectedColors, setSelectedColors] = useState<ColorScheme>({
    primary: "#3b82f6",
    secondary: "#e0e7ff", 
    accent: "#1e40af"
  });
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [subdomain, setSubdomain] = useState("");

  const { data: project, error, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectService.getProjectById(projectId),
    enabled: !!projectId,
  });

  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject: Partial<Project> & { id: string }) => {
      const { id, createdAt, updatedAt, deletedAt, ownerId, ...body } = updatedProject;
      return projectService.updateProjectPartial(id, body as Partial<Project>);
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(["project", projectId], updatedProject);
      updateProject(updatedProject);
      console.log("Project updated successfully!");
    },
    onError: (error: unknown) => {
      let message = "Failed to update project";
      try {
        if (error && typeof error === "object" && (error as any).message) {
          message = String((error as any).message);
          const jsonMatch = message.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            message = parsed.errorMessage || parsed.message || JSON.stringify(parsed);
          }
        }
      } catch {}
      
      console.error("Update error:", error);
      console.error("Server message:", message);
      
      alert(`Update failed: ${message}`);
    }
  });

  useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
      setProjectDescription(project.description || "");
      setIsPublished(project.published || false);
      setSubdomain(project.subdomain || "");
      if (project.header?.cssStyles) {
        setCustomCSS(project.header.cssStyles || "");
      }
      if (project.styles && typeof project.styles === "object") {
        const styles = project.styles as Record<string, unknown>;
        setSelectedColors({
          primary: (styles.primary as string) || "#3b82f6",
          secondary: (styles.secondary as string) || "#e0e7ff",
          accent: (styles.accent as string) || "#1e40af"
        });
      }
    }
  }, [project]);

  const handleColorPresetSelect = (colors: ColorScheme) => {
    setSelectedColors(colors);
  };

  const generateColorsCSS = (colors: ColorScheme) => {
    return `
:root {
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
}


.text-primary, [class*="text-primary"] {
  color: ${colors.primary} !important;
}

.border-primary, [class*="border-primary"] {
  border-color: ${colors.primary} !important;
}
`;
  };

  const handleSave = () => {
    const colorCSS = generateColorsCSS(selectedColors);
    const combinedCSS = customCSS + '\n\n/* Auto-generated Color Scheme */\n' + colorCSS;
    
    const updatedProject = {
      id: projectId,
      name: projectName,
      description: projectDescription,
      published: isPublished,
      subdomain,
      header: {
        ...project?.header,
        cssStyles: combinedCSS
      },
      styles: selectedColors as unknown as Record<string, unknown>
    };
    updateProjectMutation.mutate(updatedProject);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center mx-auto">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6 mx-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2 hover:bg-blue-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Project Settings</h1>
              <p className="text-gray-600 text-lg">Customize your project appearance and styles</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={updateProjectMutation.isPending} 
            className="flex items-center gap-2  hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Color Scheme */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className=" rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Color Scheme
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Choose colors for your project theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Custom Color Inputs */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-800">Custom Colors</Label>
                  <div className="p-6 rounded-2xl border-2 border-blue-200">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center space-y-3">
                        <Label className="text-sm font-bold text-gray-700 flex items-center justify-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                          Primary
                        </Label>
                        <div className="relative group mx-auto w-fit">
                          <input
                            type="color"
                            id="primary-color"
                            value={selectedColors.primary}
                            onChange={(e) => setSelectedColors(prev => ({ ...prev, primary: e.target.value }))}
                            className="w-16 h-16 rounded-2xl border-3 border-white shadow-xl cursor-pointer transition-all duration-300 group-hover:scale-110 mx-auto"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                        </div>
                        <Input
                          value={selectedColors.primary}
                          onChange={(e) => setSelectedColors(prev => ({ ...prev, primary: e.target.value }))}
                          className="font-mono text-xs border-2 focus:border-blue-400 transition-colors rounded-lg bg-white/80 text-center"
                          placeholder="#3b82f6"
                        />
                      </div>
                      
                      <div className="text-center space-y-3">
                        <Label className="text-sm font-bold text-gray-700 flex items-center justify-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
                          Secondary
                        </Label>
                        <div className="relative group mx-auto w-fit">
                          <input
                            type="color"
                            id="secondary-color"
                            value={selectedColors.secondary}
                            onChange={(e) => setSelectedColors(prev => ({ ...prev, secondary: e.target.value }))}
                            className="w-16 h-16 rounded-2xl border-3 border-white shadow-xl cursor-pointer transition-all duration-300 group-hover:scale-110 mx-auto"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                        </div>
                        <Input
                          value={selectedColors.secondary}
                          onChange={(e) => setSelectedColors(prev => ({ ...prev, secondary: e.target.value }))}
                          className="font-mono text-xs border-2 focus:border-blue-400 transition-colors rounded-lg bg-white/80 text-center"
                          placeholder="#e0e7ff"
                        />
                      </div>
                      
                      <div className="text-center space-y-3">
                        <Label className="text-sm font-bold text-gray-700 flex items-center justify-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500"></div>
                          Accent
                        </Label>
                        <div className="relative group mx-auto w-fit">
                          <input
                            type="color"
                            id="accent-color"
                            value={selectedColors.accent}
                            onChange={(e) => setSelectedColors(prev => ({ ...prev, accent: e.target.value }))}
                            className="w-16 h-16 rounded-2xl border-3 border-white shadow-xl cursor-pointer transition-all duration-300 group-hover:scale-110 mx-auto"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                        </div>
                        <Input
                          value={selectedColors.accent}
                          onChange={(e) => setSelectedColors(prev => ({ ...prev, accent: e.target.value }))}
                          className="font-mono text-xs border-2 focus:border-blue-400 transition-colors rounded-lg bg-white/80 text-center"
                          placeholder="#1e40af"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Preset Colors */}
                <div>
                  <Label className="text-base font-semibold text-gray-800">🎨 Preset Colors</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {PRESET_COLORS.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorPresetSelect(preset.colors)}
                        className="p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1"
                      >
                        <div className="flex justify-center gap-2 mb-3">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-125"
                            style={{ 
                              backgroundColor: preset.colors.primary,
                              boxShadow: `0 4px 16px ${preset.colors.primary}40`
                            }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-125"
                            style={{ 
                              backgroundColor: preset.colors.secondary,
                              boxShadow: `0 4px 16px ${preset.colors.secondary}40`
                            }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-125"
                            style={{ 
                              backgroundColor: preset.colors.accent,
                              boxShadow: `0 4px 16px ${preset.colors.accent}40`
                            }}
                          />
                        </div>
                        <p className="text-sm font-bold group-hover:text-purple-600 transition-colors duration-300">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                
              </CardContent>
            </Card>
          </div>
          <div className="lg:sticky lg:top-6">
            <Card className="h-fit border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5 text-indigo-600" />
                  Live Preview
                </CardTitle>
                <CardDescription className="text-gray-600">See how your changes look in real-time</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-96">
                <div className="h-full w-full">
                  <ProjectPreview projectId={projectId} colors={selectedColors} className="h-full w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
