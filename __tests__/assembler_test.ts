import { assembleProgram, formatProgram } from '@/lib/assembler';
import { OPERATIONS } from '@/types/instructions';

describe('SAP-1 Assembler', () => {
  describe('assembleProgram', () => {
    test('should assemble simple program with numeric operands', () => {
      const code = `
        LDA 14
        SUB 15
        HLT
        ORG 14
        DAT 5
        DAT 3
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors).toHaveLength(0);
      expect(result.program).toEqual([
        { address: 0, data: (OPERATIONS.LDA << 4) | 14 },
        { address: 1, data: (OPERATIONS.SUB << 4) | 15 },
        { address: 2, data: (OPERATIONS.HLT << 4) | 0 },
        { address: 14, data: 5 },
        { address: 15, data: 3 }
      ]);
    });

    test('should assemble program with labels', () => {
      const code = `
        LDA VALUE1
        SUB VALUE2
        OUT
        HLT
        VALUE1: DAT 10
        VALUE2: DAT 5
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors).toHaveLength(0);
      expect(result.labels).toEqual({ VALUE1: 4, VALUE2: 5 });
      expect(result.program).toEqual([
        { address: 0, data: (OPERATIONS.LDA << 4) | 4 },
        { address: 1, data: (OPERATIONS.SUB << 4) | 5 },
        { address: 2, data: (OPERATIONS.OUT << 4) | 0 },
        { address: 3, data: (OPERATIONS.HLT << 4) | 0 },
        { address: 4, data: 10 },
        { address: 5, data: 5 }
      ]);
    });

    test('should handle hexadecimal numbers', () => {
      const code = `
        LDA 0xE
        ADD 0xF
        HLT
        ORG 0xE
        DAT 0xFF
        DAT 0x00
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors).toHaveLength(0);
      expect(result.program).toEqual([
        { address: 0, data: (OPERATIONS.LDA << 4) | 14 },
        { address: 1, data: (OPERATIONS.ADD << 4) | 15 },
        { address: 2, data: (OPERATIONS.HLT << 4) | 0 },
        { address: 14, data: 255 },
        { address: 15, data: 0 }
      ]);
    });

    test('should handle comments', () => {
      const code = `
        LDA 10    ; Load value from address 10
        ADD 11    ; Add value from address 11
        OUT       ; Output result
        HLT       ; Halt program
        ; Data section
        ORG 10
        DAT 5     ; First value
        DAT 3     ; Second value
      `;
      
      const result = assembleProgram(code);

      
      expect(result.errors).toHaveLength(0);
      expect(result.program).toHaveLength(6);
    });

    test('should handle jump instructions', () => {
      const code = `
        LOOP: ADD 10
        OUT
        JMP LOOP
        HLT
        ORG 10
        DAT 1
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors).toHaveLength(0);
      expect(result.labels).toEqual({ LOOP: 0 });
      expect(result.program).toEqual([
        { address: 0, data: (OPERATIONS.ADD << 4) | 10 },
        { address: 1, data: (OPERATIONS.OUT << 4) | 0 },
        { address: 2, data: (OPERATIONS.JMP << 4) | 0 },
        { address: 3, data: (OPERATIONS.HLT << 4) | 0 },
        { address: 10, data: 1 }
      ]);
    });

    test('should handle store operation', () => {
      const code = `
        LDA 10
        STO 11
        HLT
        ORG 10
        DAT 42
        DAT 0
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors).toHaveLength(0);
      expect(result.program).toEqual([
        { address: 0, data: (OPERATIONS.LDA << 4) | 10 },
        { address: 1, data: (OPERATIONS.STO << 4) | 11 },
        { address: 2, data: (OPERATIONS.HLT << 4) | 0 },
        { address: 10, data: 42 },
        { address: 11, data: 0 }
      ]);
    });

    test('should report error for undefined label', () => {
      const code = `
        LDA UNDEFINED_LABEL
        HLT
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors).toContain("Undefined label 'UNDEFINED_LABEL'");
    });

    test('should report error for duplicate label', () => {
      const code = `
        LABEL1: DAT 5
        LABEL1: DAT 10
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors.some(err => err.includes("Label 'LABEL1' already defined"))).toBe(true);
    });

    test('should report error for invalid operand range', () => {
      const code = `
        LDA 16
        HLT
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors).toContain('Operand 16 out of range (0-15)');
    });

    test('should report error for invalid data range', () => {
      const code = `
        DAT 256
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors).toContain('Data value 256 out of range (0-255)');
    });

    test('should report error for unknown instruction', () => {
      const code = `
        INVALID_INSTRUCTION 5
      `;
      
      const result = assembleProgram(code);
      
      expect(result.errors.some(err => err.includes("Unknown instruction"))).toBe(true);
    });

    test('should handle empty input', () => {
      const result = assembleProgram('');
      
      expect(result.errors).toContain('Empty input');
      expect(result.program).toHaveLength(0);
    });

    test('should handle whitespace-only input', () => {
      const result = assembleProgram('   \n  \t  \n   ');
      
      expect(result.errors).toContain('Empty input');
    });
  });

  describe('formatProgram', () => {
    test('should format program array correctly', () => {
      const program = [
        { address: 0, data: 14 },
        { address: 1, data: 47 },
        { address: 2, data: 240 }
      ];
      
      const formatted = formatProgram(program);
      
      expect(formatted).toBe(`const program = [
  { address: 0, data: 0x0E },
  { address: 1, data: 0x2F },
  { address: 2, data: 0xF0 }
];`);
    });

    test('should handle empty program', () => {
      const formatted = formatProgram([]);
      
      expect(formatted).toBe('const program = [];');
    });
  });
});