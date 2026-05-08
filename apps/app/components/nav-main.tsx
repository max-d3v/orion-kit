"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

type NavGroup = {
  title?: string;
  url?: string;
  icon?: LucideIcon;
  items?: NavItem[];
};

export function NavMain({ items }: { items: NavGroup[] | NavItem[] }) {
  const pathname = usePathname();

  const groups: NavGroup[] = items.every(
    (item) => "items" in item && Array.isArray(item.items)
  )
    ? (items as NavGroup[])
    : [{ items: items as NavItem[] }];

  return (
    <>
      {groups.map((group, groupIndex) => (
        <SidebarGroup key={group.title ?? `group-${groupIndex}`}>
          {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items?.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        {Icon && <Icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
