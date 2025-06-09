"use client";

import * as React from "react";

import { SystemContext } from "@/hooks/use-system";
import { initialSystem } from "@/lib/system";

import type { System } from "@/lib/system";

export default function SystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [system, setSystem] = React.useState<System>(initialSystem);

  return (
    <SystemContext.Provider value={{ system, setSystem }}>
      {children}
    </SystemContext.Provider>
  );
}
