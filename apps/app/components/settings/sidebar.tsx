"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { ArrowLeft, Building, User, Users } from "lucide-react";
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
        icon: Building,
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
        <Button
          asChild
          className="w-full justify-start rounded-full bg-transparent"
          variant="ghost"
        >
          <Link href="/dashboard">
            <ArrowLeft />
            <span>Back to app</span>
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
