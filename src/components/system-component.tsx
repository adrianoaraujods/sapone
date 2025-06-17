import * as React from "react";

import { Connection } from "@/components/connection";
import { Card, CardTitle } from "@/components/ui/card";

import type { ConnectionProps } from "@/components/connection";

export type Side = "top" | "right" | "bottom" | "left";

export type SystemComponentProps = {
  label?: React.ReactNode;
  connections: { [dir in Side]?: ConnectionProps[][] };
};

export function SystemComponent({
  label,
  connections: { top, right, bottom, left },
  ...props
}: React.ComponentProps<"div"> & SystemComponentProps) {
  return (
    <div className="flex flex-col" {...props}>
      {top && top.length && (
        <div className="flex w-full justify-center gap-8 px-4">
          {top.map((group, i) => (
            <div className="flex gap-0.5" key={i}>
              {group.map(({ label, dir, active }, i) => (
                <Connection label={label} dir={dir} active={active} key={i} />
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex flex-col gap-8 py-4">
          {left &&
            left.map((group, i) => (
              <div className="flex flex-col gap-0.5" key={i}>
                {group.map(({ label, dir, active }, i) => (
                  <Connection label={label} dir={dir} active={active} key={i} />
                ))}
              </div>
            ))}
        </div>

        <Card className="h-full w-64 p-4">
          <CardTitle className="my-auto text-center">{label}</CardTitle>
        </Card>

        <div className="flex flex-col gap-8 py-4">
          {right &&
            right.map((group, i) => (
              <div className="flex flex-col gap-0.5" key={i}>
                {group.map(({ label, dir, active }, i) => (
                  <Connection label={label} dir={dir} active={active} key={i} />
                ))}
              </div>
            ))}
        </div>
      </div>

      {bottom && bottom.length && (
        <div className="flex w-full justify-center gap-8 px-4">
          {bottom.map((group, i) => (
            <div className="flex gap-0.5" key={i}>
              {group.map(({ label, dir, active }, i) => (
                <Connection label={label} dir={dir} active={active} key={i} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
