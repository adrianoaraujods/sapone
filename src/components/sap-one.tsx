"us client";

import * as React from "react";

import { useSystem } from "@/hooks/use-system";
import { SystemComponent } from "@/components/system-component";

export function SapOne() {
  const { system, setSystem } = useSystem();

  return (
    <div className="flex">
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
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
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
                  active: true,
                },
              ],
              [
                {
                  label: <span className="overline">CLK</span>,
                  dir: "ltr",
                  active: true,
                },
                {
                  label: <span className="overline">CLR</span>,
                  dir: "ltr",
                  active: true,
                },
                {
                  label: (
                    <>
                      E<sub>p</sub>
                    </>
                  ),
                  dir: "ltr",
                  active: true,
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
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
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
                  active: true,
                },
              ],
              [
                {
                  label: <span className="overline">CLK</span>,
                  dir: "ltr",
                  active: true,
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
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
              ],
              [
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
              ],
            ],
            left: [
              [
                {
                  label: <span className="overline">CE</span>,
                  dir: "ltr",
                  active: true,
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
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
              ],
              [
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
                { dir: "rtl", active: true },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
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
                  active: true,
                },
              ],
              [
                {
                  label: "CLK",
                  dir: "ltr",
                  active: true,
                },
                {
                  label: "CLR",
                  dir: "ltr",
                  active: true,
                },
                {
                  label: (
                    <>
                      <span className="overline">E</span>
                      <sub>I</sub>
                    </>
                  ),
                  dir: "ltr",
                  active: true,
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
                { label: <>CLK</>, dir: "rtl", active: true },
                {
                  label: <span className="overline">CLK</span>,
                  dir: "rtl",
                  active: true,
                },
                { label: <>CLR</>, dir: "rtl", active: true },
                {
                  label: <span className="overline">CLR</span>,
                  dir: "rtl",
                  active: true,
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
                  active: true,
                },
                {
                  label: (
                    <>
                      E<sub>P</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>M</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: <span className="overline">CE</span>,
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>I</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      <span className="overline">E</span>
                      <sub>I</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>A</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      E<sub>A</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      S<sub>U</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      E<sub>U</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>B</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
                {
                  label: (
                    <>
                      <span className="overline">L</span>
                      <sub>O</sub>
                    </>
                  ),
                  dir: "btt",
                  active: true,
                },
              ],
            ],
          }}
        />
      </div>

      <div
        className="bg-muted data-[active=true]:bg-primary h-[698px] w-4 rounded-xs border data-[active=true]:animate-pulse"
        data-active={true}
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
                  active: true,
                },
              ],
              [
                {
                  label: "CLK",
                  dir: "rtl",
                  active: true,
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
                  active: true,
                },
              ],
            ],
            left: [
              [
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
              ],
              [
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
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
                      <span className="overline">S</span>
                      <sub>U</sub>
                    </>
                  ),
                  dir: "rtl",
                  active: true,
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
                  active: true,
                },
              ],
            ],
            left: [
              [
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
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
                  active: true,
                },
              ],
              [
                {
                  label: "CLK",
                  dir: "rtl",
                  active: true,
                },
              ],
            ],
            left: [
              [
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
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
                  active: true,
                },
              ],
              [
                {
                  label: "CLK",
                  dir: "rtl",
                  active: true,
                },
              ],
            ],
            bottom: [
              [
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
                { dir: "ttb", active: true },
              ],
            ],
            left: [
              [
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
                { dir: "ltr", active: true },
              ],
            ],
          }}
        />
      </div>
    </div>
  );
}
