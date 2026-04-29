import type { GameDifficulty, TreeNode } from "@/types/game";

type DifficultyConfig = {
  totalNodes: number;
  hiddenNodes: number;
  maxValue: number;
  includeRootInHidden?: boolean;
};

const difficultyConfig: Record<GameDifficulty, DifficultyConfig> = {
  easy: {
    totalNodes: 7,
    hiddenNodes: 2,
    maxValue: 30,
  },
  medium: {
    totalNodes: 9,
    hiddenNodes: 4,
    maxValue: 60,
  },
  hard: {
    totalNodes: 11,
    hiddenNodes: 6,
    maxValue: 100,
  },
  brutal: {
    totalNodes: 8,
    hiddenNodes: 8,
    maxValue: 500,
    includeRootInHidden: true,
  },
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickUniqueValues(count: number, maxValue: number): number[] {
  const values = new Set<number>();

  while (values.size < count) {
    values.add(randomInt(1, maxValue));
  }

  return [...values];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function insertBst(root: TreeNode | null, value: number): TreeNode {
  if (!root) {
    return {
      id: `node-${value}`,
      value,
      kind: "fixed",
      left: null,
      right: null,
    };
  }

  if (value < (root.value as number)) {
    return {
      ...root,
      left: insertBst(root.left ?? null, value),
    };
  }

  return {
    ...root,
    right: insertBst(root.right ?? null, value),
  };
}

function collectIds(node: TreeNode | null, ids: string[] = []): string[] {
  if (!node) {
    return ids;
  }

  ids.push(node.id);
  collectIds(node.left ?? null, ids);
  collectIds(node.right ?? null, ids);

  return ids;
}

function applyHiddenNodes(node: TreeNode | null, hiddenIds: Set<string>): TreeNode | null {
  if (!node) {
    return null;
  }

  const left = applyHiddenNodes(node.left ?? null, hiddenIds);
  const right = applyHiddenNodes(node.right ?? null, hiddenIds);

  if (!hiddenIds.has(node.id)) {
    return {
      ...node,
      left,
      right,
    };
  }

  return {
    ...node,
    value: null,
    realValue: node.value as number,
    kind: "hidden",
    revealed: false,
    left,
    right,
  };
}

export function createRandomChallenge(difficulty: GameDifficulty): TreeNode {
  const config = difficultyConfig[difficulty];
  const ordered = shuffle(pickUniqueValues(config.totalNodes, config.maxValue));

  const baseTree = ordered.reduce<TreeNode | null>((tree, value) => insertBst(tree, value), null);

  if (!baseTree) {
    throw new Error("A fase aleatoria nao pode ser criada.");
  }

  const candidateIds = collectIds(baseTree).filter(
    (id) => config.includeRootInHidden || id !== baseTree.id,
  );
  const hiddenCount = Math.min(config.hiddenNodes, candidateIds.length);
  const hiddenIds = new Set(shuffle(candidateIds).slice(0, hiddenCount));

  return applyHiddenNodes(baseTree, hiddenIds) as TreeNode;
}
