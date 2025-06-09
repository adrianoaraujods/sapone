import * as React from "react";

import type { System, SystemUpdater } from "@/lib/system";

export const SystemContext = React.createContext<{
  system: System;
  setSystem: SystemUpdater;
} | null>(null);

export function useSystem() {
  const system = React.useContext(SystemContext);

  if (!system) throw "useSystem must be used within a SystemProvider";

  return system;
}
