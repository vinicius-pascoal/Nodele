import type { TreeNode } from "@/types/game";

type TreeNodeViewProps = {
  node: TreeNode;
  isHighlighted?: boolean;
};

export function TreeNodeView({ node, isHighlighted = false }: TreeNodeViewProps) {
  const isHiddenNode = node.kind === "hidden" && !node.revealed;
  const label = isHiddenNode ? "?" : String(node.value ?? node.realValue ?? "?");

  let className = "tree-node tree-node-fixed";

  if (node.kind === "hidden" && !node.revealed) {
    className = "tree-node tree-node-hidden";
  }

  if (node.kind === "ghost") {
    className = "tree-node tree-node-ghost";
  }

  if (isHighlighted && node.kind !== "ghost") {
    className += " tree-node-highlight";
  }

  if (isHighlighted && node.kind === "ghost") {
    className += " tree-node-ghost-new";
  }

  const accessibleLabel = isHiddenNode
    ? "Nó oculto"
    : node.kind === "ghost"
      ? `Nó fantasma ${label}`
      : `Nó fixo ${label}`;

  return (
    <div className={className} role="img" aria-label={accessibleLabel}>
      {label}
    </div>
  );
}
