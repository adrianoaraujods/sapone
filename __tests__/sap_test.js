import "@/tests/util/match-media.mock";

import { initSystem, runProgram } from "@/system/sap.js";

// TODO: split into more tests
// use update that he wanted
// assign memory dynamically
// test failures and under/overflow

describe("Testing SAP", () => {
  it("Simple program till halt", () => {
    const system = initSystem();

    system.memory[0] = 0x0f;
    system.memory[1] = 0x1e;
    system.memory[2] = 0xe0;

    system.memory[3] = 0x1d;
    system.memory[4] = 0xe0;

    system.memory[5] = 0x2f;

    system.memory[6] = 0xf0;

    system.memory[13] = 26;
    system.memory[14] = 3;
    system.memory[15] = 5;

    const output = runProgram(system);

    expect(output).toEqual(
      expect.objectContaining({
        accumulator: 29,
        outputRegister: 34,
        halted: true,
        lastInstruction: "HLT",
      })
    );
  });
});

describe("Testing SAP 2", () => {
  it("Aula de AC :)", () => {
    const system = initSystem();

    system.memory[0] = 0x0f;
    system.memory[1] = 0x1e;
    system.memory[2] = 0xe0;

    system.memory[3] = 0x1d;
    system.memory[4] = 0xe0;

    system.memory[5] = 0x2c;
    system.memory[6] = 0xe0;

    system.memory[7] = 0xf0;

    system.memory[15] = 48;
    system.memory[14] = 36;
    system.memory[13] = 125;
    system.memory[12] = 50;

    const output = runProgram(system);

    expect(output).toEqual(
      expect.objectContaining({
        accumulator: 0x9f,
        outputRegister: 159,
        halted: true,
        lastInstruction: "HLT",
      })
    );
  });
});
