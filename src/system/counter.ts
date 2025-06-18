import type { SystemComponent } from "@/lib/system";

export function counter({ system, update }: SystemComponent) {
  // `system` is the current state

  // example of update
  update((prev) => {
    const newSystem = { ...prev }; // copy the previous values

    newSystem.ram[15] = 0xff; // updates a value

    return newSystem; // return the updated system
  });

  // if the `system` is accessed after the update, it will have the new values
}
