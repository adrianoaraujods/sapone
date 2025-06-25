"use client";

import * as React from "react";

import { useSystem } from "@/hooks/use-system";
import { assembleProgram } from "@/lib/assembler";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { runClock, runProgramWithClock, setMemory } from "@/system/sap";

import {
  ClockAlertIcon,
  ClockArrowDownIcon,
  ClockArrowUpIcon,
  HelpCircleIcon,
  MemoryStickIcon,
  OctagonPauseIcon,
  PlayIcon,
} from "lucide-react";

const INITIAL_CODE = `
LDA VALUE1       ; Carrega valor
SUB VALUE2       ; Subtrai valor  
OUT              ; Mostra resultado
HLT              ; Para execução

VALUE1: DAT 10   ; Define dado 10
VALUE2: DAT 5    ; Define dado 5
`;

const MAX_DELAY_MS = 500;
const MIN_DELAY_MS = 25;
const MIN_SPEED = 0;
const MAX_SPEED = 10;

export function ControlPanel() {
  const { system, setSystem } = useSystem();
  const [sourceCode, setSourceCode] = React.useState(INITIAL_CODE);
  const [result, setResult] = React.useState(() => assembleProgram(sourceCode));

  const [isRunning, setIsRunning] = React.useState(false);
  const [speed, setSpeed] = React.useState(5);
  const stopRef = React.useRef(() => {});

  const handleAssemble = React.useCallback(() => {
    const assemblyResult = assembleProgram(sourceCode);
    setResult(assemblyResult);
  }, [sourceCode]);

  React.useEffect(() => {
    handleAssemble();
  }, [handleAssemble, sourceCode]);

  function runProgram() {
    if (
      result.errors.length === 0 &&
      result.program.length > 0 &&
      !system.running
    ) {
      setSystem((prev) => ({
        ...prev,
        running: true,
        halted: false,
      }));
      setIsRunning(true);

      const clampedSpeed = Math.max(MIN_SPEED, Math.min(speed, MAX_SPEED));
      const normalizedSpeed =
        (clampedSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED);
      const clockSpeed =
        MAX_DELAY_MS - (MAX_DELAY_MS - MIN_DELAY_MS) * normalizedSpeed;

      const { stop } = runProgramWithClock({
        system,
        update: setSystem,
        clockSpeed,
      });

      stopRef.current = stop;

      const pollInterval = setInterval(() => {
        if (system.halted) {
          clearInterval(pollInterval);
          setIsRunning(false);
          stop();
        }
      }, 10);
    }
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <Heading size="xl">Código Máquina</Heading>

        <Button variant="ghost" size="icon">
          <HelpCircleIcon />
        </Button>
      </div>

      <div>
        <Textarea
          className="h-[320px] resize-none font-mono text-sm"
          placeholder="Digite seu código assembly SAP-1..."
          onChange={(e) => setSourceCode(e.target.value)}
          value={sourceCode}
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <Button
            className="!bg-blue-500 !text-white hover:!bg-blue-500/70"
            variant="outline"
            onClick={() => {
              setMemory({
                system,
                update: setSystem,
                program: result.program.map(({ address, data }) => ({
                  address,
                  data,
                })),
              });
            }}
          >
            <MemoryStickIcon />

            <Text>Gravar Memória</Text>
          </Button>

          <Button
            variant="secondary"
            onClick={() => runClock({ system, update: setSystem })}
            disabled={isRunning}
          >
            {isRunning ? (
              <ClockAlertIcon />
            ) : system.clock ? (
              <ClockArrowDownIcon />
            ) : (
              <ClockArrowUpIcon />
            )}

            <Text>Clock</Text>
          </Button>
        </div>

        <div className="mb-4 flex flex-col gap-3">
          {isRunning ? (
            <Button
              className="!bg-destructive/80 hover:!bg-destructive/70 w-32 !text-white"
              variant="outline"
              onClick={() => {
                stopRef.current();
                setIsRunning(false);
              }}
            >
              <OctagonPauseIcon />

              <Text>Parar</Text>
            </Button>
          ) : (
            <Button
              className="w-32 !bg-green-700 !text-white hover:!bg-green-700/70"
              variant="outline"
              onClick={() => runProgram()}
            >
              <PlayIcon />

              <Text>Executar</Text>
            </Button>
          )}

          <Slider
            onValueChange={(value) => setSpeed(value[0])}
            value={[speed]}
            max={10}
            step={1}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <Heading size="xl">Memória RAM</Heading>
      </div>

      <div className="grid w-fit grid-cols-4 gap-2">
        {system.ram.map((value, i) => (
          <Input
            className="max-w-32 text-center"
            value={value.toString(2)}
            disabled
            key={i}
          />
        ))}
      </div>
    </>
  );
}
