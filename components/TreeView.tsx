import type { TreeNode } from "@/types/game";
import { TreeNodeView } from "@/components/TreeNodeView";

type LayoutNode = {
  id: string;
  node: TreeNode;
  x: number;
  y: number;
  parentId: string | null;
};

type TreeViewProps = {
  tree: TreeNode;
  highlightValue?: number | null;
  highlightKind?: "revealed" | "ghost" | null;
};

const NODE_STEP_X = 96;
const NODE_STEP_Y = 110;
const NODE_RADIUS = 24;
const PADDING_X = 52;
const PADDING_Y = 42;

function buildLayout(root: TreeNode): LayoutNode[] {
  const nodes: LayoutNode[] = [];
  let cursor = 0;

  const walk = (
    node: TreeNode | null | undefined,
    depth: number,
    parentId: string | null,
  ) => {
    if (!node) {
      return;
    }

    walk(node.left, depth + 1, node.id);

    nodes.push({
      id: node.id,
      node,
      x: cursor,
      y: depth,
      parentId,
    });
    cursor += 1;

    walk(node.right, depth + 1, node.id);
  };

  walk(root, 0, null);
  return nodes;
}

export function TreeView({ tree, highlightValue = null, highlightKind = null }: TreeViewProps) {
  const layout = buildLayout(tree);

  if (layout.length === 0) {
    return null;
  }

  const maxX = Math.max(...layout.map((n) => n.x));
  const maxY = Math.max(...layout.map((n) => n.y));

  const width = (maxX + 1) * NODE_STEP_X + PADDING_X * 2;
  const height = (maxY + 1) * NODE_STEP_Y + PADDING_Y * 2;

  const positioned = layout.map((item) => ({
    ...item,
    px: item.x * NODE_STEP_X + PADDING_X,
    py: item.y * NODE_STEP_Y + PADDING_Y,
  }));

  return (
    <div className="mt-3.5 flex-1 overflow-x-auto overflow-y-hidden rounded-[14px] border border-[#3a6280]/58 bg-gradient-to-b from-[rgba(5,15,24,0.76)] to-[rgba(6,18,29,0.7)]">
      <div className="relative" style={{ width, height }}>
        <svg
          className="pointer-events-none absolute inset-0"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          {positioned.map((item) => {
            if (!item.parentId) {
              return null;
            }

            const parent = positioned.find((n) => n.id === item.parentId);
            if (!parent) {
              return null;
            }

            return (
              <line
                key={`${item.id}-line`}
                x1={parent.px}
                y1={parent.py + NODE_RADIUS}
                x2={item.px}
                y2={item.py - NODE_RADIUS}
                stroke="rgba(146,190,229,0.72)"
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {positioned.map((item) => {
          const shouldHighlight =
            highlightValue !== null &&
            item.node.value === highlightValue &&
            ((highlightKind === "ghost" && item.node.kind === "ghost") ||
              (highlightKind === "revealed" && item.node.kind === "fixed"));

          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: item.px, top: item.py }}
            >
              <TreeNodeView node={item.node} isHighlighted={shouldHighlight} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
