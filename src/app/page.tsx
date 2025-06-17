"use client";

import * as React from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Section } from "@/components/layout/section";
import { SapOne } from "@/components/sap-one";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset />

      <Section className="py-6">
        <SapOne />
      </Section>
    </SidebarProvider>
  );
}
