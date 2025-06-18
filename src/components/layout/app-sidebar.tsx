"use client";

import * as React from "react";
import Link from "next/link";

import { GITHUB_URL } from "@/lib/config";
import { GithubIcon } from "@/components/icon/github-icon";
import { ThemesDropdown } from "@/components/themes-dropdown";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Button variant="ghost" size="icon" onClick={() => toggleSidebar()}>
          {open ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
        </Button>
      </SidebarHeader>

      <SidebarContent></SidebarContent>

      <SidebarSeparator />
      <SidebarSeparator />
      <SidebarSeparator />

      <SidebarFooter
        className="flex data-[open=true]:flex-row"
        data-open={open}
      >
        <ThemesDropdown />

        <Button variant="ghost" size="icon" asChild>
          <Link href={GITHUB_URL} target="_blank">
            <GithubIcon />
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
