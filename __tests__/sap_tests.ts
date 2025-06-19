import "@/tests/util/match-media.mock";

import { initialSystem, OPERATIONS } from "@/lib/system";
import {
  runClock,
  runProgramAsync,
  runProgramWithClock,
  setMemory,
  setMemorySingle,
  systemAndMemoryReset,
  systemReset,
} from "@/system/sap";

import type { System, SystemComponent } from "@/lib/system.ts";

describe("Testing SAP-1 System", () => {
  let component: {
    system: System;
    update: (updater: any) => void;
  };

  beforeEach(() => {
    // Before each test, create a new object for 'component'.
    component = {
      system: { ...initialSystem, halted: false },
      update: (updater) => {
        if (typeof updater === "function") {
          // THE FIX: This updates the 'system' property on the component object itself.
          component.system = updater(component.system);
        } else {
          component.system = updater;
        }
      },
    };
  });
  describe("Basic System Operations", () => {
    it("should reset system to initial state", () => {
      // Modify system first
      component.system.programCounter = 5;
      component.system.accumulator = 100;
      component.system.running = true;

      systemReset(component);

      expect(component.system).toEqual(
        expect.objectContaining({
          programCounter: 0,
          accumulator: 0,
          running: false,
          halted: false,
          tState: 1,
          bus: 0,
        })
      );
    });

    it("should set memory at specific address", () => {
      setMemorySingle(component, 5, 0x1a);

      expect(component.system.ram[5]).toBe(0x1a);
    });

    it("should load program into memory", () => {
      const program = [
        { address: 0, data: 0x0f }, // LDA 15
        { address: 1, data: 0x1e }, // ADD 14
        { address: 2, data: 0xf0 }, // HLT
        { address: 14, data: 5 }, // Data: 5
        { address: 15, data: 3 }, // Data: 3
      ];

      setMemory(component, program);

      expect(component.system.ram[0]).toBe(0x0f);
      expect(component.system.ram[1]).toBe(0x1e);
      expect(component.system.ram[2]).toBe(0xf0);
      expect(component.system.ram[14]).toBe(5);
      expect(component.system.ram[15]).toBe(3);
    });
  });

  describe("Instruction Execution", () => {
    it("should execute LDA instruction correctly", () => {
      // Program: LDA 15, HLT
      setMemory(component, [
        { address: 0, data: 0x0f }, // LDA 15
        { address: 1, data: 0xf0 }, // HLT
        { address: 15, data: 42 }, // Data: 42
      ]);

      // Execute until we complete LDA instruction (should take 6 clock cycles)
      for (let i = 0; i < 6; i++) {
        runClock(component);
        runClock(component);
      }

      expect(component.system).toEqual(
        expect.objectContaining({
          accumulator: 42,
          programCounter: 1,
          iRegister: 0x0f,
          tState: 1, // Should cycle back to T1
        })
      );
    });

    it("should execute ADD instruction correctly", () => {
      // Program: LDA 14, ADD 15, HLT
      setMemory(component, [
        { address: 0, data: 0x0e }, // LDA 14
        { address: 1, data: 0x1f }, // ADD 15
        { address: 2, data: 0xf0 }, // HLT
        { address: 14, data: 10 }, // Data: 10
        { address: 15, data: 5 }, // Data: 5
      ]);

      // Execute LDA instruction (6 cycles)
      for (let i = 0; i < 6; i++) {
        runClock(component);
        runClock(component);
      }
      expect(component.system.accumulator).toBe(10);

      // Execute ADD instruction (6 cycles)
      for (let i = 0; i < 6; i++) {
        runClock(component);
        runClock(component);
      }

      expect(component.system).toEqual(
        expect.objectContaining({
          accumulator: 15, // 10 + 5
          bRegister: 5,
          unit: 15,
          flags: expect.objectContaining({
            zero: false,
            carry: false,
          }),
        })
      );
    });

    it("should execute SUB instruction correctly", () => {
      // Program: LDA 14, SUB 15, HLT
      setMemory(component, [
        { address: 0, data: 0x0e }, // LDA 14
        { address: 1, data: 0x2f }, // SUB 15
        { address: 2, data: 0xf0 }, // HLT
        { address: 14, data: 10 }, // Data: 10
        { address: 15, data: 3 }, // Data: 3
      ]);

      // Execute LDA instruction
      for (let i = 0; i < 6; i++) {
        runClock(component);
        runClock(component);
      }

      // Execute SUB instruction
      for (let i = 0; i < 6; i++) {
        runClock(component);
        runClock(component);
      }

      expect(component.system).toEqual(
        expect.objectContaining({
          accumulator: 7, // 10 - 3
          bRegister: 3,
          unit: 7,
          flags: expect.objectContaining({
            zero: false,
            carry: false,
          }),
        })
      );
    });

    it("should execute OUT instruction correctly", () => {
      // Program: LDA 15, OUT, HLT
      setMemory(component, [
        { address: 0, data: 0x1f }, // LDA 15
        { address: 1, data: 0xe0 }, // OUT
        { address: 2, data: 0xf0 }, // HLT
        { address: 15, data: 99 }, // Data: 99
      ]);

      // Execute LDA instruction
      for (let i = 0; i < 6; i++) {
        runClock(component);
        runClock(component);
      }

      // Execute OUT instruction (4 cycles should be enough)
      for (let i = 0; i < 4; i++) {
        runClock(component);
        runClock(component);
      }

      expect(component.system).toEqual(
        expect.objectContaining({
          accumulator: 99,
          output: 99,
        })
      );
    });

    it("should execute STA instruction correctly", () => {
      // Program: LDA 15, STA 14, HLT
      // Goal: Load 99 from address 15, then store it in address 14.
      setMemory(component, [
        { address: 0, data: (OPERATIONS.LDA << 4) | 15 }, // LDA 15
        { address: 1, data: (OPERATIONS.STO << 4) | 14 }, // STO 14
        { address: 2, data: (OPERATIONS.HLT << 4) | 0 }, // HLT
        { address: 14, data: 0 }, // Initial value at target address
        { address: 15, data: 99 }, // Value to load
      ]);

      // Make sure the initial state is correct
      expect(component.system.ram[14]).toBe(0);

      // Run the program until it halts
      runProgramAsync(component);

      // Check the final state
      expect(component.system.accumulator).toBe(99);
      expect(component.system.ram[14]).toBe(99);
      expect(component.system.halted).toBe(true);
    });

    it("should execute JMP instruction correctly", () => {
      // Program: JMP 4, (bad instruction), HLT, (bad), LDA 15, HLT
      // Goal: Jump over the instructions at addresses 1, 2, and 3.
      setMemory(component, [
        { address: 0, data: (OPERATIONS.JMP << 4) | 4 }, // JMP to 4
        { address: 1, data: (OPERATIONS.LDA << 4) | 13 }, // This should be skipped
        { address: 2, data: (OPERATIONS.HLT << 4) | 0 }, // This should be skipped
        { address: 3, data: 0xff }, // This should be skipped
        { address: 4, data: (OPERATIONS.LDA << 4) | 15 }, // Arrive here
        { address: 5, data: (OPERATIONS.HLT << 4) | 0 }, // Halt here
        { address: 15, data: 42 }, // The value we expect
      ]);

      runProgramAsync(component);

      // The accumulator should have the value from the instruction after the jump.
      expect(component.system.accumulator).toBe(42);
      expect(component.system.halted).toBe(true);
      // The PC should be at 6 (it executed instructions at 4 and 5).
      expect(component.system.programCounter).toBe(6);
    });
  });

  describe("Complete Program Execution", () => {
    it("should execute simple program until halt", () => {
      // Program: LDA 14, ADD 15, OUT, HLT
      const program = [
        { address: 0, data: (OPERATIONS.LDA << 4) | 14 }, // LDA 14
        { address: 1, data: (OPERATIONS.ADD << 4) | 15 }, // ADD 15
        { address: 2, data: (OPERATIONS.OUT << 4) | 0 }, // OUT
        { address: 3, data: (OPERATIONS.HLT << 4) | 0 }, // HLT
        { address: 14, data: 25 }, // Data: 25
        { address: 15, data: 17 }, // Data: 17
      ];

      setMemory(component, program);
      const steps = runProgramAsync(component);

      expect(component.system).toEqual(
        expect.objectContaining({
          accumulator: 42, // 25 + 17
          output: 42,
          halted: true,
          running: false,
          programCounter: 4, // Should have incremented past HLT
        })
      );

      expect(steps).toBeGreaterThan(0);
      expect(steps).toBeLessThan(50); // Reasonable upper bound
    });

    it("should handle zero flag correctly", () => {
      // Program: LDA 14, SUB 15, HLT (where both values are equal)
      setMemory(component, [
        { address: 0, data: 0x0e }, // LDA 14
        { address: 1, data: 0x2f }, // SUB 15
        { address: 2, data: 0xf0 }, // HLT
        { address: 14, data: 5 }, // Data: 5
        { address: 15, data: 5 }, // Data: 5
      ]);

      runProgramAsync(component);

      expect(component.system).toEqual(
        expect.objectContaining({
          accumulator: 0, // 5 - 5
          unit: 0,
          flags: expect.objectContaining({
            zero: true,
            carry: false,
          }),
        })
      );
    });

    it("should handle carry flag on overflow", () => {
      // Program: LDA 14, ADD 15, HLT (where sum > 255)
      setMemory(component, [
        { address: 0, data: 0x0e }, // LDA 14
        { address: 1, data: 0x1f }, // ADD 15
        { address: 2, data: 0xf0 }, // HLT
        { address: 14, data: 200 }, // Data: 200
        { address: 15, data: 100 }, // Data: 100
      ]);

      runProgramAsync(component);

      expect(component.system).toEqual(
        expect.objectContaining({
          accumulator: 44, // (200 + 100) & 0xFF = 300 & 255 = 44
          unit: 44,
          flags: expect.objectContaining({
            zero: false,
            carry: true,
          }),
        })
      );
    });

    it("should handle carry flag on underflow", () => {
      // Program: LDA 14, SUB 15, HLT (where result < 0)
      setMemory(component, [
        { address: 0, data: 0x0e }, // LDA 14
        { address: 1, data: 0x2f }, // SUB 15
        { address: 2, data: 0xf0 }, // HLT
        { address: 14, data: 5 }, // Data: 5
        { address: 15, data: 10 }, // Data: 10
      ]);

      runProgramAsync(component);

      expect(component.system).toEqual(
        expect.objectContaining({
          // For underflow, result should wrap around
          accumulator: 251, // (5 - 10 + 256) & 0xFF = 251
          unit: 251,
          flags: expect.objectContaining({
            zero: false,
            carry: true,
          }),
        })
      );
    });
  });

  function TESTrunProgramWithClock(
    component: SystemComponent,
    clockSpeedHz: number
  ) {
    return new Promise<void>((resolve, reject) => {
      const { stop } = runProgramWithClock(component, clockSpeedHz);

      const pollInterval = setInterval(() => {
        if (component.system.halted) {
          clearInterval(pollInterval);
          resolve();
        }
      }, 1);

      setTimeout(() => {
        clearInterval(pollInterval);
        stop();
        reject(new Error("Test timed out: The program did not halt."));
      }, 5000);
    });
  }

  describe("Asynchronous Program Execution", () => {
    it("should execute simple program at a set speed until halt", async () => {
      jest.useFakeTimers();

      const program = [
        { address: 0, data: (OPERATIONS.LDA << 4) | 14 },
        { address: 1, data: (OPERATIONS.ADD << 4) | 15 },
        { address: 2, data: (OPERATIONS.OUT << 4) | 0 },
        { address: 3, data: (OPERATIONS.HLT << 4) | 0 },
        { address: 14, data: 25 },
        { address: 15, data: 17 },
      ];

      setMemory(component, program);
      // Run at a virtual 100Hz
      const executionPromise = TESTrunProgramWithClock(component, 100);

      jest.runAllTimers();

      await executionPromise;

      expect(component.system).toEqual(
        expect.objectContaining({
          accumulator: 42,
          output: 42,
          halted: true,
          running: false,
          programCounter: 4,
        })
      );

      jest.useRealTimers();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle NOP instruction", () => {
      setMemory(component, [
        { address: 0, data: 0x00 }, // NOP
        { address: 1, data: 0xf0 }, // HLT
      ]);

      const initialState = { ...component.system };

      // Execute NOP (6 cycles)
      for (let i = 0; i < 6; i++) {
        runClock(component);
        runClock(component);
      }

      expect(component.system).toEqual(
        expect.objectContaining({
          programCounter: 1, // Should advance to next instruction
          accumulator: initialState.accumulator, // Shouldn't change
          tState: 1, // Should cycle back to T1
        })
      );
    });

    it("should prevent infinite loops with max steps", () => {
      // Program with no HLT instruction (infinite loop)
      setMemory(component, [
        { address: 0, data: 0x00 }, // NOP
        { address: 1, data: 0x00 }, // NOP
        // No HLT - will loop forever
      ]);

      const steps = runProgramAsync(component);

      expect(steps).toBe(1000); // Should hit max steps limit
      expect(component.system.running).toBe(false); // Should be stopped
    });

    it("should handle memory bounds correctly", () => {
      setMemory(component, [
        { address: 0, data: 0x0f }, // LDA 15 (max address)
        { address: 1, data: 0xf0 }, // HLT
        { address: 15, data: 255 }, // Data at max address
      ]);

      runProgramAsync(component);

      expect(component.system.accumulator).toBe(255);
      expect(component.system.memoryAddressRegister).toBe(1);
    });
  });

  describe("Complex Looping Programs", () => {
    it("should calculate Fibonacci sequence until max steps is reached", () => {
      // --- MEMORY LAYOUT ---
      // RAM[13]: Stores the (n-2) Fibonacci number
      // RAM[14]: Stores the (n-1) Fibonacci number
      // RAM[15]: Stores the current result (n)

      const FIB_N2_ADDR = 13;
      const FIB_N1_ADDR = 14;
      const FIB_RESULT_ADDR = 15;

      const program = [
        // Calculate next Fibonacci number: n = n1 + n2
        { address: 0, data: (OPERATIONS.LDA << 4) | FIB_N1_ADDR }, //     Load n1 into Accumulator
        { address: 1, data: (OPERATIONS.ADD << 4) | FIB_N2_ADDR }, //     Add n2
        { address: 2, data: (OPERATIONS.STO << 4) | FIB_RESULT_ADDR }, // Store the new result in MEM[15]
        { address: 3, data: (OPERATIONS.LDA << 4) | FIB_N1_ADDR }, //     Load n1
        { address: 4, data: (OPERATIONS.STO << 4) | FIB_N2_ADDR }, //     Store it in n2's location
        { address: 5, data: (OPERATIONS.LDA << 4) | FIB_RESULT_ADDR }, // Load the new result
        { address: 6, data: (OPERATIONS.STO << 4) | FIB_N1_ADDR }, //     Store it in n1's location
        { address: 7, data: (OPERATIONS.JMP << 4) | 0 }, //               Jump to address 0
      ];

      const initialData = [
        { address: FIB_N2_ADDR, data: 0 }, // F(0)
        { address: FIB_N1_ADDR, data: 1 }, // F(1)
      ];
      setMemory(component, [...program, ...initialData]);
      expect(component.system.ram[FIB_N1_ADDR]).toBe(1);
      expect(component.system.ram[FIB_N2_ADDR]).toBe(0);

      const steps = runProgramAsync(component);

      // --- ASSERTIONS ---
      expect(steps).toBe(1000);
      expect(component.system.running).toBe(false);
      expect(component.system.halted).toBe(false);

      const final_n2 = component.system.ram[FIB_N2_ADDR];
      const final_n1 = component.system.ram[FIB_N1_ADDR];

      expect(final_n1).toBeGreaterThan(1);
      expect(final_n2).toBeGreaterThan(0);

      expect([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]).toContain(
        final_n1
      );
      expect([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]).toContain(
        final_n2
      );
    });
  });
});
