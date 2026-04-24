"use client";

import { useMemo, useState } from "react";
import { GameLegend } from "@/components/GameLegend";
import { GuessHistory } from "@/components/GuessHistory";
import { GuessInput } from "@/components/GuessInput";
import { TreeView } from "@/components/TreeView";
import { createInitialGameState, processGuess } from "@/lib/game";

export function GameBoard() {
  const initialState = useMemo(() => createInitialGameState(), []);
  const [state, setState] = useState(initialState);

  const lastGuess = state.guesses[state.guesses.length - 1] ?? null;
  const canHighlight = lastGuess?.result === "revealed" || lastGuess?.result === "ghost";

  const submitGuess = (value: number) => {
    setState((current) => processGuess(current, value));
  };

  const resetGame = () => {
    setState(createInitialGameState());
  };

  const statusClass =
    state.status === "won"
      ? "status-banner status-banner-win"
      : "status-banner status-banner-playing";

  const highlightKind = canHighlight
    ? ((lastGuess?.result ?? null) as "revealed" | "ghost" | null)
    : null;

  return (
    <div className="nodele-shell">
      <header className="hero-card">
        <p className="hero-kicker">Puzzle de lógica</p>
        <h1 className="hero-title">Nodele</h1>
        <p className="hero-subtitle">Descubra os nós ocultos da árvore binária.</p>
      </header>

      <main className="nodele-layout">
        <section className="tree-panel panel">
          <div className="panel-head">
            <h2>Árvore</h2>
            <p>Palpite um valor por rodada e observe como ele se posiciona na BST.</p>
          </div>

          <TreeView
            tree={state.tree}
            highlightValue={canHighlight ? (lastGuess?.value ?? null) : null}
            highlightKind={highlightKind}
          />

          <div className={statusClass} role="status" aria-live="polite">
            {state.message}
          </div>
        </section>

        <aside className="side-stack">
          <section className="panel">
            <h2>Jogada</h2>
            <GuessInput disabled={state.status === "won"} onGuess={submitGuess} />
            {state.status === "won" ? (
              <button type="button" className="reset-button" onClick={resetGame}>
                Reiniciar partida
              </button>
            ) : null}
          </section>

          <section className="panel">
            <h2>Histórico de palpites</h2>
            <GuessHistory guesses={state.guesses} />
          </section>

          <section className="panel">
            <h2>Legenda</h2>
            <GameLegend />
          </section>
        </aside>
      </main>
    </div>
  );
}
