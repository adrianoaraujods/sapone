// TODO: understand the "update"
// TODO: read a bit more of what we need to do.

export const INSTRUCTIONS = {
  LDA: 0x0, // 0000 - Load Accumulator
  ADD: 0x1, // 0001 - Add to Accumulator
  SUB: 0x2, // 0010 - Subtract from Accumulator
  OUT: 0xe, // 1110 - Output Accumulator
  HLT: 0xf, // 1111 - Halt
};

// full state?
export function initSystem() {
  return {
    accumulator: 0, // 8-bit accumulator (0-255)
    programCounter: 0, // 4-bit program counter (0-15)
    memory: new Array(16).fill(0), // 16 memory locations
    outputRegister: 0, // Output display
    halted: false, // System halt flag
    clockCycle: 0, // Current clock cycle
    lastInstruction: null, // For debugging
  };
}

// upper 4 bits
export function getOpcode(instruction) {
  return (instruction & 0xf0) >> 4;
}

// lower 4 bits
export function getAddress(instruction) {
  return instruction & 0x0f;
}

export function LDA(system, address) {
  console.log(`   LDA: Loading from address ${address}`);

  if (address >= system.memory.length) {
    throw new Error(`Invalid address: ${address}`);
  }

  const value = system.memory[address];
  console.log(`   Memory[${address}] = ${value} (0x${value.toString(16)})`);

  return {
    ...system,
    accumulator: value,
    programCounter: (system.programCounter + 1) % 16,
    clockCycle: system.clockCycle + 1,
    lastInstruction: `LDA ${address}`,
  };
}

export function ADD(system, address) {
  console.log(`   ADD: Adding from address ${address}`);

  if (address >= system.memory.length) {
    throw new Error(`Invalid address: ${address}`);
  }

  const value = system.memory[address];
  // TODO: overflow/underflow checks
  // currently wraps to 8bit
  const result = (system.accumulator + value) & 0xff;

  console.log(`   ${system.accumulator} + ${value} = ${result}`);

  return {
    ...system,
    accumulator: result,
    programCounter: (system.programCounter + 1) % 16,
    clockCycle: system.clockCycle + 1,
    lastInstruction: `ADD ${address}`,
  };
}

export function SUB(system, address) {
  console.log(`   SUB: Subtracting from address ${address}`);

  if (address >= system.memory.length) {
    throw new Error(`Invalid address: ${address}`);
  }

  const value = system.memory[address];
  // TODO: overflow/underflow checks
  // currently wraps to 8bit
  const result = (system.accumulator - value) & 0xff;

  console.log(`   ${system.accumulator} - ${value} = ${result}`);

  return {
    ...system,
    accumulator: result,
    programCounter: (system.programCounter + 1) % 16,
    clockCycle: system.clockCycle + 1,
    lastInstruction: `SUB ${address}`,
  };
}

export function OUT(system) {
  console.log(`   OUT: Outputting accumulator value ${system.accumulator}`);

  return {
    ...system,
    outputRegister: system.accumulator,
    programCounter: (system.programCounter + 1) % 16,
    clockCycle: system.clockCycle + 1,
    lastInstruction: `OUT`,
  };
}

// HLT - Halt
export function HALT(system) {
  console.log(`   HLT: System halted`);

  return {
    ...system,
    halted: true,
    clockCycle: system.clockCycle + 1,
    lastInstruction: `HLT`,
  };
}

export function executeInstruction(system) {
  if (system.halted) {
    console.log("System is halted");
    return system;
  }

  const instruction = system.memory[system.programCounter];
  const opcode = getOpcode(instruction);
  const address = getAddress(instruction);

  console.log(`\nExecuting instruction at PC=${system.programCounter}`);
  console.log(
    `   Instruction: 0x${instruction
      .toString(16)
      .padStart(2, "0")} (opcode=${opcode}, address=${address})`
  );

  switch (opcode) {
    case INSTRUCTIONS.LDA:
      return LDA(system, address);
    case INSTRUCTIONS.ADD:
      return ADD(system, address);
    case INSTRUCTIONS.SUB:
      return SUB(system, address);
    case INSTRUCTIONS.OUT:
      return OUT(system);
    case INSTRUCTIONS.HLT:
      return HALT(system);
    default:
      throw new Error(`Unknown instruction: 0x${opcode.toString(16)}`);
  }
}

// Run program until halt
export function runProgram(system) {
  console.log("Initial state:", system);

  let currentSystem = { ...system };
  let steps = 0;
  // TOOD: have this be a runtime value, so we can find out via memory
  // what can be or not be run
  const maxSteps = 20;

  while (!currentSystem.halted && steps < maxSteps) {
    currentSystem = executeInstruction(currentSystem);
    steps++;

    console.log(
      `   State: ACC=${currentSystem.accumulator}, PC=${currentSystem.programCounter}, OUT=${currentSystem.outputRegister}`
    );
  }

  if (steps >= maxSteps) {
    console.log("Program stopped: Maximum steps reached");
  }

  console.log("Final state:", currentSystem);

  return currentSystem;
}
