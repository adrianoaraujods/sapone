import * as React from "react";

import { Segment } from "@/components/segment";

export type Hex =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F";

export const SEGMENTS_DIGIT_MAP: { [digit in Hex]: string[] } = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "d", "e", "g"],
  3: ["a", "b", "c", "d", "g"],
  4: ["f", "g", "b", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "e", "d", "c", "g"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
  A: ["a", "b", "c", "e", "f", "g"],
  B: ["c", "d", "e", "f", "g"],
  C: ["a", "d", "e", "f"],
  D: ["b", "c", "d", "e", "g"],
  E: ["a", "d", "e", "f", "g"],
  F: ["a", "e", "f", "g"],
};

export function Display({ digit }: { digit: Hex }) {
  const activeSegments = SEGMENTS_DIGIT_MAP[digit];

  console.log(activeSegments);

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
