"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { ArrowLeft, Building2, User, Users } from "lucide-react";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";

const navMain = [
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: "/settings/account/profile",
        icon: User,
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        title: "General",
        url: "/settings/organization/general",
        icon: Building2,
      },
      {
        title: "Members",
        url: "/settings/organization/members",
        icon: Users,
      },
    ],
  },
];

export function SettingsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to app">
              <Link href="/dashboard">
                <ArrowLeft />
                <span>Back to app</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
