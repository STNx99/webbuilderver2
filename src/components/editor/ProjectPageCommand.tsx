
"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePageStore } from "@/globalstore/pagestore";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { Page } from "@/interfaces/page.interface";
import { useParams } from "next/navigation";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// CreatePageDialog component
function CreatePageDialog() {
  const { createPage, pages } = usePageStore();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [pageName, setPageName] = useState("");
  const [pageType, setPageType] = useState<"sp" | "dp">("sp");

  const handleCreatePage = () => {
    if (!pageName.trim()) {
      return; // Prevent creating a page with an empty name
    }
    const newPage: Page = {
      id: uuidv4(),
      name: pageName,
      projectId: id as string,
      styles: {},
      type: pageType,
      deletedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    createPage(newPage);
    setOpen(false); // Close the dialog
    setPageName(""); // Reset the input field
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start h-6">
          + Add New Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Enter a name for your new page.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => e.key === "Enter" && handleCreatePage()}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              onValueChange={(value: "sp" | "dp") => setPageType(value)}
              defaultValue="sp"
            >
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder="Select a page type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sp">Single Page</SelectItem>
                <SelectItem value="dp">Dynamic Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreatePage}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DeletePageDialogProps = {
  page: Page
  onDelete: (id : string) => void
}

// DeletePageDialog component
function DeletePageDialog({ page, onDelete } : DeletePageDialogProps) {
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    onDelete(page.id);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-xs h-6 px-2">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Page</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the page named `
            <span className="font-semibold">{page.name}</span>`? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main component using the dialogs
export function ProjectPageCommand() {
  const { pages, deletePage } = usePageStore();
  const { id } = useParams();

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a page or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {pages.map((page) => (
          <CommandItem key={page.id} className="group justify-between">
            <span>{page.name}</span>
            <div className="flex gap-2">
              <Button variant="ghost" className="text-xs h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </Button>
              <DeletePageDialog page={page} onDelete={deletePage} />
            </div>
          </CommandItem>
        ))}
        <CommandSeparator />
        <CommandItem asChild onSelect={() => {}}>
          <CreatePageDialog />
        </CommandItem>
      </CommandList>
    </Command>
  );
}
