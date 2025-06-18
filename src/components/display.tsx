import * as React from "react";

import { Segment } from "@/components/segment";

export type Hex =
  | 0x0
  | 0x1
  | 0x2
  | 0x3
  | 0x4
  | 0x5
  | 0x6
  | 0x7
  | 0x8
  | 0x9
  | 0xa
  | 0xb
  | 0xc
  | 0xd
  | 0xe
  | 0xf;

export const SEGMENTS_DIGIT_MAP: { [digit in Hex]: string[] } = {
  0x0: ["a", "b", "c", "d", "e", "f"],
  0x1: ["b", "c"],
  0x2: ["a", "b", "d", "e", "g"],
  0x3: ["a", "b", "c", "d", "g"],
  0x4: ["f", "g", "b", "c"],
  0x5: ["a", "f", "g", "c", "d"],
  0x6: ["a", "f", "e", "d", "c", "g"],
  0x7: ["a", "b", "c"],
  0x8: ["a", "b", "c", "d", "e", "f", "g"],
  0x9: ["a", "b", "c", "d", "f", "g"],
  0xa: ["a", "b", "c", "e", "f", "g"],
  0xb: ["c", "d", "e", "f", "g"],
  0xc: ["a", "d", "e", "f"],
  0xd: ["b", "c", "d", "e", "g"],
  0xe: ["a", "d", "e", "f", "g"],
  0xf: ["a", "e", "f", "g"],
};

export function Display({ digit }: { digit: Hex }) {
  const activeSegments = SEGMENTS_DIGIT_MAP[digit];

  return (
    <div className="grid grid-cols-[auto_1fr_auto]">
      <div className="flex flex-col py-0.5">
        <Segment orientation="vertical" active={activeSegments.includes("f")} />
        <Segment orientation="vertical" active={activeSegments.includes("e")} />
      </div>

      <div className="flex flex-col justify-between">
        <Segment
          orientation="horizontal"
          active={activeSegments.includes("a")}
        />
        <Segment
          orientation="horizontal"
          active={activeSegments.includes("g")}
        />
        <Segment
          orientation="horizontal"
          active={activeSegments.includes("d")}
        />
      </div>

      <div className="flex flex-col py-0.5">
        <Segment orientation="vertical" active={activeSegments.includes("b")} />
        <Segment orientation="vertical" active={activeSegments.includes("c")} />
      </div>
    </div>
  );
}
