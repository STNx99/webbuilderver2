"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useCreateMarketplaceItem,
  useCategories,
  useTags,
  useUserProjects,
} from "@/hooks";
import { Loader2, Plus, X, Upload, Search } from "lucide-react";
import { CreateMarketplaceItemRequest } from "@/interfaces/market.interface";

const formSchema = z.object({
  projectId: z
    .string()
    .min(1, "Please select a project to base this template on"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  preview: z.string().optional(),
  templateType: z.enum(["full-site", "page", "section", "block"]),
  featured: z.boolean(),
  pageCount: z.number().int().positive().optional(),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),
  categoryIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateMarketplaceItemDialogProps {
  children?: React.ReactNode;
}

export function CreateMarketplaceItemDialog({
  children,
}: CreateMarketplaceItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExistingTags, setSelectedExistingTags] = useState<string[]>(
    [],
  );
  const [categorySearch, setCategorySearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const createItem = useCreateMarketplaceItem();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: existingTags, isLoading: isTagsLoading } = useTags();
  const { data: projects, isLoading: isProjectsLoading } = useUserProjects();

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!categorySearch.trim()) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]);

  const filteredExistingTags = useMemo(() => {
    if (!existingTags) return [];
    if (!tagSearch.trim()) return existingTags;
    return existingTags.filter((tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()),
    );
  }, [existingTags, tagSearch]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      title: "",
      description: "",
      preview: "",
      templateType: "block",
      featured: false,
      pageCount: undefined,
      tags: [],
      categoryIds: [],
    },
  });

  const customTags = form.watch("tags");

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !customTags.includes(trimmedTag)) {
      if (customTags.length < 10) {
        form.setValue("tags", [...customTags, trimmedTag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      customTags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
    form.setValue("categoryIds", newCategories);
  };

  const toggleExistingTag = (tagName: string) => {
    const newTags = selectedExistingTags.includes(tagName)
      ? selectedExistingTags.filter((tag) => tag !== tagName)
      : [...selectedExistingTags, tagName];

    setSelectedExistingTags(newTags);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: CreateMarketplaceItemRequest & { projectId: string } = {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        preview: data.preview || undefined,
        templateType: data.templateType,
        featured: data.featured,
        pageCount: data.pageCount,
        tags: [...data.tags, ...selectedExistingTags],
        categoryIds: selectedCategories,
      };

      await createItem.mutateAsync(payload);
      setOpen(false);
      form.reset();
      setSelectedCategories([]);
      setSelectedExistingTags([]);
      setCategorySearch("");
      setTagSearch("");
    } catch (error) {
      console.error("Failed to create marketplace item:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">
            Upload Template to Marketplace
          </DialogTitle>
          <DialogDescription>
            Share your project as a template with the community.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Project Selection */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Select Project *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project to template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isProjectsLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-sm">
                            Loading projects...
                          </span>
                        </div>
                      ) : projects && projects.length > 0 ? (
                        projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No projects available. Create a project first.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Title *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Template" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="templateType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Type *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-site">Full Website</SelectItem>
                        <SelectItem value="page">Single Page</SelectItem>
                        <SelectItem value="section">Section</SelectItem>
                        <SelectItem value="block">Block</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Description *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your template..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Preview Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/preview.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Pages</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value ? parseInt(value, 10) : undefined,
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Tags *</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Selected Tags Summary */}
                      {(selectedExistingTags.length > 0 ||
                        customTags.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 rounded-md">
                          {selectedExistingTags.map((tagName) => (
                            <Badge
                              key={`existing-${tagName}`}
                              variant="default"
                              className="cursor-pointer text-xs"
                              onClick={() => toggleExistingTag(tagName)}
                            >
                              {tagName}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                          {customTags.map((tag) => (
                            <Badge
                              key={`custom-${tag}`}
                              variant="secondary"
                              className="cursor-pointer text-xs"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Existing Tags */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Existing Tags
                          </Label>
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              placeholder="Search..."
                              value={tagSearch}
                              onChange={(e) => setTagSearch(e.target.value)}
                              className="pl-7 h-8 text-sm"
                            />
                          </div>
                          <div className="max-h-20 overflow-y-auto space-y-1">
                            {isTagsLoading ? (
                              <div className="flex items-center justify-center py-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                              </div>
                            ) : filteredExistingTags.length > 0 ? (
                              filteredExistingTags.slice(0, 5).map((tag) => (
                                <div
                                  key={tag.id}
                                  className="flex items-center space-x-2 hover:bg-muted/50 rounded px-2 py-1 cursor-pointer"
                                  onClick={() => toggleExistingTag(tag.name)}
                                >
                                  <Checkbox
                                    id={`tag-${tag.id}`}
                                    checked={selectedExistingTags.includes(
                                      tag.name,
                                    )}
                                    className="h-3 w-3"
                                  />
                                  <Label
                                    htmlFor={`tag-${tag.id}`}
                                    className="text-xs cursor-pointer flex-1"
                                  >
                                    {tag.name}
                                  </Label>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground text-center py-2">
                                No tags found
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Custom Tags */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Custom Tags
                          </Label>
                          <div className="flex gap-1">
                            <Input
                              placeholder="Add tag..."
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="h-8 text-sm"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddTag}
                              disabled={
                                !tagInput.trim() || customTags.length >= 10
                              }
                              className="h-8 px-2"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {selectedExistingTags.length + customTags.length}/10
                            tags
                          </p>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories */}
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Categories
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Selected Categories */}
                      {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 rounded-md">
                          {selectedCategories.map((categoryId) => {
                            const category = categories?.find(
                              (c) => c.id === categoryId,
                            );
                            return category ? (
                              <Badge
                                key={categoryId}
                                variant="default"
                                className="cursor-pointer text-xs"
                                onClick={() => toggleCategory(categoryId)}
                              >
                                {category.name}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}

                      {/* Category Selection */}
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Search categories..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          className="pl-7 h-8 text-sm"
                        />
                      </div>

                      <div className="max-h-20 overflow-y-auto space-y-1">
                        {isCategoriesLoading ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                          </div>
                        ) : filteredCategories.length > 0 ? (
                          filteredCategories.slice(0, 6).map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center space-x-2 hover:bg-muted/50 rounded px-2 py-1 cursor-pointer"
                              onClick={() => toggleCategory(category.id)}
                            >
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={selectedCategories.includes(
                                  category.id,
                                )}
                                className="h-3 w-3"
                              />
                              <Label
                                htmlFor={`category-${category.id}`}
                                className="text-xs cursor-pointer flex-1"
                              >
                                {category.name}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            No categories found
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <div className="space-y-0 leading-none">
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Featured Template
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Mark as featured (requires admin approval)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createItem.isPending}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createItem.isPending}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
              >
                {createItem.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Template
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
