"use client";

import * as React from "react";

import { toast } from "sonner";

import { useSystem } from "@/hooks/use-system";
import { Input } from "@/components/ui/input";

export type MemoryInputProps = React.ComponentProps<typeof Input> & {
  index: number;
};

export function MemoryInput({ index, ...props }: MemoryInputProps) {
  const { system, setSystem } = useSystem();
  const ramValue = `0x${system.ram[index].toString(16).padStart(2, "0")}`;

  const [value, setValue] = React.useState(ramValue);

  React.useEffect(() => {
    setValue(ramValue);
  }, [ramValue]);

  function handleBlur(value: number) {
    if (Number.isNaN(value) || value < 0 || value > 255) {
      toast.error("Deve ser um número válido", { richColors: true });
      setValue(ramValue);
    } else {
      setSystem((prev) => {
        const updatedSystem = { ...prev };
        prev.ram[index] = Math.min(value, 255);
        return updatedSystem;
      });
    }
  }

  return (
    <Input
      data-active={index === system.memoryAddressRegister}
      onChange={({ target }) => setValue(target.value)}
      onBlur={({ target }) => handleBlur(Number(target.value))}
      value={value}
      {...props}
    />
  );
}
