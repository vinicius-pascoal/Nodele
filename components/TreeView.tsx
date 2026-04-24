"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const NODE_STEP_X = 88;
const NODE_STEP_Y = 100;
const NODE_RADIUS = 24;
const PADDING_X = 44;
const PADDING_Y = 36;
const FRAME_PADDING = 16;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.2;

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(element);
    setContainerWidth(element.clientWidth);

    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => buildLayout(tree), [tree]);

  if (layout.length === 0) {
    return null;
  }

  const maxX = Math.max(...layout.map((n) => n.x));
  const maxY = Math.max(...layout.map((n) => n.y));

  const width = (maxX + 1) * NODE_STEP_X + PADDING_X * 2;
  const height = (maxY + 1) * NODE_STEP_Y + PADDING_Y * 2;
  const availableWidth = Math.max(containerWidth - FRAME_PADDING * 2, 0);
  const fitScale = availableWidth > 0 ? Math.min(1, availableWidth / width) : 1;
  const scale = fitScale * zoom;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  const positioned = useMemo(
    () =>
      layout.map((item) => ({
        ...item,
        px: item.x * NODE_STEP_X + PADDING_X,
        py: item.y * NODE_STEP_Y + PADDING_Y,
      })),
    [layout],
  );

  const positionedById = useMemo(
    () => new Map(positioned.map((node) => [node.id, node])),
    [positioned],
  );

  const decreaseZoom = () => {
    setZoom((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))));
  };

  const increaseZoom = () => {
    setZoom((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div
      ref={containerRef}
      className="mt-3.5 flex-1 overflow-auto rounded-[14px] border border-[#3a6280]/58 bg-gradient-to-b from-[rgba(5,15,24,0.76)] to-[rgba(6,18,29,0.7)] p-2.5"
    >
      <div className="mb-2 flex items-center justify-end gap-2">
        <span className="mr-1 text-[0.78rem] text-[#c6dced]">Zoom {Math.round(zoom * 100)}%</span>
        <button
          type="button"
          aria-label="Diminuir zoom"
          onClick={decreaseZoom}
          disabled={zoom <= MIN_ZOOM}
          className="h-8 w-8 cursor-pointer rounded-lg border border-[#557a98] bg-[#123247] text-[#dbe9f4] disabled:cursor-not-allowed disabled:opacity-45"
        >
          -
        </button>
        <button
          type="button"
          aria-label="Aumentar zoom"
          onClick={increaseZoom}
          disabled={zoom >= MAX_ZOOM}
          className="h-8 w-8 cursor-pointer rounded-lg border border-[#557a98] bg-[#123247] text-[#dbe9f4] disabled:cursor-not-allowed disabled:opacity-45"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Resetar zoom"
          onClick={resetZoom}
          className="h-8 cursor-pointer rounded-lg border border-[#557a98] bg-[#123247] px-2.5 text-[0.82rem] font-semibold text-[#dbe9f4]"
        >
          100%
        </button>
      </div>

      <div className="mx-auto" style={{ width: scaledWidth || width, height: scaledHeight || height }}>
        <div
          className="relative origin-top-left"
          style={{ width, height, transform: `scale(${scale})` }}
        >
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

              const parent = positionedById.get(item.parentId);
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
    </div>
  );
}
