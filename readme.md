# Emulador SAP-1

## Autores

- Adriano Araújo Domingos dos Santos
- Diego Henrique Xavier dos Santos
- Marcos Vinícius Nunes Reis
- Rafael Georgetti Grossi
- Vitor Daniel Silva Melo

## Vídeo de Apresentação

https://youtu.be/FvLVA8Chj78

## Propósito

O projeto é um emulador para a arquitetura de computador **SAP-1 (Simple-As-Possible)**. Ele fornece uma maneira visual e interativa de entender o funcionamento interno de um sistema de computador básico, incluindo seus componentes, conjunto de instruções e ciclo de execução. O emulador permite que os usuários escrevam e executem programas em um ambiente SAP-1 simulado, permitindo a possibilidade de ver tanto o estado da memória quanto o estado dos componentes em todos os passos de Clock a Clock.

## Instruções para Compilar e Executar

Para compilar e executar este projeto, você precisará ter o **Node.js** e **npm** instalados.

```bash
git clone https://github.com/adrianoaraujods/sapone.git
cd sapone
npm install
npm run dev
```

5. **Abra seu navegador** e navegue até `http://localhost:3000` para ver a
   aplicação em execução.

## Instruções para Adicionar Novas Instruções ao Emulador SAP-1

Para adicionar uma nova instrução ao emulador SAP-1, você precisará modificar os arquivos `src/types/sap-one.ts` e `src/system/sap.ts`.

### Defina o Novo Opcode

Em `src/types/sap-one.ts`, adicione a nova instrução ao objeto `OPERATIONS`. A chave deve ser o mnemônico para a nova instrução e o valor deve ser um opcode hexadecimal único.

```typescript
// src/types/sap-one.ts

export const OPERATIONS = {
  // ... opcodes existentes
  SUA_NOVA_INSTRUCAO: 0xY, // Substitua pelo opcode desejado
  // ...
};
```

### Defina o Ciclo de Execução

Em `src/system/sap.ts`, adicione uma nova entrada ao objeto `EXECUTION_CYCLE`. A chave deve ser o opcode da sua nova instrução, e o valor deve ser um array de palavras de controle para cada passo do ciclo de execução (T4, T5, T6).
Para verificar todas as palavras de controle disponveis, veja `CONTROL_MASKS` em `src/types/sap-one.ts`.

```typescript
// src/system/sap.ts

const EXECUTION_CYCLE = {
  // ... ciclos de execução existentes
  [OPERATIONS.SUA_NOVA_INSTRUCAO]: [
    CONTROL_MASKS.Ei | CONTROL_MASKS.Lm, // T4
    0, // T5
    0, // T6
  ],
  // ...
};
```

### Implemente a Lógica da Instrução (se necessário)

Se a nova instrução exigir alguma lógica especial que não seja tratada apenas pelas palavras de controle, pode ser necessário adicioná-la às funções `handleRisingEdge` ou `handleFallingEdge` em `src/system/sap.ts`. Elas são responsáveis por executar os comandos em borda de subida e descida do clock.

#### Exemplo

Ao adicionar um jump condicional se a flag Zero estiver ativa (JMZ), deve-se alterar a função handleFallingEdge.

```typescript
// src/system/sap.ts
function handleFallingEdge({ system, update }: SystemComponent) {
  //...
    let nextControlWord = 0;
    // LÓGICA CONDICIONAL PARA O JMZ
    if (opcode === OPERATIONS.JMZ && newSystem.tState === 4) {
      if (newSystem.flags.zero) {
        nextControlWord = CONTROL_MASKS.Ei | CONTROL_MASKS.Cp;
      } else {
        nextControlWord = 0;
      }
    }

    else if (newSystem.tState <= 3) {
      // ...
```

### Assembler (se necessário)

Caso a instrução adicionada não tenha operando e/ou tenha mais de um operando, também deve-se editar o arquivo `src/lib/assembler.ts` conforme necessário.

```typescript
// src/lib/assembler.ts
function parseLine(
  line: string,
  lineNumber: number
): { parsed: ParsedLine; error?: string } {
// ...
   // Exemplo: adicionar instruçao NEW que nao requer operando.
   if (firstToken === "HLT" || firstToken === "OUT" || firstToken === "NEW") {
      if (tokens.length > 1) {
        return {
          parsed,
          error: `Line ${lineNumber}: ${firstToken} takes no operands`,
        };
      }
// ...
```
## Instruções Válidas para o Assembler

A seguir estão os mnemônicos reconhecidos pelo assembler do emulador SAP-1:

### Instruções de Operação

- `LDA` – Carrega um valor da memória para o registrador A  
- `ADD` – Soma um valor da memória ao registrador A  
- `SUB` – Subtrai um valor da memória do registrador A  
- `JMP` – Salta para o endereço especificado  
- `STO` – Armazena o valor do registrador A na memória  
- `OUT` – Envia o valor do registrador A para a saída  
- `HLT` – Encerra a execução do programa  

### Diretivas de Dados

- `ORG` – Define o endereço de origem (posição inicial da memória para a próxima instrução ou dado)  
- `DAT` – Define uma constante ou valor literal a ser armazenado na memória  

