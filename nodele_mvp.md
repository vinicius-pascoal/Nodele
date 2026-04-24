# Nodele — MVP

## 1. Visão geral

**Nodele** é um jogo web de lógica baseado em **árvore binária de busca**. O jogador recebe uma árvore parcialmente montada, contendo alguns valores visíveis e alguns nós misteriosos representados por `?`.

A cada rodada, o jogador chuta **um único valor numérico**. Se o valor corresponder a um dos nós misteriosos, esse nó é revelado. Se o valor não for um dos valores ocultos, ele é inserido visualmente na árvore como um **nó fantasma**, ajudando o jogador a entender onde aquele número se encaixaria na estrutura da BST.

O objetivo é revelar todos os valores ocultos da árvore.

---

## 2. Nome do jogo

**Nodele**

### Subtítulo

> Descubra os nós ocultos da árvore binária.

### Descrição curta

> Um puzzle de lógica onde cada palpite cresce a árvore e revela pistas sobre os valores escondidos.

---

## 3. Stack definida

O MVP será desenvolvido com:

- **Next.js**
- **TypeScript**
- **Tailwind CSS**

### Estrutura sugerida

```txt
nodele/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── GameBoard.tsx
│   ├── TreeView.tsx
│   ├── TreeNodeView.tsx
│   ├── GuessInput.tsx
│   ├── GuessHistory.tsx
│   └── GameLegend.tsx
├── lib/
│   ├── tree.ts
│   ├── game.ts
│   └── challenges.ts
├── types/
│   └── game.ts
└── README.md
```

---

## 4. Conceito principal

O jogo começa com uma árvore binária de busca parcialmente visível.

Exemplo:

```txt
       50
      /  \
     ?    80
    / \
   20  ?
```

Internamente, a árvore real seria:

```txt
       50
      /  \
     30   80
    / \
   20  40
```

Valores misteriosos:

```txt
30, 40
```

O jogador não sabe quais são esses valores. Ele precisa descobri-los chutando um valor por vez.

---

## 5. Regras do jogo

1. O jogador vê uma BST parcialmente montada.
2. Alguns nós aparecem com valor visível.
3. Alguns nós aparecem como `?`.
4. O jogador informa um único número por rodada.
5. Se o número for um dos valores ocultos:
   - o nó misterioso correspondente é revelado;
   - o valor passa a aparecer como nó oficial da árvore.
6. Se o número não for oculto:
   - o valor é inserido na árvore como um **nó fantasma**;
   - ele não substitui nenhum nó oficial;
   - ele serve como pista visual de onde aquele valor entraria pela regra da BST.
7. O jogador vence quando todos os nós misteriosos forem revelados.
8. Valores repetidos não devem ser inseridos novamente.

---

## 6. Tipos de nós

O jogo terá três tipos principais de nós.

### 6.1. Nó fixo

Valor já visível desde o início.

Exemplo:

```txt
50, 80, 20
```

Visual recomendado:

- círculo sólido;
- cor neutra;
- texto claro;
- sem animação especial.

---

### 6.2. Nó oculto

Valor que o jogador precisa descobrir.

Exemplo:

```txt
?
```

Visual recomendado:

- círculo destacado;
- borda tracejada;
- símbolo `?`;
- aparência de mistério.

---

### 6.3. Nó fantasma

Valor chutado incorretamente pelo jogador.

Exemplo:

```txt
35
```

Visual recomendado:

- círculo menor;
- transparência;
- borda tracejada;
- cor secundária;
- não deve parecer um nó oficial da solução.

---

## 7. Exemplo de gameplay

### 7.1. Estado inicial

```txt
       50
      /  \
     ?    80
    / \
   20  ?
```

Valores ocultos reais:

```txt
30, 40
```

---

### 7.2. Jogada 1

Jogador chuta:

```txt
10
```

O valor `10` não é um nó oculto. Ele é inserido como nó fantasma no local em que entraria pela regra da BST.

