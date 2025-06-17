"use client";

import * as React from "react";
import Link from "next/link";

import { GITHUB_URL } from "@/lib/config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";

import { GithubIcon } from "../icon/github-icon";
import { ThemesDropdown } from "../themes-dropdown";
import { Button } from "../ui/button";

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
