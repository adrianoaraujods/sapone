import type { Dispatch } from "react";

export type System = {
  test: string;
};

export type SystemUpdater = Dispatch<React.SetStateAction<System>>;

export type SystemComponent<T = unknown> = {
  system: System;
  update: SystemUpdater;
} & T;

export const initialSystem: System = {
  test: "asd",
};
