import type { TreeNode } from "@/types/game";

type TreeNodeViewProps = {
  node: TreeNode;
  isHighlighted?: boolean;
};

export function TreeNodeView({ node, isHighlighted = false }: TreeNodeViewProps) {
  const isHiddenNode = node.kind === "hidden" && !node.revealed;
  const isRevealedHiddenNode = node.kind === "fixed" && node.revealed;
  const label = isHiddenNode ? "?" : String(node.value ?? node.realValue ?? "?");

  const baseClass =
    "grid place-items-center rounded-full font-mono font-bold tracking-[0.01em] transition-transform duration-200";

  let className =
    `${baseClass} h-[58px] w-[58px] border border-[#6ea9d6] bg-gradient-to-br from-[#12344b] to-[#0f2a3f] text-[1.05rem] text-[#eaf3fb]`;

  if (node.kind === "hidden" && !node.revealed) {
    className =
      `${baseClass} h-[58px] w-[58px] border-2 border-dashed border-[#f5d56c] bg-gradient-to-br from-[#1c252e] to-[#111d27] text-[1.05rem] text-[#ffe8a3]`;
  }

  if (isRevealedHiddenNode) {
    className =
      `${baseClass} h-[58px] w-[58px] border border-[#47b37a] bg-gradient-to-br from-[#1f6b44] to-[#164f34] text-[1.05rem] text-[#e7fff0]`;
  }

  if (node.kind === "ghost") {
    className =
      `${baseClass} h-[50px] w-[50px] border border-dashed border-[#8cc4ff]/65 bg-[#8cc4ff]/16 text-[1.02rem] text-[#cee7ff] opacity-80`;
  }

  if (isHighlighted && node.kind !== "ghost") {
    className += " scale-105 ring-4 ring-emerald-300/40";
  }

  if (isHighlighted && node.kind === "ghost") {
    className += " -translate-y-0.5 ring-2 ring-sky-300/40";
  }

  className += " max-sm:h-[52px] max-sm:w-[52px]";

  if (node.kind === "ghost") {
    className += " max-sm:h-[45px] max-sm:w-[45px]";
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
