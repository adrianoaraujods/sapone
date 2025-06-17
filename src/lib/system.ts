import type { Dispatch } from "react";

export type System = {
  counter: {
    // output: number;
    load: boolean; // Cp
    enabled: boolean; // Ep
  };
  accumulator: {
    // input: number;
    // output: number;
    load: boolean; // La
    enabled: boolean; // Ea
  };
  input: {
    load: boolean; // Lm
  };
  unit: {
    subtraction: boolean; // Su
    enable: boolean; // Eu
  };
  memory: {
    // input: number;
    // address: number;
    // output: number;
    enabled: boolean; // CE
  };
  register: {
    // input: number;
    // output: number;
    load: boolean; // Lb
  };
  instructions: {
    load: boolean; // Li
    enabled: boolean; // Ei
  };
  output: {
    load: boolean; // Lo
  };

  clock: boolean; // CLK
  clear: boolean; // CLR
};

export type SystemUpdater = Dispatch<React.SetStateAction<System>>;

export type SystemComponent = {
  system: System;
  update: SystemUpdater;
};

export const initialSystem: System = {
  counter: {
    load: false,
    enabled: true,
  },
  accumulator: {
    load: false,
    enabled: false,
  },
  input: {
    load: true,
  },
  unit: {
    subtraction: false,
    enable: false,
  },
  memory: {
    enabled: true,
  },
  register: {
    load: false,
  },
  instructions: {
    load: false,
    enabled: false,
  },
  output: {
    load: false,
  },

  clock: false,
  clear: false,
};