Resultado visual:

```txt
       50
      /  \
     ?    80
    / \
   20  ?
  /
10*
```

Onde:

```txt
10* = nó fantasma
```

---

### 7.3. Jogada 2

Jogador chuta:

```txt
35
```

O valor `35` não é oculto. Ele entra como nó fantasma.

Resultado visual:

```txt
       50
      /  \
     ?    80
    / \
   20  ?
  /    /
10*  35*
```

---

### 7.4. Jogada 3

Jogador chuta:

```txt
30
```

O valor `30` é um dos valores ocultos. O nó misterioso é revelado.

Resultado visual:

```txt
       50
      /  \
     30   80
    / \
   20  ?
  /    /
10*  35*
```

---

### 7.5. Jogada 4

Jogador chuta:

```txt
40
```

O valor `40` é o último valor oculto. O nó misterioso é revelado.

Resultado visual:

```txt
       50
      /  \
     30   80
    / \
   20  40
  /    /
10*  35*
```

O jogador vence.

---

## 8. Mecânica oficial do MVP

Para o MVP, a árvore deve seguir a **Opção 2**:

> Palpites errados entram visualmente na árvore como nós fantasmas.

### Decisão importante

Os nós da solução oficial sempre têm prioridade sobre os nós fantasmas.

Isso significa que:

- um nó oculto nunca é substituído por um palpite errado;
- um nó fantasma nunca deve apagar um nó oficial;
- ao acertar um valor oculto, o nó `?` é revelado no local correto;
- palpites errados continuam existindo apenas como pistas visuais.

---

## 9. Feedback visual

O feedback será dado principalmente pela própria árvore.

### Acerto

Quando o jogador acerta um valor oculto:

- o `?` vira o número correto;
- o nó recebe uma animação de revelação;
- o nó pode piscar em verde rapidamente;
- o valor entra como parte oficial da árvore.

Exemplo:

```txt
? → 30
```

---

### Erro

Quando o jogador erra:

- o número é inserido como nó fantasma;
- o nó aparece com aparência translúcida;
- o histórico registra o palpite;
- o jogador entende onde aquele valor entraria na BST.

Exemplo:

```txt
35*
```

---

### Valor repetido

Se o jogador tentar um valor já usado:

- não inserir novamente;
- exibir mensagem curta.

Exemplo:

```txt
Você já tentou esse valor.
```

---

## 10. Condição de vitória

O jogador vence quando todos os nós ocultos forem revelados.

Exemplo de verificação:

```ts
const hasWon = hiddenNodes.every((node) => node.revealed);
```

Mensagem de vitória:

```txt
Parabéns! Você revelou todos os nós ocultos.
```

---

## 11. Condição de derrota

Para o MVP, existem duas opções.

### Opção recomendada para MVP

Não ter derrota inicialmente.

O jogador pode continuar tentando até revelar todos os nós.

### Opção futura

Adicionar limite de tentativas.

Exemplo:

```txt
Você tem 8 tentativas para revelar todos os nós.
```

---

## 12. Estrutura de dados

### 12.1. Tipo do nó

```ts
export type NodeKind = "fixed" | "hidden" | "ghost";
```

---

### 12.2. Nó da árvore

```ts
export type TreeNode = {
  id: string;
  value: number | null;
  realValue?: number;
  kind: NodeKind;
  revealed?: boolean;
  left?: TreeNode | null;
  right?: TreeNode | null;
};
```

### Campos

| Campo | Descrição |
|---|---|
| `id` | Identificador único do nó |
| `value` | Valor exibido no nó |
| `realValue` | Valor real de um nó oculto |
| `kind` | Tipo do nó: fixo, oculto ou fantasma |
| `revealed` | Define se um nó oculto já foi revelado |
| `left` | Filho esquerdo |
| `right` | Filho direito |

---

### 12.3. Palpite

