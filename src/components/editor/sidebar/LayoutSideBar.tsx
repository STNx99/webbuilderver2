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
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Configurations from "./configurations/Configurations";
import ElementTreeItem from "./ElementTreeItem";
import { Square } from "lucide-react";
import { useAiChat } from "@/providers/aiprovider";
import { useElementStore } from "@/globalstore/elementstore";
import { elementHelper } from "@/utils/element/elementhelper";
// import Chat from "@/components/ChatModel";

function LayoutSideBar() {
  const params = useParams();
  const { toggleSidebar } = useSidebar();
  const { toggleChat } = useAiChat();
  const visitProjectSubdomain = (projectId: string) => {
    // const subdomainUrl = getProjectSubdomainUrl(projectId);
    // window.open(subdomainUrl, "_blank");
  };
  const { elements, selectedElement } = useElementStore();
  const searchParams = useSearchParams();
  return (
    <Sidebar side="right">
      <SidebarContent>
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["layout", "configuration"]}
        >
          <AccordionItem value="layout">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger className="sidebar-layout">
                  Layout
                </AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                <SidebarGroupContent>
                  <div className="max-h-60 overflow-y-auto">
                    {elementHelper.filterElementByPageId(
                      searchParams.get("page") || undefined,
                    ).length > 0 ? (
                      elements.map((element) => (
                        <ElementTreeItem
                          key={element.id || Math.random()}
                          element={element}
                        />
                      ))
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        No elements yet. Drag components from the left sidebar.
                      </div>
                    )}
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
          <AccordionItem value="configuration">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger className="config-components">
                  Configuration
                </AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                {selectedElement ? (
                  <div className="p-2">
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">
                        Selected: {selectedElement.name || selectedElement.type}
                      </p>
                      <p className="text-xs text-blue-700">
                        Double-click element to edit content
                      </p>
                    </div>
                    <Configurations />
                  </div>
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="text-muted-foreground mb-2">
                      <Square className="h-12 w-12 mx-auto opacity-50" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select an element to configure its properties
                    </p>
                  </div>
                )}
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
        </Accordion>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              onClick={() => {
                toggleChat();
                toggleSidebar();
              }}
              className="w-full font-bold"
              variant="outline"
            >
              AI Assistant
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              onClick={() => {
                if (params.slug) visitProjectSubdomain(params.slug.toString());
              }}
              className="w-full font-bold"
              variant="default"
            >
              View Live Site
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default LayoutSideBar;
