"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useAiChat } from "@/providers/aiprovider";
import { ProjectPageCommand } from "../ProjectPageCommand";
import { ElementSelector } from "./ElementSelector";
import CMSManager from "./cmsmanager/CMSManager";
import SnapshotManager from "./SnapshotManager";
import { ImageSelector } from "./imageupload/ImageSelector";

export function EditorSideBar() {
  const { chatOpen } = useAiChat();

  if (chatOpen) return null;

  return (
    <Sidebar side="left">
      <SidebarContent>
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["components", "pages", "imageupload", "cms", "snapshots"]}
        >
          <AccordionItem value="components">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger>Components</AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                <SidebarGroupContent>
                  <ElementSelector />
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
          <AccordionItem value="pages">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger>Project's pages</AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                <SidebarGroupContent>
                  <ProjectPageCommand></ProjectPageCommand>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
          <AccordionItem value="imageupload">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger>Image Upload</AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                <SidebarGroupContent>
                  <ImageSelector />
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
          <AccordionItem value="cms">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger>CMS Management</AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                <SidebarGroupContent>
                  <CMSManager />
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
          <AccordionItem value="snapshots">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger>Snapshots</AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                <SidebarGroupContent>
                  <SnapshotManager />
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
        </Accordion>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={"/settings/preferences"}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
