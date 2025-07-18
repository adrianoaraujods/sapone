import * as React from "react";

import { cva } from "class-variance-authority";

import { Text } from "@/components/typography/text";

export type Direction = "ltr" | "rtl" | "ttb" | "btt";

const connectionVariants = cva<{
  dir: { [dir in Direction]: string };
}>("flex items-center gap-1 justify-center", {
  variants: {
    dir: {
      ltr: "flex-row w-16",
      rtl: "flex-row-reverse w-16",
      ttb: "flex-col h-12",
      btt: "flex-col-reverse h-12",
    },
  },
});

const wireVariants = cva<{
  dir: { [dir in Direction]: string };
}>(
  "bg-muted data-[active=true]:bg-primary rounded-xs border data-[active=true]:animate-pulse",
  {
    variants: {
      dir: {
        ltr: "w-full h-2",
        rtl: "w-full h-2",
        ttb: "w-2 h-full",
        btt: "w-2 h-full",
      },
    },
  }
);

const labelVariants = cva<{
  dir: { [dir in Direction]: string };
}>("font-mono", {
  variants: {
    dir: {
      ltr: "w-6 h-4",
      rtl: "w-6 h-4",
      ttb: "w-4 h-6",
      btt: "w-4 h-6",
    },
  },
});

export type ConnectionProps = {
  label?: React.ReactNode;
  dir: Direction;
  active?: boolean;
};

export function Connection({ dir, label, active, ...props }: ConnectionProps) {
  return (
    <div className={connectionVariants({ dir })} {...props}>
      {label && (
        <Text className={labelVariants({ dir })} size="xs">
          {label}
        </Text>
      )}

      <div className={wireVariants({ dir })} data-active={active} />
    </div>
  );
}
