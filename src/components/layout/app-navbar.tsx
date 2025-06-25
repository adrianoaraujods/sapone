"use client";

import * as React from "react";
import Link from "next/link";

import { GITHUB_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/icon/github-icon";
import { ControlPanel } from "@/components/layout/control-panel";
import { Section } from "@/components/layout/section";
import { Logo } from "@/components/logo";
import { ThemesDropdown } from "@/components/themes-dropdown";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SidebarIcon } from "lucide-react";

export function AppNavbar({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-50 flex h-[var(--navbar-height)] w-full items-center border-b",
        className
      )}
      data-slot="app-navbar"
      {...props}
    >
      <Section className="flex w-full items-center justify-between gap-2 py-0 pr-4">
        <Logo />

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" asChild>
            <Link href={GITHUB_URL} target="_blank">
              <GithubIcon />

              <span className="sr-only">Repositório Github</span>
            </Link>
          </Button>

          <ThemesDropdown />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="">
                <SidebarIcon />
              </Button>
            </SheetTrigger>

            <SheetContent className="min-w-md" side="left">
              <SheetHeader>
                <SheetTitle>Painel de Controle</SheetTitle>
              </SheetHeader>

              <div className="px-4">
                <ControlPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Section>
    </header>
  );
}