```ts
export type Guess = {
  value: number;
  result: GuessResult;
  createdAt: Date;
};
```

---

### 12.4. Resultado do palpite

```ts
export type GuessResult = "revealed" | "ghost" | "duplicate";
```

---

### 12.5. Estado do jogo

```ts
export type GameState = {
  tree: TreeNode;
  guesses: Guess[];
  status: "playing" | "won";
};
```

---

## 13. Exemplo de desafio fixo para o MVP

Para a primeira versão, recomenda-se usar um desafio fixo.

```ts
export const initialChallenge: TreeNode = {
  id: "root",
  value: 50,
  kind: "fixed",
  left: {
    id: "node-30",
    value: null,
    realValue: 30,
    kind: "hidden",
    revealed: false,
    left: {
      id: "node-20",
      value: 20,
      kind: "fixed",
      left: null,
      right: null,
    },
    right: {
      id: "node-40",
      value: null,
      realValue: 40,
      kind: "hidden",
      revealed: false,
      left: null,
      right: null,
    },
  },
  right: {
    id: "node-80",
    value: 80,
    kind: "fixed",
    left: null,
    right: null,
  },
};
```

---

## 14. Funções principais

### 14.1. Buscar nó oculto pelo valor

```ts
export function findHiddenNodeByValue(
  node: TreeNode | null,
  value: number
): TreeNode | null {
  if (!node) return null;

  if (node.kind === "hidden" && !node.revealed && node.realValue === value) {
    return node;
  }

  return (
    findHiddenNodeByValue(node.left ?? null, value) ||
    findHiddenNodeByValue(node.right ?? null, value)
  );
}
```

---

### 14.2. Revelar nó oculto

```ts
export function revealHiddenNode(
  node: TreeNode | null,
  value: number
): TreeNode | null {
  if (!node) return null;

  if (node.kind === "hidden" && node.realValue === value) {
    return {
      ...node,
      value: node.realValue,
      kind: "fixed",
      revealed: true,
    };
  }

  return {
    ...node,
    left: revealHiddenNode(node.left ?? null, value),
    right: revealHiddenNode(node.right ?? null, value),
  };
}
```

---

### 14.3. Verificar se valor já existe na árvore

```ts
export function treeContainsValue(
  node: TreeNode | null,
  value: number
): boolean {
  if (!node) return false;

  if (node.value === value || node.realValue === value) {
    return true;
  }

  return (
    treeContainsValue(node.left ?? null, value) ||
    treeContainsValue(node.right ?? null, value)
  );
}
```

---

### 14.4. Inserir nó fantasma

```ts
export function insertGhostNode(
  node: TreeNode,
  value: number
): TreeNode {
  const currentValue = node.value ?? node.realValue;

  if (currentValue === undefined || currentValue === null) {
    return node;
  }

  if (value < currentValue) {
    if (!node.left) {
      return {
        ...node,
        left: {
          id: `ghost-${value}`,
          value,
          kind: "ghost",
          left: null,
          right: null,
        },
      };
    }

    return {
      ...node,
      left: insertGhostNode(node.left, value),
    };
  }

  if (value > currentValue) {
    if (!node.right) {
      return {
        ...node,
        right: {
          id: `ghost-${value}`,
          value,
          kind: "ghost",
          left: null,
          right: null,
        },
      };
    }

    return {
      ...node,
      right: insertGhostNode(node.right, value),
    };
  }

  return node;
}
```

---

### 14.5. Verificar vitória

```ts
export function allHiddenNodesRevealed(node: TreeNode | null): boolean {
  if (!node) return true;

  if (node.kind === "hidden" && !node.revealed) {
    return false;
  }

  return (
    allHiddenNodesRevealed(node.left ?? null) &&
    allHiddenNodesRevealed(node.right ?? null)
  );
}
```

---

### 14.6. Processar palpite

