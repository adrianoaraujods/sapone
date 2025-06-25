import { CONTROL_MASKS } from "@/types/sap-one";

import type { ControlSignals, Flags, TState } from "@/types/sap-one";
import type { Dispatch } from "react";

export type System = {
  ram: number[];
  controlWord: number;
  clock: boolean;
  clear: boolean;
  running: boolean;
  halted: boolean;
  flags: Flags;
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
  halted: false,
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
