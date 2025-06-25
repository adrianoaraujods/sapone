"use client";

import * as React from "react";

import { useSystem } from "@/hooks/use-system";
import { getControlSignals, isBitSet } from "@/lib/system";
import { cn } from "@/lib/utils";
import { Display } from "@/components/display";
import { SystemComponent } from "@/components/layout/system-component";
import { Text } from "@/components/typography/text";
import { Card } from "@/components/ui/card";

export function SapOne({ className, ...props }: React.ComponentProps<"div">) {
  const {
    system: {
      accumulator,
      bRegister,
      bus,
      clear,
      clock,
      controlWord,
      flags,
      halted,
      iRegister,
      memoryAddressRegister,
      output,
      programCounter,
      ram,
      running,
      tState,
      unit,
    },
  } = useSystem();

  const signals = getControlSignals(controlWord);

  return (
    <div className={cn("space-y-8", className)} {...props}>
      <div className="mx-auto flex w-fit">
        <div className="flex w-fit flex-col">
          <SystemComponent
            className="mb-12"
            label={
              <>
                Contador de <br /> Programa
              </>
            }
            value={programCounter.toString(16)}
            connections={{
              right: [
                [
                  {
                    dir: "ltr",
                    active: signals.Ep && isBitSet(bus, 3),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ep && isBitSet(bus, 2),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ep && isBitSet(bus, 1),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ep && isBitSet(bus, 0),
                  },
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
                    active: signals.Cp,
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
                    active: signals.Ep,
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
            value={memoryAddressRegister.toString(16)}
            connections={{
              right: [
                [
                  { dir: "rtl", active: signals.Lm && isBitSet(bus, 3) },
                  { dir: "rtl", active: signals.Lm && isBitSet(bus, 2) },
                  { dir: "rtl", active: signals.Lm && isBitSet(bus, 1) },
                  { dir: "rtl", active: signals.Lm && isBitSet(bus, 0) },
                ],
              ],
              bottom: [
                [
                  {
                    dir: "ttb",
                    active: signals.CE && isBitSet(memoryAddressRegister, 7),
                  },
                  {
                    dir: "ttb",
                    active: signals.CE && isBitSet(memoryAddressRegister, 6),
                  },
                  {
                    dir: "ttb",
                    active: signals.CE && isBitSet(memoryAddressRegister, 5),
                  },
                  {
                    dir: "ttb",
                    active: signals.CE && isBitSet(memoryAddressRegister, 4),
                  },
                ],
                [
                  {
                    dir: "ttb",
                    active: signals.CE && isBitSet(memoryAddressRegister, 3),
                  },
                  {
                    dir: "ttb",
                    active: signals.CE && isBitSet(memoryAddressRegister, 2),
                  },
                  {
                    dir: "ttb",
                    active: signals.CE && isBitSet(memoryAddressRegister, 1),
                  },
                  {
                    dir: "ttb",
                    active: signals.CE && isBitSet(memoryAddressRegister, 0),
                  },
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
                    active: !signals.Lm,
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
            className="mb-12"
            label={
              <>
                RAM <br /> 16 x 8
              </>
            }
            connections={{
              right: [
                [
                  { dir: "rtl", active: signals.CE && isBitSet(bus, 7) },
                  { dir: "rtl", active: signals.CE && isBitSet(bus, 6) },
                  { dir: "rtl", active: signals.CE && isBitSet(bus, 5) },
                  { dir: "rtl", active: signals.CE && isBitSet(bus, 4) },
                  { dir: "rtl", active: signals.CE && isBitSet(bus, 3) },
                  { dir: "rtl", active: signals.CE && isBitSet(bus, 2) },
                  { dir: "rtl", active: signals.CE && isBitSet(bus, 1) },
                  { dir: "rtl", active: signals.CE && isBitSet(bus, 0) },
                ],
              ],
              left: [
                [
                  {
                    label: <span className="overline">CE</span>,
                    dir: "ltr",
                    active: !signals.CE,
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
            value={iRegister.toString(16)}
            connections={{
              right: [
                [
                  { dir: "ltr", active: signals.Li && isBitSet(bus, 7) },
                  { dir: "ltr", active: signals.Li && isBitSet(bus, 6) },
                  { dir: "ltr", active: signals.Li && isBitSet(bus, 5) },
                  { dir: "ltr", active: signals.Li && isBitSet(bus, 4) },
                  { dir: "ltr", active: signals.Li && isBitSet(bus, 3) },
                  { dir: "ltr", active: signals.Li && isBitSet(bus, 2) },
                  { dir: "ltr", active: signals.Li && isBitSet(bus, 1) },
                  { dir: "ltr", active: signals.Li && isBitSet(bus, 0) },
                ],
                [
                  { dir: "rtl", active: signals.Ei && isBitSet(iRegister, 3) },
                  { dir: "rtl", active: signals.Ei && isBitSet(iRegister, 2) },
                  { dir: "rtl", active: signals.Ei && isBitSet(iRegister, 1) },
                  { dir: "rtl", active: signals.Ei && isBitSet(iRegister, 0) },
                ],
              ],
              bottom: [
                [
                  { dir: "ttb", active: signals.Ei && isBitSet(iRegister, 3) },
                  { dir: "ttb", active: signals.Ei && isBitSet(iRegister, 2) },
                  { dir: "ttb", active: signals.Ei && isBitSet(iRegister, 1) },
                  { dir: "ttb", active: signals.Ei && isBitSet(iRegister, 0) },
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
                    active: !signals.Li,
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
                    active: !signals.Ei,
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
                    active: signals.Cp,
                  },
                  {
                    label: (
                      <>
                        E<sub>P</sub>
                      </>
                    ),
                    dir: "btt",
                    active: signals.Ep,
                  },
                  {
                    label: (
                      <>
                        <span className="overline">L</span>
                        <sub>M</sub>
                      </>
                    ),
                    dir: "btt",
                    active: !signals.Lm,
                  },
                  {
                    label: <span className="overline">CE</span>,
                    dir: "btt",
                    active: !signals.CE,
                  },
                  {
                    label: (
                      <>
                        <span className="overline">L</span>
                        <sub>I</sub>
                      </>
                    ),
                    dir: "btt",
                    active: !signals.Li,
                  },
                  {
                    label: (
                      <>
                        <span className="overline">E</span>
                        <sub>I</sub>
                      </>
                    ),
                    dir: "btt",
                    active: !signals.Ei,
                  },
                  {
                    label: (
                      <>
                        <span className="overline">L</span>
                        <sub>A</sub>
                      </>
                    ),
                    dir: "btt",
                    active: !signals.La,
                  },
                  {
                    label: (
                      <>
                        E<sub>A</sub>
                      </>
                    ),
                    dir: "btt",
                    active: signals.Ea,
                  },
                  {
                    label: (
                      <>
                        S<sub>U</sub>
                      </>
                    ),
                    dir: "btt",
                    active: signals.Su,
                  },
                  {
                    label: (
                      <>
                        E<sub>U</sub>
                      </>
                    ),
                    dir: "btt",
                    active: signals.Eu,
                  },
                  {
                    label: (
                      <>
                        <span className="overline">L</span>
                        <sub>B</sub>
                      </>
                    ),
                    dir: "btt",
                    active: !signals.Lb,
                  },
                  {
                    label: (
                      <>
                        <span className="overline">L</span>
                        <sub>O</sub>
                      </>
                    ),
                    dir: "btt",
                    active: !signals.Lo,
                  },
                ],
              ],
            }}
          />
        </div>

        <div className="-mr-4 -ml-16 flex h-[694px] items-end">
          <Text className="w-12 font-mono">
            ({bus.toString(16).padStart(2, "0")})
          </Text>

          <div
            className="bg-muted data-[active=true]:bg-primary left-1/2 z-10 h-full w-4 rounded-xs border"
            data-active={bus > 0}
          />
        </div>

        <div className="flex w-fit flex-col">
          <SystemComponent
            label={
              <>
                Acumulador <br /> (A)
              </>
            }
            value={accumulator.toString(16)}
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
                    active: !signals.La,
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
                    active: signals.Ea,
                  },
                ],
              ],
              left: [
                [
                  { dir: "ltr", active: signals.La && isBitSet(bus, 7) },
                  { dir: "ltr", active: signals.La && isBitSet(bus, 6) },
                  { dir: "ltr", active: signals.La && isBitSet(bus, 5) },
                  { dir: "ltr", active: signals.La && isBitSet(bus, 4) },
                  { dir: "ltr", active: signals.La && isBitSet(bus, 3) },
                  { dir: "ltr", active: signals.La && isBitSet(bus, 2) },
                  { dir: "ltr", active: signals.La && isBitSet(bus, 1) },
                  { dir: "ltr", active: signals.La && isBitSet(bus, 0) },
                ],
                [
                  {
                    dir: "ltr",
                    active: signals.Ea && isBitSet(bus, 7),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ea && isBitSet(bus, 6),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ea && isBitSet(bus, 5),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ea && isBitSet(bus, 4),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ea && isBitSet(bus, 3),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ea && isBitSet(bus, 2),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ea && isBitSet(bus, 1),
                  },
                  {
                    dir: "ltr",
                    active: signals.Ea && isBitSet(bus, 0),
                  },
                ],
              ],
              bottom: [
                [
                  { dir: "ttb", active: signals.Eu && isBitSet(unit, 7) },
                  { dir: "ttb", active: signals.Eu && isBitSet(unit, 6) },
                  { dir: "ttb", active: signals.Eu && isBitSet(unit, 5) },
                  { dir: "ttb", active: signals.Eu && isBitSet(unit, 4) },
                  { dir: "ttb", active: signals.Eu && isBitSet(unit, 3) },
                  { dir: "ttb", active: signals.Eu && isBitSet(unit, 2) },
                  { dir: "ttb", active: signals.Eu && isBitSet(unit, 1) },
                  { dir: "ttb", active: signals.Eu && isBitSet(unit, 0) },
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
            value={unit.toString(16)}
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
                    active: signals.Su,
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
                    active: signals.Eu,
                  },
                ],
              ],
              left: [
                [
                  { dir: "ltr", active: signals.Eu && isBitSet(bus, 7) },
                  { dir: "ltr", active: signals.Eu && isBitSet(bus, 6) },
                  { dir: "ltr", active: signals.Eu && isBitSet(bus, 5) },
                  { dir: "ltr", active: signals.Eu && isBitSet(bus, 4) },
                  { dir: "ltr", active: signals.Eu && isBitSet(bus, 3) },
                  { dir: "ltr", active: signals.Eu && isBitSet(bus, 2) },
                  { dir: "ltr", active: signals.Eu && isBitSet(bus, 1) },
                  { dir: "ltr", active: signals.Eu && isBitSet(bus, 0) },
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
            value={bRegister.toString(16)}
            connections={{
              top: [
                [
                  { dir: "btt", active: signals.Eu && isBitSet(bRegister, 7) },
                  { dir: "btt", active: signals.Eu && isBitSet(bRegister, 6) },
                  { dir: "btt", active: signals.Eu && isBitSet(bRegister, 5) },
                  { dir: "btt", active: signals.Eu && isBitSet(bRegister, 4) },
                  { dir: "btt", active: signals.Eu && isBitSet(bRegister, 3) },
                  { dir: "btt", active: signals.Eu && isBitSet(bRegister, 2) },
                  { dir: "btt", active: signals.Eu && isBitSet(bRegister, 1) },
                  { dir: "btt", active: signals.Eu && isBitSet(bRegister, 0) },
                ],
              ],
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
                    active: !signals.Lb,
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
                  { dir: "ltr", active: signals.Lb && isBitSet(bus, 7) },
                  { dir: "ltr", active: signals.Lb && isBitSet(bus, 6) },
                  { dir: "ltr", active: signals.Lb && isBitSet(bus, 5) },
                  { dir: "ltr", active: signals.Lb && isBitSet(bus, 4) },
                  { dir: "ltr", active: signals.Lb && isBitSet(bus, 3) },
                  { dir: "ltr", active: signals.Lb && isBitSet(bus, 2) },
                  { dir: "ltr", active: signals.Lb && isBitSet(bus, 1) },
                  { dir: "ltr", active: signals.Lb && isBitSet(bus, 0) },
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
            value={output.toString(16)}
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
                    active: !signals.Lo,
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
                  { dir: "ttb", active: isBitSet(output, 7) },
                  { dir: "ttb", active: isBitSet(output, 6) },
                  { dir: "ttb", active: isBitSet(output, 5) },
                  { dir: "ttb", active: isBitSet(output, 4) },
                  { dir: "ttb", active: isBitSet(output, 3) },
                  { dir: "ttb", active: isBitSet(output, 2) },
                  { dir: "ttb", active: isBitSet(output, 1) },
                  { dir: "ttb", active: isBitSet(output, 0) },
                ],
              ],
              left: [
                [
                  { dir: "ltr", active: signals.Lo && isBitSet(bus, 7) },
                  { dir: "ltr", active: signals.Lo && isBitSet(bus, 6) },
                  { dir: "ltr", active: signals.Lo && isBitSet(bus, 5) },
                  { dir: "ltr", active: signals.Lo && isBitSet(bus, 4) },
                  { dir: "ltr", active: signals.Lo && isBitSet(bus, 3) },
                  { dir: "ltr", active: signals.Lo && isBitSet(bus, 2) },
                  { dir: "ltr", active: signals.Lo && isBitSet(bus, 1) },
                  { dir: "ltr", active: signals.Lo && isBitSet(bus, 0) },
                ],
              ],
            }}
          />

          <Card className="mx-auto flex h-full w-64 flex-row items-center justify-center p-4">
            <Display digit={output >> 4} />
            <Display digit={output & 0x0f} />
          </Card>
        </div>
      </div>
    </div>
  );
}
