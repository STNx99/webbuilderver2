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
import elementHolders from "@/constants/elements";
import { Settings } from "lucide-react";
import Link from "next/link";
import ComponentHolder from "./ComponentHolder";

export function EditorSideBar() {
    
  return (
    <Sidebar side="left">
      <SidebarContent>
        <Accordion type="multiple" className="w-full" defaultValue={["components", "imageupload"]}>
          <AccordionItem value="components">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger>
                  Components
                </AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                <SidebarGroupContent>
                  <ul className="space-y-2 w-full">
                    {elementHolders.map((element) => (
                      <li key={element.type} className="w-full">
                        <ComponentHolder
                          icon={element.icon}
                          type={element.type}
                        />
                      </li>
                    ))}
                  </ul>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
          <AccordionItem value="imageupload">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <AccordionTrigger>
                  Image Upload
                </AccordionTrigger>
              </SidebarGroupLabel>
              <AccordionContent>
                <SidebarGroupContent>
                  
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