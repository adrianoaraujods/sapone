import type { SystemComponent } from "@/lib/system";

// to pass more params, pass a generic with the types in the SystemComponent<{...}>
export function example({ system, update }: SystemComponent) {}
