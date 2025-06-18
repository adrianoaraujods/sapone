import { cva } from "class-variance-authority";

export type Orientation = "horizontal" | "vertical";

export type SegmentProps = { active: boolean; orientation: Orientation };

const segmentVariants = cva<{
  orientation: { [dir in Orientation]: string };
}>("bg-destructive/20 data-[active=true]:bg-destructive rounded-xs border", {
  variants: {
    orientation: {
      horizontal: "h-2 w-8",
      vertical: "h-8 w-2 my-0.5",
    },
  },
});

export function Segment({ active, orientation }: SegmentProps) {
  return (
    <div className={segmentVariants({ orientation })} data-active={active} />
  );
}
