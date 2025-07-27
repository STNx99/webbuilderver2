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
} from "@/components/ui/sidebar";
import React from "react";
import LayoutSideBarElements from "./LayoutSideBarElements";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Configurations from "./configurations/Configurations";
// import Chat from "@/components/ChatModel";

function LayoutSideBar() {
  const params = useParams();
  const visitProjectSubdomain = (projectId: string) => {
    // const subdomainUrl = getProjectSubdomainUrl(projectId);
    // window.open(subdomainUrl, "_blank");
  };

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
                  <LayoutSideBarElements />
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
                <SidebarGroupContent>
                  <Configurations />
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
        </Accordion>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full">
                  Export code
                </Button>
              </DrawerTrigger>
              <DrawerPortal>
                <DrawerContent className="h-full">
                  <DrawerHeader>
                    <DrawerTitle>Generate Code</DrawerTitle>
                    <DrawerDescription>
                      Generate code from your project elements in different
                      formats
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 py-2 flex-1 overflow-hidden"></div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </DrawerPortal>
            </Drawer>
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
