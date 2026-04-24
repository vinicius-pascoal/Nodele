import type { TreeNode } from "@/types/game";

export const initialChallenge: TreeNode = {
  id: "root",
  value: 50,
  kind: "fixed",
  left: {
    id: "node-30",
    value: null,
    realValue: 30,
    kind: "hidden",
    revealed: false,
    left: {
      id: "node-20",
      value: 20,
      kind: "fixed",
      left: null,
      right: null,
    },
    right: {
      id: "node-40",
      value: null,
      realValue: 40,
      kind: "hidden",
      revealed: false,
      left: null,
      right: null,
    },
  },
  right: {
    id: "node-80",
    value: 80,
    kind: "fixed",
    left: null,
    right: null,
  },
};
