"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
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
  animationTick?: number;
  canExport?: boolean;
};

const NODE_STEP_X = 88;
const NODE_STEP_Y = 100;
const PADDING_X = 44;
const PADDING_Y = 36;
const FRAME_PADDING = 16;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = Number.POSITIVE_INFINITY;
const ZOOM_STEP = 0.2;

function resolveNodeRadius(node: TreeNode): number {
  if (node.kind === "ghost") {
    return 28;
  }

  return 33;
}

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

export function TreeView({
  tree,
  highlightValue = null,
  highlightKind = null,
  animationTick = 0,
  canExport = false,
}: TreeViewProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const exportTargetRef = useRef<HTMLDivElement | null>(null);
  const activePointersRef = useRef(
    new Map<number, { x: number; y: number }>(),
  );
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startScrollLeft: number;
    startScrollTop: number;
  } | null>(null);
  const pinchStateRef = useRef<{
    initialDistance: number;
    initialZoom: number;
    initialScrollLeft: number;
    initialScrollTop: number;
    centerX: number;
    centerY: number;
  } | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [isSnapshotMode, setIsSnapshotMode] = useState(false);
  const [exportError, setExportError] = useState<"exportFailed" | null>(null);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      const nextWidth = Math.round(entry.contentRect.width);
      setContainerWidth((current) => (current === nextWidth ? current : nextWidth));
    });

    observer.observe(element);
    setContainerWidth(Math.round(element.clientWidth));

    const updateViewportHeight = () => {
      const nextWidth = Math.round(window.innerWidth);
      const nextHeight = Math.round(window.innerHeight);
      setViewportWidth((current) => (current === nextWidth ? current : nextWidth));
      setViewportHeight((current) => (current === nextHeight ? current : nextHeight));
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, []);

  const layout = useMemo(() => buildLayout(tree), [tree]);

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

  const drawOrderById = useMemo(() => {
    const ordered = [...positioned].sort((a, b) => {
      if (a.y !== b.y) {
        return a.y - b.y;
      }

      return a.x - b.x;
    });

    return new Map(ordered.map((item, index) => [item.id, index]));
  }, [positioned]);

  if (layout.length === 0) {
    return null;
  }

  const maxX = Math.max(...layout.map((n) => n.x));
  const maxY = Math.max(...layout.map((n) => n.y));

  const width = (maxX + 1) * NODE_STEP_X + PADDING_X * 2;
  const height = (maxY + 1) * NODE_STEP_Y + PADDING_Y * 2;
  const availableWidth = Math.max(containerWidth - FRAME_PADDING * 2, 0);
  const isCompactViewport = viewportWidth > 0 && viewportWidth < 640;
  const availableHeight = Math.max(
    viewportHeight * (isCompactViewport ? 0.56 : 0.68) - FRAME_PADDING * 2,
    0,
  );
  const widthFitScale = availableWidth > 0 ? availableWidth / width : 1;
  const heightFitScale = availableHeight > 0 ? availableHeight / height : 1;
  const fitScale = Math.min(1, widthFitScale, heightFitScale);
  const maxAllowedZoom = MAX_ZOOM;
  const appliedZoom = Math.min(zoom, maxAllowedZoom);
  const scale = fitScale * appliedZoom;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  const decreaseZoom = () => {
    setZoom((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))));
  };

  const increaseZoom = () => {
    setZoom((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))));
  };

  const exportTreeImage = async () => {
    const exportTarget = exportTargetRef.current;

    if (!exportTarget || isExporting) {
      return;
    }

    setIsExporting(true);
    setExportError(null);
    setIsSnapshotMode(true);

    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(exportTarget, {
        cacheBust: true,
        pixelRatio: Math.max(window.devicePixelRatio, 2),
        backgroundColor: "#0a1e2e",
      });

      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `nodele-arvore-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.png`;
      downloadLink.click();
    } catch {
      setExportError("exportFailed");
    } finally {
      setIsSnapshotMode(false);
      setIsExporting(false);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !containerRef.current) {
      return;
    }

    const target = event.target as HTMLElement | null;

    if (target?.closest("button")) {
      return;
    }

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (activePointersRef.current.size === 1) {
      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startScrollLeft: containerRef.current.scrollLeft,
        startScrollTop: containerRef.current.scrollTop,
      };
    }

    if (activePointersRef.current.size === 2) {
      dragStateRef.current = null;

      const points = [...activePointersRef.current.values()];
      const firstPoint = points[0];
      const secondPoint = points[1];
      const centerX = (firstPoint.x + secondPoint.x) / 2 - containerRef.current.getBoundingClientRect().left;
      const centerY = (firstPoint.y + secondPoint.y) / 2 - containerRef.current.getBoundingClientRect().top;
      const distance = Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);

      pinchStateRef.current = {
        initialDistance: distance,
        initialZoom: zoom,
        initialScrollLeft: containerRef.current.scrollLeft,
        initialScrollTop: containerRef.current.scrollTop,
        centerX,
        centerY,
      };
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("cursor-grabbing");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const pointer = activePointersRef.current.get(event.pointerId);

    if (pointer) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }

    const pinchState = pinchStateRef.current;

    if (pinchState && activePointersRef.current.size >= 2 && containerRef.current) {
      const points = [...activePointersRef.current.values()];
      const firstPoint = points[0];
      const secondPoint = points[1];
      const currentDistance = Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);

      if (pinchState.initialDistance > 0 && currentDistance > 0) {
        const nextZoom = Math.max(MIN_ZOOM, Number((pinchState.initialZoom * (currentDistance / pinchState.initialDistance)).toFixed(2)));
        const previousScale = fitScale * appliedZoom;
        const nextScale = fitScale * nextZoom;

        if (previousScale > 0 && nextScale > 0) {
          const contentX = (pinchState.initialScrollLeft + pinchState.centerX) / previousScale;
          const contentY = (pinchState.initialScrollTop + pinchState.centerY) / previousScale;

          setZoom(nextZoom);

          requestAnimationFrame(() => {
            const currentContainer = containerRef.current;

            if (!currentContainer) {
              return;
            }

            currentContainer.scrollLeft = contentX * nextScale - pinchState.centerX;
            currentContainer.scrollTop = contentY * nextScale - pinchState.centerY;
          });

          return;
        }
      }
    }

    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId || !containerRef.current) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    containerRef.current.scrollLeft = dragState.startScrollLeft - deltaX;
    containerRef.current.scrollTop = dragState.startScrollTop - deltaY;
  };

  const endDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(event.pointerId);

    if (activePointersRef.current.size < 2) {
      pinchStateRef.current = null;
    }

    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;

      const [remainingPointerId, remainingPointer] = activePointersRef.current.entries().next().value ?? [];

      if (remainingPointerId !== undefined && remainingPointer && containerRef.current) {
        dragStateRef.current = {
          pointerId: remainingPointerId,
          startX: remainingPointer.x,
          startY: remainingPointer.y,
          startScrollLeft: containerRef.current.scrollLeft,
          startScrollTop: containerRef.current.scrollTop,
        };
      }
    }

    event.currentTarget.classList.remove("cursor-grabbing");

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className="mt-3.5 flex-1 rounded-[14px] border border-[#3a6280]/58 bg-linear-to-b from-[rgba(5,15,24,0.76)] to-[rgba(6,18,29,0.7)] p-2.5"
    >
      <div className="mb-2 flex flex-wrap items-center justify-end gap-2 max-sm:justify-start">
        {canExport ? (
          <button
            type="button"
            onClick={exportTreeImage}
            disabled={isExporting}
            className="mr-auto cursor-pointer rounded-lg border border-[#63a3ca] bg-[#154463] px-3 py-1.5 text-[0.8rem] font-semibold text-[#e2f0fb] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55 max-sm:mr-0"
          >
            {isExporting ? t.tree.exporting : t.tree.exportImage}
          </button>
        ) : null}

        <span className="mr-1 text-[0.78rem] text-[#c6dced]">
          {t.tree.zoom} {Math.round(appliedZoom * 100)}%
        </span>
        <button
          type="button"
          aria-label={t.tree.zoomOutAria}
          onClick={decreaseZoom}
          disabled={appliedZoom <= MIN_ZOOM}
          className="h-8 w-8 cursor-pointer rounded-lg border border-[#557a98] bg-[#123247] text-[#dbe9f4] disabled:cursor-not-allowed disabled:opacity-45 max-sm:h-7 max-sm:w-7"
        >
          -
        </button>
        <button
          type="button"
          aria-label={t.tree.zoomInAria}
          onClick={increaseZoom}
          disabled={appliedZoom >= maxAllowedZoom}
          className="h-8 w-8 cursor-pointer rounded-lg border border-[#557a98] bg-[#123247] text-[#dbe9f4] disabled:cursor-not-allowed disabled:opacity-45 max-sm:h-7 max-sm:w-7"
        >
          +
        </button>
      </div>

      <div
        ref={containerRef}
        className="mx-auto w-full max-h-[60vh] overflow-auto [scrollbar-gutter:stable] cursor-grab select-none touch-none rounded-xl max-sm:max-h-[56vh] sm:max-h-[68vh] lg:max-h-155"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDragging}
        onPointerCancel={endDragging}
        onPointerLeave={endDragging}
      >
        <div ref={exportTargetRef} style={{ width: scaledWidth || width, height: scaledHeight || height }}>
          <div
            key={animationTick}
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
                const parentId = item.parentId;

                if (parentId === null) {
                  return null;
                }

                const parent = positionedById.get(parentId);
                if (!parent) {
                  return null;
                }

                const drawStep = drawOrderById.get(item.id) ?? 0;
                const delayMs = drawStep * 95;
                const dx = item.px - parent.px;
                const dy = item.py - parent.py;
                const centerDistance = Math.hypot(dx, dy);

                if (centerDistance === 0) {
                  return null;
                }

                const ux = dx / centerDistance;
                const uy = dy / centerDistance;
                const parentRadius = resolveNodeRadius(parent.node);
                const childRadius = resolveNodeRadius(item.node);

                const x1 = parent.px + ux * parentRadius;
                const y1 = parent.py + uy * parentRadius;
                const x2 = item.px - ux * childRadius;
                const y2 = item.py - uy * childRadius;
                const lineLength = Math.hypot(x2 - x1, y2 - y1);

                return (
                  <line
                    key={`${item.id}-line`}
                    className={isSnapshotMode ? undefined : "tree-line-draw"}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(146,190,229,0.72)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: isSnapshotMode ? undefined : lineLength,
                      strokeDashoffset: isSnapshotMode ? undefined : lineLength,
                      animationDelay: isSnapshotMode ? undefined : `${delayMs}ms`,
                    }}
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
                  className="tree-node-draw absolute"
                  style={{
                    left: item.px,
                    top: item.py,
                    animationDelay: `${(drawOrderById.get(item.id) ?? 0) * 95 + 55}ms`,
                  }}
                >
                  <TreeNodeView node={item.node} isHighlighted={shouldHighlight} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {exportError ? (
        <p className="mt-2 mb-0 text-[0.78rem] text-[#ffd6d6]" role="status" aria-live="polite">
          {t.tree.exportError}
        </p>
      ) : null}
    </div>
  );
}
