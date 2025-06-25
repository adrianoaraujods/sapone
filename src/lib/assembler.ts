import { OPERATIONS } from "@/types/sap-one";

import type { MemoryValue } from "@/types/sap-one";

type ParsedLine = {
  address?: number;
  label?: string;
  mnemonic?: string;
  operand?: string | number;
  isData?: boolean;
  originalLine: string;
};

type AssemblyResult = {
  program: MemoryValue[];
  labels: Record<string, number>;
  errors: string[];
};

function tokenizeLine(line: string): string[] {
  return line
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

function isNumeric(str: string): boolean {
  if (str.startsWith("0x") || str.startsWith("0X")) {
    return /^0x[0-9a-fA-F]+$/.test(str);
  }
  return /^\d+$/.test(str);
}

function parseNumber(str: string): number {
  if (str.startsWith("0x") || str.startsWith("0X")) {
    return parseInt(str, 16);
  }
  return parseInt(str, 10);
}

function isValidMnemonic(mnemonic: string): boolean {
  return Object.keys(OPERATIONS).includes(mnemonic.toUpperCase());
}

function parseLine(
  line: string,
  lineNumber: number
): { parsed: ParsedLine; error?: string } {
  const cleanLine = line.split(";")[0].trim();

  if (!cleanLine) {
    return { parsed: { originalLine: line } };
  }

  const tokens = tokenizeLine(cleanLine);
  const parsed: ParsedLine = { originalLine: line };

  if (tokens[0].endsWith(":")) {
    parsed.label = tokens[0].slice(0, -1);
    tokens.shift();
  }

  if (tokens.length === 0) {
    return { parsed };
  }

  const firstToken = tokens[0].toUpperCase();

  if (firstToken === "ORG") {
    if (tokens.length !== 2 || !isNumeric(tokens[1])) {
      return {
        parsed,
        error: `Line ${lineNumber}: ORG requires a numeric address`,
      };
    }
    parsed.address = parseNumber(tokens[1]);
    return { parsed };
  }

  if (firstToken === "DAT") {
    if (tokens.length !== 2 || !isNumeric(tokens[1])) {
      return {
        parsed,
        error: `Line ${lineNumber}: DAT requires a numeric value`,
      };
    }
    parsed.isData = true;
    parsed.operand = parseNumber(tokens[1]);
    return { parsed };
  }

  if (isValidMnemonic(firstToken)) {
    parsed.mnemonic = firstToken;

    if (firstToken === "HLT" || firstToken === "OUT") {
      if (tokens.length > 1) {
        return {
          parsed,
          error: `Line ${lineNumber}: ${firstToken} takes no operands`,
        };
      }
      parsed.operand = 0;
    } else {
      if (tokens.length !== 2) {
        return {
          parsed,
          error: `Line ${lineNumber}: ${firstToken} requires an operand`,
        };
      }

      if (isNumeric(tokens[1])) {
        parsed.operand = parseNumber(tokens[1]);
      } else {
        parsed.operand = tokens[1];
      }
    }
    return { parsed };
  }

  return {
    parsed,
    error: `Line ${lineNumber}: Unknown instruction or directive '${firstToken}'`,
  };
}

function firstPass(text: string): {
  lines: ParsedLine[];
  labels: Record<string, number>;
  errors: string[];
} {
  const lines: ParsedLine[] = [];
  const labels: Record<string, number> = {};
  const errors: string[] = [];
  let currentAddress = 0;

  const textLines = text.split("\n");

  for (let i = 0; i < textLines.length; i++) {
    const { parsed, error } = parseLine(textLines[i], i + 1);

    if (error) {
      errors.push(error);
      continue;
    }

    if (parsed.address !== undefined) {
      currentAddress = parsed.address;
      lines.push(parsed);
      continue;
    }

    if (parsed.label) {
      if (parsed.label in labels) {
        errors.push(`Line ${i + 1}: Label '${parsed.label}' already defined`);
        continue;
      }
      labels[parsed.label] = currentAddress;
    }

    if (parsed.mnemonic || parsed.isData) {
      parsed.address = currentAddress;
      lines.push(parsed);
      currentAddress++;
    } else if (parsed.label) {
      lines.push(parsed);
    }
  }

  return { lines, labels, errors };
}

function secondPass(
  lines: ParsedLine[],
  labels: Record<string, number>
): { program: { address: number; data: number }[]; errors: string[] } {
  const program: { address: number; data: number }[] = [];
  const errors: string[] = [];

  for (const line of lines) {
    if (line.address === undefined || (!line.mnemonic && !line.isData)) {
      continue;
    }

    if (line.isData) {
      const value = line.operand as number;
      if (value < 0 || value > 255) {
        errors.push(`Data value ${value} out of range (0-255)`);
        continue;
      }
      program.push({ address: line.address, data: value });
      continue;
    }

    if (line.mnemonic) {
      const opcode = OPERATIONS[line.mnemonic as keyof typeof OPERATIONS];
      let operand = 0;

      if (typeof line.operand === "string" && line.operand !== "0") {
        if (labels[line.operand] === undefined) {
          errors.push(`Undefined label '${line.operand}'`);
          continue;
        }
        operand = labels[line.operand];
      } else if (typeof line.operand === "number") {
        operand = line.operand;
      }

      if (operand < 0 || operand > 15) {
        errors.push(`Operand ${operand} out of range (0-15)`);
        continue;
      }

      const instruction = (opcode << 4) | operand;
      program.push({ address: line.address, data: instruction });
    }
  }

  return { program, errors };
}

export function assembleProgram(text: string): AssemblyResult {
  if (!text.trim()) {
    return { program: [], labels: {}, errors: ["Empty input"] };
  }

  const { lines, labels, errors: firstPassErrors } = firstPass(text);

  if (firstPassErrors.length > 0) {
    return { program: [], labels, errors: firstPassErrors };
  }

  const { program, errors: secondPassErrors } = secondPass(lines, labels);

  return {
    program: program.sort((a, b) => a.address - b.address),
    labels,
    errors: secondPassErrors,
  };
}

export function formatProgram(
  program: { address: number; data: number }[]
): string {
  if (program.length === 0) {
    return "const program = [];";
  }

  const lines = program.map(
    (item) =>
      `  { address: ${item.address}, data: 0x${item.data.toString(16).toUpperCase().padStart(2, "0")} }`
  );

  return `const program = [\n${lines.join(",\n")}\n];`;
}