```ts
export function processGuess(state: GameState, value: number): GameState {
  if (state.status === "won") {
    return state;
  }

  const alreadyTried = state.guesses.some((guess) => guess.value === value);

  if (alreadyTried) {
    return {
      ...state,
      guesses: [
        ...state.guesses,
        {
          value,
          result: "duplicate",
          createdAt: new Date(),
        },
      ],
    };
  }

  const hiddenNode = findHiddenNodeByValue(state.tree, value);

  let nextTree: TreeNode;
  let result: GuessResult;

  if (hiddenNode) {
    nextTree = revealHiddenNode(state.tree, value) as TreeNode;
    result = "revealed";
  } else {
    nextTree = insertGhostNode(state.tree, value);
    result = "ghost";
  }

  const nextStatus = allHiddenNodesRevealed(nextTree) ? "won" : "playing";

  return {
    tree: nextTree,
    status: nextStatus,
    guesses: [
      ...state.guesses,
      {
        value,
        result,
        createdAt: new Date(),
      },
    ],
  };
}
```

---

## 15. Observação importante sobre inserção de nós fantasmas

No MVP, os nós ocultos possuem `realValue`. Isso permite que o algoritmo de inserção consiga navegar corretamente mesmo quando o valor exibido é `?`.

Exemplo:

```ts
const currentValue = node.value ?? node.realValue;
```

Assim, mesmo que o jogador veja `?`, o sistema sabe se o palpite deve ir para a esquerda ou para a direita daquele nó.

---

## 16. Componentes principais

### 16.1. `GameBoard.tsx`

Responsável por controlar o estado geral do jogo.

Deve conter:

- estado da árvore;
- lista de palpites;
- função de processar chute;
- condição de vitória;
- renderização geral da tela.

---

### 16.2. `TreeView.tsx`

Responsável por renderizar a árvore.

Recebe:

```ts
TreeNode
```

Responsabilidades:

- posicionar nós;
- desenhar linhas entre pai e filho;
- renderizar filhos recursivamente.

---

### 16.3. `TreeNodeView.tsx`

Responsável por renderizar cada nó individual.

Deve variar o visual conforme o tipo:

```ts
fixed | hidden | ghost
```

---

### 16.4. `GuessInput.tsx`

Input numérico para o jogador digitar um valor.

Responsabilidades:

- aceitar apenas números;
- validar campo vazio;
- enviar valor ao pressionar Enter;
- enviar valor ao clicar no botão.

---

### 16.5. `GuessHistory.tsx`

Lista os palpites feitos.

Exemplo:

```txt
10 — nó fantasma
35 — nó fantasma
30 — revelado
40 — revelado
```

---

### 16.6. `GameLegend.tsx`

Mostra a legenda visual:

```txt
Nó sólido: valor oficial
?: valor oculto
Nó fantasma: palpite incorreto inserido na árvore
```

---

## 17. Layout da tela

### Desktop

```txt
+------------------------------------------------+
| Nodele                                         |
| Descubra os nós ocultos da árvore binária.     |
+------------------------------------------------+
|                                                |
|                 ÁRVORE                         |
|                                                |
+------------------------------------------------+
| [Digite um número] [Inserir]                   |
+------------------------------------------------+
| Histórico de palpites                          |
| 10 — nó fantasma                               |
| 35 — nó fantasma                               |
| 30 — revelado                                  |
+------------------------------------------------+
| Legenda                                        |
+------------------------------------------------+
```

---

### Mobile

```txt
Nodele

Árvore

Input
Botão

Histórico

Legenda
```

No mobile, a árvore pode precisar de:

- zoom;
- scroll horizontal;
- espaçamento reduzido;
- nós menores.

---

## 18. Visual sugerido com Tailwind

### Tema

- fundo escuro;
- nós com aparência moderna;
- cores suaves;
- destaque para o nó oculto;
- nós fantasmas translúcidos.

### Classes sugeridas

#### Nó fixo

```txt
bg-slate-800 border border-slate-500 text-white
```

