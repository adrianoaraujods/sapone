import type { Dispatch } from "react";

export const CONTROL_MASKS = {
  Cp: 0b100000000000,
  Ep: 0b010000000000,
  Lm: 0b001000000000,
  CE: 0b000100000000,
  Li: 0b000010000000,
  Ei: 0b000001000000,
  La: 0b000000100000,
  Ea: 0b000000010000,
  Su: 0b000000001000,
  Eu: 0b000000000100,
  Lb: 0b000000000010,
  Lo: 0b000000000001,
  Hlt: 0,
} as const;

export type ControlSignals = { [sc in keyof typeof CONTROL_MASKS]: boolean };

export const OPERATIONS = {
  NOP: 0x0,
  LDA: 0x1,
  ADD: 0x2,
  SUB: 0x3,
  // ...
  OUT: 0xe,
  HLT: 0xf,
} as const;

export type Operation = keyof typeof OPERATIONS;

export type TState = 1 | 2 | 3 | 4 | 5 | 6;

export type RAM = number[];

export type SystemFlag = {
  carry?: boolean;
  zero?: boolean;
};

export type System = {
  ram: RAM;
  controlWord: number;
  clock: boolean;
  clear: boolean;
  running: boolean;
  flags: SystemFlag;
  tState: TState;

  // components
  programCounter: number;
  memoryAddressRegister: number;
  iRegister: number;
  accumulator: number;
  bRegister: number;
  output: number;
  unit: number;
  bus: number;
};

export type SystemUpdater = Dispatch<React.SetStateAction<System>>;

export type SystemComponent = {
  system: System;
  update: SystemUpdater;
};

export const initialSystem: System = {
  ram: Array(16).fill(0),
  controlWord: CONTROL_MASKS.Ep | CONTROL_MASKS.Lm,
  clock: false,
  clear: false,
  running: false,
  flags: {},
  tState: 1,

  // components
  programCounter: 0,
  memoryAddressRegister: 0,
  iRegister: 0,
  accumulator: 0,
  bRegister: 0,
  output: 0,
  unit: 0,
  bus: 0,
};

export function getControlSignals(controlWord: number): ControlSignals {
  return {
    Cp: !!(controlWord & CONTROL_MASKS.Cp),
    Ep: !!(controlWord & CONTROL_MASKS.Ep),
    Lm: !!(controlWord & CONTROL_MASKS.Lm),
    CE: !!(controlWord & CONTROL_MASKS.CE),
    Li: !!(controlWord & CONTROL_MASKS.Li),
    Ei: !!(controlWord & CONTROL_MASKS.Ei),
    La: !!(controlWord & CONTROL_MASKS.La),
    Ea: !!(controlWord & CONTROL_MASKS.Ea),
    Su: !!(controlWord & CONTROL_MASKS.Su),
    Eu: !!(controlWord & CONTROL_MASKS.Eu),
    Lb: !!(controlWord & CONTROL_MASKS.Lb),
    Lo: !!(controlWord & CONTROL_MASKS.Lo),
    Hlt: controlWord === 0,
  };
}

export function isBitSet(number: number, index: number) {
  return (number & (1 << index)) !== 0;
}
