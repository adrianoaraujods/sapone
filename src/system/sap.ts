import {
  getControlSignals,
  initialSystem,
  SystemComponent,
} from "@/lib/system";
import {
  CONTROL_MASKS,
  MemoryValue,
  OPERATIONS,
  TState,
} from "@/types/sap-one";

const FETCH_CYCLE = [
  CONTROL_MASKS.Ep | CONTROL_MASKS.Lm, // T1: PC out -> MAR in
  0, //                                   T2: PC increment (handled by logic)
  CONTROL_MASKS.CE | CONTROL_MASKS.Li, // T3: RAM out -> IR in
];

// NEW: OPCODES need to be defined in here first.
const EXECUTION_CYCLE = {
  // EXECUTION CYCLES (T4-T6)
  // T4: IR->MAR, T5: RAM->ACC, T6: NOP
  [OPERATIONS.LDA]: [
    CONTROL_MASKS.Ei | CONTROL_MASKS.Lm,
    CONTROL_MASKS.CE | CONTROL_MASKS.La,
    0,
  ],

  // T4: IR->MAR, T5: RAM->B, T6: ALU->A
  [OPERATIONS.ADD]: [
    CONTROL_MASKS.Ei | CONTROL_MASKS.Lm,
    CONTROL_MASKS.CE | CONTROL_MASKS.Lb,
    CONTROL_MASKS.Eu | CONTROL_MASKS.La,
  ],

  // T4: IR->MAR, T5: RAM->B, T6: ALU->A (sub)
  [OPERATIONS.SUB]: [
    CONTROL_MASKS.Ei | CONTROL_MASKS.Lm,
    CONTROL_MASKS.CE | CONTROL_MASKS.Lb,
    CONTROL_MASKS.Su | CONTROL_MASKS.Eu | CONTROL_MASKS.La,
  ],

  // NEW: SAMPLE OPCODES
  // T4: IR(addr)->MAR, T5: A->RAM, T6: NOP
  [OPERATIONS.STO]: [CONTROL_MASKS.Ei | CONTROL_MASKS.Lm, CONTROL_MASKS.Ea, 0],

  // T4: IR(addr)->PC, T5: NOP, T6: NOP
  [OPERATIONS.JMP]: [CONTROL_MASKS.Ei | CONTROL_MASKS.Cp, 0, 0],

  // T4: IR->A, T5: NOP, T6: NOP
  // [OPERATIONS.LDI]: [CONTROL_MASKS.Ei | CONTROL_MASKS.La, 0, 0],

  // T4: A->OUT, T5: NOP, T6: NOP
  [OPERATIONS.OUT]: [CONTROL_MASKS.Ea | CONTROL_MASKS.Lo, 0, 0],

  // HLT is handled by the main logic
  [OPERATIONS.HLT]: [0, 0, 0],
};

// TODO: MEM reset and Clean Reset
export function systemReset({ update }: SystemComponent) {
  // TODO: maybe i should rethink about this one, we need a way to store the initial memory state
  // right before any execution, so we can clear to that state instead. otherwise when we create
  // STORE functions, this will change the initial state in unpredictable ways.
  update((prev) => {
    const newSystem = { ...prev };
    // Global
    newSystem.controlWord = CONTROL_MASKS.Ep | CONTROL_MASKS.Lm;
    newSystem.clock = false;
    newSystem.clear = false;
    newSystem.running = false;
    newSystem.halted = false;
    newSystem.flags = {};
    newSystem.tState = 1;

    // Components
    newSystem.programCounter = 0;
    newSystem.memoryAddressRegister = 0;
    newSystem.iRegister = 0;
    newSystem.accumulator = 0;
    newSystem.bRegister = 0;
    newSystem.output = 0;
    newSystem.unit = 0;
    newSystem.bus = 0;

    return newSystem;
  });
}

export function setMemorySingle(
  { update }: SystemComponent,
  address: number,
  data: number
) {
  update((prev) => {
    const newSystem = { ...prev };
    newSystem.ram[address] = data;
    return newSystem;
  });
}

export function setMemory({
  program,
  system,
  update,
}: SystemComponent & { program: MemoryValue[] }) {
  // IMPORTANT: this will always reset the program if we manually change the memory.
  // i also forcibly wrap over 0-15 for address and 0-255 for data.
  systemReset({ system, update });
  update((prev) => {
    const newSystem = { ...prev };
    const newRam = Array(16).fill(0);
    program.forEach((line) => {
      if (line.address >= 0 && line.address < 16) {
        newRam[line.address & 0xf] = line.data & 0xff;
      }
    });
    newSystem.ram = newRam;

    return newSystem;
  });
}

// DECODE IR
function getOpcode(instructionRegister: number): number {
  // get 4 MSB
  return instructionRegister >> 4;
}
function getOperand(instructionRegister: number): number {
  // get 4 LSB
  return instructionRegister & 0x0f;
}

export function runClock({ system, update }: SystemComponent) {
  if (system.halted) {
    update((prev) => {
      const newSystem = { ...prev };
      newSystem.running = false;
      return newSystem;
    });
    return;
  }

  const isRisingEdge = !system.clock;

  if (isRisingEdge) {
    handleRisingEdge({ system, update });
  } else {
    handleFallingEdge({ system, update });
  }

  update((prev) => {
    const newSystem = { ...prev };
    newSystem.clock = isRisingEdge;
    return newSystem;
  });
}