#### Nó oculto

```txt
bg-slate-950 border-2 border-dashed border-yellow-400 text-yellow-300
```

#### Nó fantasma

```txt
bg-blue-500/10 border border-blue-400/40 text-blue-200 opacity-70
```

#### Botão principal

```txt
bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold
```

---

## 19. Animações recomendadas

Para o MVP, usar animações simples com CSS/Tailwind.

### Ao revelar nó

- scale leve;
- brilho rápido;
- transição de `?` para número.

### Ao inserir nó fantasma

- fade-in;
- entrada de baixo para cima;
- opacidade inicial reduzida.

---

## 20. Backlog do MVP

### Etapa 1 — Base do projeto

- Criar projeto Next.js com TypeScript.
- Configurar Tailwind.
- Criar estrutura de pastas.
- Criar página inicial.

---

### Etapa 2 — Modelo de dados

- Criar `types/game.ts`.
- Criar tipo `TreeNode`.
- Criar tipo `GameState`.
- Criar desafio fixo inicial.

---

### Etapa 3 — Lógica da árvore

- Criar função para localizar nó oculto por valor.
- Criar função para revelar nó oculto.
- Criar função para inserir nó fantasma.
- Criar função para verificar vitória.
- Criar função para processar palpite.

---

### Etapa 4 — Interface da árvore

- Criar componente `TreeView`.
- Criar componente `TreeNodeView`.
- Renderizar nós fixos.
- Renderizar nós ocultos.
- Renderizar nós fantasmas.
- Renderizar conexões entre nós.

---

### Etapa 5 — Entrada do jogador

- Criar input numérico.
- Criar botão de inserir.
- Permitir envio com Enter.
- Bloquear valor vazio.
- Mostrar aviso para valor repetido.

---

### Etapa 6 — Histórico

- Registrar cada chute.
- Exibir lista de palpites.
- Diferenciar acertos e nós fantasmas.

---

### Etapa 7 — Finalização

- Exibir mensagem de vitória.
- Criar botão de reiniciar.
- Ajustar responsividade.
- Melhorar visual.

---

## 21. Funcionalidades fora do MVP

Essas funcionalidades devem ficar para versões futuras.

- Desafio diário.
- Geração procedural de árvores.
- Ranking.
- Compartilhamento de resultado.
- Sistema de tentativas máximas.
- Animação de caminho de inserção.
- Tutorial interativo.
- Modo fácil, médio e difícil.
- Persistência em localStorage.
- Tema claro/escuro.
- Sons e efeitos visuais.

---

## 22. Próximas versões

### Versão 1.1

- Adicionar limite de tentativas.
- Exibir caminho de inserção do palpite.
- Melhorar animação dos nós fantasmas.

### Versão 1.2

- Criar modo diário.
- Salvar progresso no localStorage.
- Adicionar compartilhamento de resultado.

### Versão 1.3

- Gerar árvores automaticamente.
- Adicionar dificuldade.
- Criar tutorial para ensinar BST.

---

## 23. Critérios de aceite do MVP

O MVP estará pronto quando:

- a tela inicial exibir o nome Nodele;
- uma árvore parcial for renderizada;
- a árvore tiver pelo menos um nó oculto;
- o jogador conseguir chutar um valor por vez;
- um valor correto revelar um nó oculto;
- um valor errado entrar como nó fantasma;
- valores repetidos forem tratados;
- o histórico de palpites for exibido;
- a vitória for detectada quando todos os nós ocultos forem revelados;
- o jogo puder ser reiniciado.

---

## 24. Resumo final

**Nodele** é um puzzle de árvore binária de busca onde o jogador precisa revelar nós ocultos chutando valores numéricos. A árvore começa parcialmente montada, e cada erro vira um nó fantasma inserido visualmente na estrutura. O jogador aprende a lógica da BST observando como seus palpites se posicionam na árvore até descobrir todos os valores misteriosos.

