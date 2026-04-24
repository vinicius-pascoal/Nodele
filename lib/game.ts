import { createRandomChallenge } from "@/lib/challenges";
import {
  allHiddenNodesRevealed,
  cloneTree,
  findHiddenNodeByValue,
  insertGhostNode,
  revealHiddenNode,
  treeContainsDisplayedValue,
} from "@/lib/tree";
import type { GameDifficulty, GameState, GuessResult, TreeNode } from "@/types/game";

const difficultyLabel: Record<GameDifficulty, string> = {
  easy: "facil",
  medium: "medio",
  hard: "dificil",
};

export function createInitialGameState(difficulty: GameDifficulty = "medium"): GameState {
  const baseTree = cloneTree(createRandomChallenge(difficulty));

  if (!baseTree) {
    throw new Error("A árvore inicial não pôde ser carregada.");
  }

  return {
    tree: baseTree,
    guesses: [],
    status: "playing",
    message: `Descubra os nos ocultos. Dificuldade: ${difficultyLabel[difficulty]}.`,
  };
}

export function processGuess(state: GameState, value: number): GameState {
  if (state.status === "won") {
    return state;
  }

  const alreadyTried = state.guesses.some((guess) => guess.value === value);
  const alreadyVisibleInTree = treeContainsDisplayedValue(state.tree, value);

  if (alreadyTried || alreadyVisibleInTree) {
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
      message: "Você já tentou esse valor.",
    };
  }

  const hiddenNode = findHiddenNodeByValue(state.tree, value);

  let nextTree: TreeNode;
  let result: GuessResult;
  let message = "";

  if (hiddenNode) {
    nextTree = revealHiddenNode(state.tree, value) as TreeNode;
    result = "revealed";
    message = "Acerto! Um nó oculto foi revelado.";
  } else {
    nextTree = insertGhostNode(state.tree, value);
    result = "ghost";
    message = "Esse valor não era oculto e entrou como nó fantasma.";
  }

  const nextStatus = allHiddenNodesRevealed(nextTree) ? "won" : "playing";

  if (nextStatus === "won") {
    message = "Parabéns! Você revelou todos os nós ocultos.";
  }

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
    message,
  };
}
