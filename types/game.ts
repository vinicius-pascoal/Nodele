export type NodeKind = "fixed" | "hidden" | "ghost";

export type GameDifficulty = "easy" | "medium" | "hard";

export type TreeNode = {
  id: string;
  value: number | null;
  realValue?: number;
  kind: NodeKind;
  revealed?: boolean;
  left?: TreeNode | null;
  right?: TreeNode | null;
};

export type GuessResult = "revealed" | "ghost" | "duplicate";

export type Guess = {
  value: number;
  result: GuessResult;
  createdAt: Date;
};

export type GameStatus = "playing" | "won";

export type GameState = {
  tree: TreeNode;
  guesses: Guess[];
  status: GameStatus;
  autoBalance: boolean;
  message?: string;
};
