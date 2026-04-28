import { createRandomChallenge } from "@/lib/challenges";
import {
  allHiddenNodesRevealed,
  balanceTree,
  cloneTree,
  findHiddenNodeByValue,
  insertGhostNode,
  revealHiddenNode,
  treeContainsDisplayedValue,
} from "@/lib/tree";
import type { GameDifficulty, GameState, GuessResult, TreeNode } from "@/types/game";

type CreateGameOptions = {
  autoBalance?: boolean;
};

export function createInitialGameState(
  difficulty: GameDifficulty = "medium",
  options: CreateGameOptions = {},
): GameState {
  const baseTree = cloneTree(createRandomChallenge(difficulty));
  const autoBalance = options.autoBalance ?? true;

  if (!baseTree) {
    throw new Error("A árvore inicial não pôde ser carregada.");
  }

  return {
    tree: baseTree,
    guesses: [],
    status: "playing",
    autoBalance,
    message: {
      key: "initial",
      difficulty,
      autoBalance,
    },
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
      message: {
        key: "duplicate",
      },
    };
  }

  const hiddenNode = findHiddenNodeByValue(state.tree, value);

  let nextTree: TreeNode;
  let result: GuessResult;
  let messageKey: "revealed" | "ghost" | "won";

  if (hiddenNode) {
    nextTree = revealHiddenNode(state.tree, value) as TreeNode;
    result = "revealed";
    messageKey = "revealed";
  } else {
    nextTree = insertGhostNode(state.tree, value);
    result = "ghost";
    messageKey = "ghost";
  }

  if (state.autoBalance) {
    nextTree = balanceTree(nextTree);
  }

  const nextStatus = allHiddenNodesRevealed(nextTree) ? "won" : "playing";

  if (nextStatus === "won") {
    messageKey = "won";
  }

  return {
    tree: nextTree,
    status: nextStatus,
    autoBalance: state.autoBalance,
    guesses: [
      ...state.guesses,
      {
        value,
        result,
        createdAt: new Date(),
      },
    ],
    message: {
      key: messageKey,
    },
  };
}