function handleRisingEdge({ system, update }: SystemComponent) {
  update((prev) => {
    const newSystem = { ...prev };
    const signals = getControlSignals(newSystem.controlWord);

    // get information from bus to destination based on flag.
    if (signals.Lm) newSystem.memoryAddressRegister = newSystem.bus;
    if (signals.Li) newSystem.iRegister = newSystem.bus;
    if (signals.La) newSystem.accumulator = newSystem.bus;
    if (signals.Lb) newSystem.bRegister = newSystem.bus;
    if (signals.Lo) newSystem.output = newSystem.bus;
    if (signals.Cp) newSystem.programCounter = newSystem.bus;

    // NEW: OPCODES MIGHT NEED LOGIC HERE.
    // Handle RAM write (RI is implicitly the inverse of CE for bus operations)
    // need to implement a function for this, but the skeleton is this.
    if (
      getOpcode(newSystem.iRegister) === OPERATIONS.STO &&
      signals.Ea &&
      newSystem.tState == 5
    ) {
      newSystem.ram[newSystem.memoryAddressRegister] = newSystem.bus;
    }

    // Program counter increments during T2
    // force 0->15
    if (newSystem.tState === 2) {
      newSystem.programCounter = (newSystem.programCounter + 1) & 0xf;
    }

    return newSystem;
  });
}

function handleFallingEdge({ system, update }: SystemComponent) {
  update((prev) => {
    const newSystem = { ...prev };

    // move clock cycle
    newSystem.tState = ((newSystem.tState % 6) + 1) as TState;

    const opcode = getOpcode(newSystem.iRegister);

    let nextControlWord = 0;

    if (newSystem.tState <= 3) {
      // Fetch cycle
      nextControlWord = FETCH_CYCLE[newSystem.tState - 1];
    } else {
      // Execute cycle
      const instructionWord = EXECUTION_CYCLE[opcode];
      if (instructionWord) {
        nextControlWord = instructionWord[newSystem.tState - 4];
      }
    }

    newSystem.controlWord = nextControlWord || 0;
    const signals = getControlSignals(newSystem.controlWord);

    // Calculate ALU result
    const aluResult = signals.Su
      ? newSystem.accumulator - newSystem.bRegister
      : newSystem.accumulator + newSystem.bRegister;

    // Set bus accordingly to what is feeding information in current cycle
    let busValue = 0;
    if (signals.Ep) busValue = newSystem.programCounter;
    if (signals.CE) busValue = newSystem.ram[newSystem.memoryAddressRegister];
    if (signals.Ei) busValue = getOperand(newSystem.iRegister);
    if (signals.Ea) busValue = newSystem.accumulator;
    if (signals.Eu) busValue = aluResult & 0xff;

    newSystem.bus = busValue;

    // NEW: OPCODES MIGHT NEED LOGIC HERE.

    // Update ALU unit and flags if needed
    if (signals.Eu) {
      newSystem.unit = aluResult & 0xff;
      newSystem.flags.zero = (aluResult & 0xff) === 0;
      newSystem.flags.carry = aluResult > 255 || aluResult < 0;
    }

    // Halt
    if (opcode === OPERATIONS.HLT && newSystem.tState > 3) {
      newSystem.running = false;
      newSystem.halted = true;
    }

    return newSystem;
  });
}

export function runProgramAsync(component: SystemComponent): number {
  console.log(component.system);
  const { update } = component;
  let currentSystem = component.system;

  update((prev) => {
    const newSystem = {
      ...prev,
      running: true,
      halted: false,
    };

    // WHY TF I NEED THIS >_>
    // Update our local copy
    currentSystem = newSystem;
    return newSystem;
  });

  let steps = 0;
  // TODO: remove and let infinite
  const maxSteps = 1000;

  // force check against the "Current"
  while (steps < maxSteps) {
    if (!currentSystem.running || currentSystem.halted) {
      break;
    }

    // run clock with CURRENT
    runClock({ system: currentSystem, update });

    // Get the new state for the next iteration
    // didnt work without, even though i dont understand this :)
    update((prev) => {
      currentSystem = prev;
      return prev;
    });

    steps++;
  }

  if (steps >= maxSteps) {
    console.warn("Execution stopped: Maximum steps reached");
    update((prev) => ({
      ...prev,
      running: false,
    }));
  }

  return steps;
}

// IMPORTANT: double check this ltr
export function runProgramWithClock({
  clockSpeed,
  update,
}: SystemComponent & { clockSpeed: number }): { stop: () => void } {
  if (clockSpeed <= 0) {
    console.error("Clock speed must be a positive number.");
    return { stop: () => {} };
  }

  // runClock => Rising OR Falling.
  // means we need 2 for a single cycle.
  const halfCycleInterval = clockSpeed * 2;

  let intervalId: NodeJS.Timeout | null = null;

  // Set the system to a running state before starting the clock.
  update((prev) => ({
    ...prev,
    running: true,
    halted: false,
  }));

  // Allows early stop
  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    // update running flag
    update((prev) => ({
      ...prev,
      running: false,
    }));
    console.log("Clock stopped.");
  };

  // Clock interval
  intervalId = setInterval(() => {
    let systemToProcess = initialSystem;

    // Get the latest system state.
    update((prev) => {
      systemToProcess = prev;
      return prev;
    });

    // force stop
    if (!systemToProcess.running || systemToProcess.halted) {
      stop();
      return;
    }

    // Execute a clock edge
    runClock({ system: systemToProcess, update });
  }, halfCycleInterval);

  return { stop };
}
