export const OPERATIONS = {
  // NOP: 0x0,
  LDA: 0x0,
  ADD: 0x1,
  SUB: 0x2,
  // ...
  // SAMPLE OPCODES
  STO: 0x3,
  JMP: 0x4,
  // ...
  OUT: 0xe,
  HLT: 0xf,
};

export type Operation = keyof typeof OPERATIONS;

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

export type TState = 1 | 2 | 3 | 4 | 5 | 6;

export type Flags = {
  carry?: boolean;
  zero?: boolean;
};

export type MemoryValue = { address: number; data: number };
