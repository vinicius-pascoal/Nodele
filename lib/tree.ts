import type { TreeNode } from "@/types/game";

export function cloneTree(node: TreeNode | null | undefined): TreeNode | null {
  if (!node) {
    return null;
  }

  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

export function findHiddenNodeByValue(
  node: TreeNode | null,
  value: number,
): TreeNode | null {
  if (!node) {
    return null;
  }

  if (node.kind === "hidden" && !node.revealed && node.realValue === value) {
    return node;
  }

  return (
    findHiddenNodeByValue(node.left ?? null, value) ||
    findHiddenNodeByValue(node.right ?? null, value)
  );
}

export function revealHiddenNode(
  node: TreeNode | null,
  value: number,
): TreeNode | null {
  if (!node) {
    return null;
  }

  if (node.kind === "hidden" && node.realValue === value) {
    return {
      ...node,
      value: node.realValue ?? null,
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

function resolveComparisonValue(node: TreeNode): number | null {
  return node.value ?? node.realValue ?? null;
}

export function treeContainsDisplayedValue(
  node: TreeNode | null,
  value: number,
): boolean {
  if (!node) {
    return false;
  }

  if (node.value === value) {
    return true;
  }

  return (
    treeContainsDisplayedValue(node.left ?? null, value) ||
    treeContainsDisplayedValue(node.right ?? null, value)
  );
}

export function insertGhostNode(node: TreeNode, value: number): TreeNode {
  const currentValue = resolveComparisonValue(node);

  if (currentValue === null) {
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

export function allHiddenNodesRevealed(node: TreeNode | null): boolean {
  if (!node) {
    return true;
  }

  if (node.kind === "hidden" && !node.revealed) {
    return false;
  }

  return (
    allHiddenNodesRevealed(node.left ?? null) &&
    allHiddenNodesRevealed(node.right ?? null)
  );
}

export function countUnrevealedHiddenNodes(node: TreeNode | null): number {
  if (!node) {
    return 0;
  }

  const current = node.kind === "hidden" && !node.revealed ? 1 : 0;

  return (
    current +
    countUnrevealedHiddenNodes(node.left ?? null) +
    countUnrevealedHiddenNodes(node.right ?? null)
  );
}
