"use client";

import { useCallback, useEffect, useState } from "react";

import { assembleProgram, formatProgram } from "@/lib/assembler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { AlertCircle, CheckCircle, Code2 } from "lucide-react";

// NOT USED, DELETE FILE

export function AssemblerPanel() {
  const [sourceCode, setSourceCode] = useState(`LDA VALUE1    ; Carrega valor
SUB VALUE2    ; Subtrai valor  
OUT           ; Mostra resultado
HLT           ; Para execução

VALUE1: DAT 10  ; Define dado 10
VALUE2: DAT 5   ; Define dado 5`);

  const [result, setResult] = useState(() => assembleProgram(sourceCode));

  const handleAssemble = useCallback(() => {
    const assemblyResult = assembleProgram(sourceCode);
    setResult(assemblyResult);
  }, [sourceCode]);

  useEffect(() => {
    handleAssemble();
  }, [handleAssemble, sourceCode]);

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          Assembler SAP-1
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="output">
              Resultado
              {result.errors.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 flex h-5 w-5 items-center justify-center p-0"
                >
                  {result.errors.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="program">Programa</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Código Assembly</label>
              <Textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder="Digite seu código assembly SAP-1..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <Button onClick={handleAssemble} className="w-full">
              Gerar Código
            </Button>
          </TabsContent>

          <TabsContent value="output" className="space-y-4">
            {result.errors.length > 0 ? (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {result.errors.length} erro(s) encontrado(s)
                  </AlertDescription>
                </Alert>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {result.errors.map((error, index) => (
                    <div
                      key={index}
                      className="mb-1 font-mono text-sm text-red-600"
                    >
                      {error}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Assemblagem bem-sucedida! {result.program.length}{" "}
                  instrução(ões) gerada(s).
                </AlertDescription>
              </Alert>
            )}

            {Object.keys(result.labels).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Labels Identificados</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(result.labels).map(([label, address]) => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="font-mono"
                    >
                      {label}: {address}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {result.program.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Programa Gerado</h4>
                <ScrollArea className="h-[200px] w-full rounded-md border">
                  <div className="space-y-1 p-4">
                    {result.program.map((instruction, index) => (
                      <div
                        key={index}
                        className="flex justify-between font-mono text-sm"
                      >
                        <span>Endereço {instruction.address}:</span>
                        <span className="text-blue-600">
                          0x
                          {instruction.data
                            .toString(16)
                            .toUpperCase()
                            .padStart(2, "0")}
                          <span className="ml-2 text-gray-500">
                            ({instruction.data})
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="program" className="space-y-4">
            {result.program.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Código TypeScript Gerado
                </h4>
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
                    {formatProgram(result.program)}
                  </pre>
                </ScrollArea>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Nenhum programa válido para exibir. Corrija os erros no código
                  assembly.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
