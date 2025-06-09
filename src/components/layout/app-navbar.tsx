"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GITHUB_URL, NAVIGATION_LINKS } from "@/lib/config";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/icon/github-icon";
import { Section } from "@/components/layout/section";
import { ThemesDropdown } from "@/components/themes-dropdown";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";

import { CircuitBoardIcon } from "lucide-react";

export function AppNavbar({
  className,
  ...props
}: React.ComponentProps<"header">) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-50 flex w-full items-center border-b",
        className
      )}
      data-slot="app-navbar"
      {...props}
    >
      <Section className="flex h-[var(--navbar-height)] w-full items-center justify-between gap-2 py-0 pr-4">
        <div className="flex items-center gap-8">
          <Link className="flex items-center justify-between gap-2" href="/">
            <CircuitBoardIcon />

            <Text>Sapone</Text>
          </Link>

          <nav className="max-md:hidden">
            <ul className="flex gap-4">
              {NAVIGATION_LINKS.map(({ title, href }, i) => (
                <li key={i}>
                  <Link
                    className="text-foreground/75 hover:text-foreground/90 data-[active=true]:text-foreground"
                    data-active={href === pathname}
                    href={href}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" asChild>
            <Link href={GITHUB_URL} target="_blank">
              <GithubIcon className="size-6" />

              <span className="sr-only">Repositório Github</span>
            </Link>
          </Button>

          <ThemesDropdown />
        </div>
      </Section>
    </header>
  );
}
