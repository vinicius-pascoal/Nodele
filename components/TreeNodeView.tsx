import { useLanguage } from "@/components/LanguageProvider";
import type { TreeNode } from "@/types/game";

type TreeNodeViewProps = {
  node: TreeNode;
  isHighlighted?: boolean;
};

export function TreeNodeView({ node, isHighlighted = false }: TreeNodeViewProps) {
  const { t } = useLanguage();
  const isHiddenNode = node.kind === "hidden" && !node.revealed;
  const isRevealedHiddenNode = node.kind === "fixed" && node.revealed;
  const label = isHiddenNode ? "?" : String(node.value ?? node.realValue ?? "?");

  const baseClass =
    "grid place-items-center rounded-full font-mono font-bold tracking-[0.01em] transition-transform duration-200";

  let className =
    `${baseClass} h-16.5 w-16.5 border-2 border-[#78b3df] bg-linear-to-br from-[#12344b] to-[#0f2a3f] text-[1.08rem] text-[#f0f7fd] shadow-[0_8px_18px_rgba(0,0,0,0.34)]`;

  if (node.kind === "hidden" && !node.revealed) {
    className =
      `${baseClass} h-16.5 w-16.5 border-[3px] border-dashed border-[#f5d56c] bg-linear-to-br from-[#1c252e] to-[#111d27] text-[1.08rem] text-[#ffe8a3] shadow-[0_8px_18px_rgba(0,0,0,0.3)]`;
  }

  if (isRevealedHiddenNode) {
    className =
      `${baseClass} h-16.5 w-16.5 border-2 border-[#47b37a] bg-linear-to-br from-[#1f6b44] to-[#164f34] text-[1.08rem] text-[#e7fff0] shadow-[0_8px_18px_rgba(0,0,0,0.34)]`;
  }

  if (node.kind === "ghost") {
    className =
      `${baseClass} h-14 w-14 border-2 border-dashed border-[#8cc4ff]/72 bg-[#8cc4ff]/16 text-[1.02rem] text-[#cee7ff] opacity-84 shadow-[0_6px_14px_rgba(0,0,0,0.26)]`;
  }

  if (isHighlighted && node.kind !== "ghost") {
    className += " scale-105 ring-4 ring-emerald-300/40 shadow-[0_10px_22px_rgba(0,0,0,0.38)]";
  }

  if (isHighlighted && node.kind === "ghost") {
    className += " -translate-y-0.5 ring-2 ring-sky-300/40 shadow-[0_8px_16px_rgba(0,0,0,0.3)]";
  }

  className += " max-sm:h-[58px] max-sm:w-[58px]";

  if (node.kind === "ghost") {
    className += " max-sm:h-[50px] max-sm:w-[50px]";
  }

  const accessibleLabel = isHiddenNode
    ? t.node.hidden
    : node.kind === "ghost"
      ? t.node.ghost(label)
      : t.node.fixed(label);

  return (
    <div className={className} role="img" aria-label={accessibleLabel}>
      {label}
    </div>
  );
}
