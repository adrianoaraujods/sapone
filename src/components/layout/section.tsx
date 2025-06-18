import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";

const sectionVariants = cva("mx-auto w-full p-4 py-8", {
  variants: {
    variant: {
      default: "",
      background: "bg-background text-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      primary: "bg-primary text-primary-foreground",
      muted: "bg-muted text-foreground",
    },
    maxWidth: {
      sm: "min-[calc(768px+2rem)]:px-[calc((100vw-768px)/2)]",
      md: "min-[calc(1024px+2rem)]:px-[calc((100vw-1024px)/2)]",
      lg: "min-[calc(1280px+2rem)]:px-[calc((100vw-1280px)/2)]",
      xl: "min-[calc(1536px+2rem)]:px-[calc((100vw-1536px)/2)]",
    },
  },
  defaultVariants: {
    variant: "default",
    maxWidth: "xl",
  },
});

export type SectionProps = React.ComponentProps<"section"> &
  VariantProps<typeof sectionVariants> & {
    asChild?: boolean;
  };

export function Section({
  className,
  variant,
  maxWidth,
  asChild = false,
  ...props
}: SectionProps) {
  const Comp = asChild ? Slot : "section";

  return (
    <Comp
      data-slot="section"
      className={cn(sectionVariants({ variant, maxWidth, className }))}
      {...props}
    />
  );
}
