"use client";

import * as React from "react";
import Link from "next/link";

import { GITHUB_URL } from "@/lib/config";
import { GithubIcon } from "@/components/icon/github-icon";
import { AppNavbar } from "@/components/layout/app-navbar";
import { ControlPanel } from "@/components/layout/control-panel";
import { SapOne } from "@/components/layout/sap-one";
import { Section } from "@/components/layout/section";
import { Logo } from "@/components/logo";
import { ThemesDropdown } from "@/components/themes-dropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <>
      <AppNavbar className="xl:hidden" />

      <Section className="relative grid gap-16 py-6 xl:grid-cols-[1fr_auto]">
        <Card className="max-xl:hidden">
          <CardHeader className="flex justify-between gap-4">
            <Logo />

            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" asChild>
                <Link href={GITHUB_URL} target="_blank">
                  <GithubIcon />

                  <span className="sr-only">Repositório Github</span>
                </Link>
              </Button>

              <ThemesDropdown />
            </div>
          </CardHeader>

          <Separator />

          <CardContent>
            <ControlPanel />
          </CardContent>
        </Card>

        <SapOne />
      </Section>
    </>
  );
}
