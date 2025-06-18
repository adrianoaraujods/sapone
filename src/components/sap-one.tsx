"us client";

import * as React from "react";

import { useSystem } from "@/hooks/use-system";
import { cn } from "@/lib/utils";
import { Display } from "@/components/display";
import { SystemComponent } from "@/components/system-component";
import { Card } from "@/components/ui/card";

export function SapOne({ className, ...props }: React.ComponentProps<"div">) {
  const {
    system: {
      counter,
      accumulator,
      input,
      unit,
      memory,
      register,
      instructions,
      output,
      clock,
      clear,
    },
  } = useSystem();

  return (
    <div className={cn("mx-auto flex w-fit", className)} {...props}>
      <div className="flex w-fit flex-col">
        <SystemComponent
          className="mb-12"
          label={
            <>
              Contador de <br /> Programa
            </>
          }
          connections={{
            right: [
              [
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
              ],
            ],
            left: [
              [
                {
                  label: (
                    <>
                      C<sub>p</sub>
                    </>
                  ),
                  dir: "ltr",
                  active: counter.load,
                },
              ],
              [
                {
                  label: <span className="overline">CLK</span>,
                  dir: "ltr",
                  active: !clock,
                },
                {
                  label: <span className="overline">CLR</span>,
                  dir: "ltr",
                  active: !clear,
                },
                {
                  label: (
                    <>
                      E<sub>p</sub>
                    </>
                  ),
                  dir: "ltr",
                  active: counter.enabled,
                },
              ],
            ],
          }}
        />

        <SystemComponent
          label={
            <>
              Entrada <br /> e REM
            </>
          }
          connections={{
            right: [
              [
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
              ],
            ],
            left: [
              [
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>M</sub>
                    </>
                  ),
                  dir: "ltr",
                  active: !input.load,
                },
              ],
              [
                {
                  label: <span className="overline">CLK</span>,
                  dir: "ltr",
                  active: !clock,
                },
              ],
            ],
          }}
        />

        <SystemComponent
          label={
            <>
              RAM <br /> 16 x 8
            </>
          }
          connections={{
            right: [
              [
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
              ],
              [
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
              ],
            ],
            left: [
              [
                {
                  label: <span className="overline">CE</span>,
                  dir: "ltr",
                  active: !memory.enabled,
                },
              ],
            ],
          }}
        />

        <SystemComponent
          label={
            <>
              Registrador de <br /> Instruções
            </>
          }
          connections={{
            right: [
              [
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
              ],
              [
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
                { dir: "rtl", active: false },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
              ],
            ],
            left: [
              [
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>I</sub>
                    </>
                  ),
                  dir: "ltr",
                  active: !instructions.load,
                },
              ],
              [
                {
                  label: "CLK",
                  dir: "ltr",
                  active: clock,
                },
                {
                  label: "CLR",
                  dir: "ltr",
                  active: clear,
                },
                {
                  label: (
                    <>
                      <span className="overline">E</span>
                      <sub>I</sub>
                    </>
                  ),
                  dir: "ltr",
                  active: !instructions.enabled,
                },
              ],
            ],
          }}
        />

        <SystemComponent
          label={
            <>
              Controlador / <br /> Sequencializador
            </>
          }
          connections={{
            right: [
              [
                { label: <>CLK</>, dir: "rtl", active: clock },
                {
                  label: <span className="overline">CLK</span>,
                  dir: "rtl",
                  active: !clock,
                },
                { label: <>CLR</>, dir: "rtl", active: clear },
                {
                  label: <span className="overline">CLR</span>,
                  dir: "rtl",
                  active: !clear,
                },
              ],
            ],
            bottom: [
              [
                {
                  label: (
                    <>
                      C<sub>P</sub>
                    </>
                  ),
                  dir: "btt",
                  active: counter.load,
                },
                {
                  label: (
                    <>
                      E<sub>P</sub>
                    </>
                  ),
                  dir: "btt",
                  active: counter.enabled,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>M</sub>
                    </>
                  ),
                  dir: "btt",
                  active: !input.load,
                },
                {
                  label: <span className="overline">CE</span>,
                  dir: "btt",
                  active: !memory.enabled,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>I</sub>
                    </>
                  ),
                  dir: "btt",
                  active: !instructions.load,
                },
                {
                  label: (
                    <>
                      <span className="overline">E</span>
                      <sub>I</sub>
                    </>
                  ),
                  dir: "btt",
                  active: !instructions.enabled,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>A</sub>
                    </>
                  ),
                  dir: "btt",
                  active: !accumulator.load,
                },
                {
                  label: (
                    <>
                      E<sub>A</sub>
                    </>
                  ),
                  dir: "btt",
                  active: accumulator.enabled,
                },
                {
                  label: (
                    <>
                      S<sub>U</sub>
                    </>
                  ),
                  dir: "btt",
                  active: unit.subtraction,
                },
                {
                  label: (
                    <>
                      E<sub>U</sub>
                    </>
                  ),
                  dir: "btt",
                  active: unit.enable,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>B</sub>
                    </>
                  ),
                  dir: "btt",
                  active: !register.load,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>O</sub>
                    </>
                  ),
                  dir: "btt",
                  active: !output.load,
                },
              ],
            ],
          }}
        />
      </div>

      <div
        className="bg-muted data-[active=true]:bg-primary left-1/2 z-10 -mx-4 h-[694px] w-4 rounded-xs border"
        data-active={false}
      />

      <div className="flex w-fit flex-col">
        <SystemComponent
          label={
            <>
              Acumulador <br /> (A)
            </>
          }
          connections={{
            right: [
              [
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>A</sub>
                    </>
                  ),
                  dir: "rtl",
                  active: !accumulator.load,
                },
              ],
              [
                {
                  label: "CLK",
                  dir: "rtl",
                  active: clock,
                },
              ],
              [
                {
                  label: (
                    <>
                      E<sub>A</sub>
                    </>
                  ),
                  dir: "rtl",
                  active: accumulator.enabled,
                },
              ],
            ],
            left: [
              [
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
              ],
              [
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
              ],
            ],
          }}
        />

        <SystemComponent
          label={
            <>
              Somador / <br /> Subtrator
            </>
          }
          connections={{
            right: [
              [
                {
                  label: (
                    <>
                      S<sub>U</sub>
                    </>
                  ),
                  dir: "rtl",
                  active: unit.subtraction,
                },
              ],
              [
                {
                  label: (
                    <>
                      E<sub>U</sub>
                    </>
                  ),
                  dir: "rtl",
                  active: unit.enable,
                },
              ],
            ],
            left: [
              [
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
              ],
            ],
          }}
        />

        <SystemComponent
          className="mb-12"
          label={
            <>
              Registrador <br /> (B)
            </>
          }
          connections={{
            right: [
              [
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>B</sub>
                    </>
                  ),
                  dir: "rtl",
                  active: !register.load,
                },
              ],
              [
                {
                  label: "CLK",
                  dir: "rtl",
                  active: clock,
                },
              ],
            ],
            left: [
              [
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
              ],
            ],
          }}
        />

        <SystemComponent
          label={
            <>
              Registrador <br /> de saída
            </>
          }
          connections={{
            right: [
              [
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>O</sub>
                    </>
                  ),
                  dir: "rtl",
                  active: !output.load,
                },
              ],
              [
                {
                  label: "CLK",
                  dir: "rtl",
                  active: clock,
                },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
                { dir: "ttb", active: false },
              ],
            ],
            left: [
              [
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
                { dir: "ltr", active: false },
              ],
            ],
          }}
        />

        <Card className="mx-auto flex h-full w-64 flex-row items-center justify-center p-4">
          <Display digit={0} />
          <Display digit={0} />
        </Card>
      </div>
    </div>
  );
}
