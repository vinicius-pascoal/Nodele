"use client";

import { useMemo, useState } from "react";
import { GameLegend } from "@/components/GameLegend";
import { GuessHistory } from "@/components/GuessHistory";
import { GuessInput } from "@/components/GuessInput";
import { TreeView } from "@/components/TreeView";
import { createInitialGameState, processGuess } from "@/lib/game";

const panelClass =
  "rounded-[20px] border border-[#3a6280]/63 bg-[#0d2435]/90 p-4 shadow-[0_16px_32px_rgba(4,12,19,0.4)] backdrop-blur-sm";

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
      ? "mt-3.5 rounded-xl border border-emerald-300/50 bg-emerald-300/20 px-3 py-2.5 text-[0.95rem] leading-[1.4] text-emerald-50"
      : "mt-3.5 rounded-xl border border-[#3a6280]/72 bg-[#163249]/70 px-3 py-2.5 text-[0.95rem] leading-[1.4] text-[#d7e8f5]";

  const highlightKind = canHighlight
    ? ((lastGuess?.result ?? null) as "revealed" | "ghost" | null)
    : null;

  return (
    <div className="mx-auto my-[18px] w-[94vw] max-w-[1200px] sm:my-8 sm:w-[92vw]">
      <header className="animate-in fade-in slide-in-from-bottom-2 rounded-3xl border border-[#3a6280]/65 bg-gradient-to-br from-[#163249]/88 to-[#0d2435]/92 px-4 py-[18px] shadow-[0_18px_40px_rgba(3,10,18,0.45)] sm:px-6 sm:py-[26px]">
        <p className="m-0 text-[0.82rem] uppercase tracking-[0.06em] text-[#c8deef]">
          Puzzle de lógica
        </p>
        <h1 className="my-2 text-[clamp(2rem,5vw,3.5rem)] leading-none">Nodele</h1>
        <p className="m-0 text-[clamp(1rem,2.6vw,1.2rem)] text-[#c8deef]">
          Descubra os nós ocultos da árvore binária.
        </p>
      </header>

      <main className="mt-[18px] grid items-start gap-[18px] lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,1fr)]">
        <section className={`${panelClass} flex min-h-[430px] flex-col lg:min-h-[500px]`}>
          <div>
            <h2 className="mb-1 text-[1.08rem]">Árvore</h2>
            <p className="m-0 text-[0.95rem] text-[#c0d5e6]">
              Palpite um valor por rodada e observe como ele se posiciona na BST.
            </p>
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

        <aside className="grid gap-[14px]">
          <section className={panelClass}>
            <h2 className="mb-3 text-[1.08rem]">Jogada</h2>
            <GuessInput disabled={state.status === "won"} onGuess={submitGuess} />
            {state.status === "won" ? (
              <button
                type="button"
                className="mt-2.5 w-full cursor-pointer rounded-xl bg-gradient-to-br from-[#81f5c2] to-[#56dca6] px-3.5 py-2.5 font-bold text-[#08301f]"
                onClick={resetGame}
              >
                Reiniciar partida
              </button>
            ) : null}
          </section>

          <section className={panelClass}>
            <h2 className="mb-3 text-[1.08rem]">Histórico de palpites</h2>
            <GuessHistory guesses={state.guesses} />
          </section>

          <section className={panelClass}>
            <h2 className="mb-3 text-[1.08rem]">Legenda</h2>
            <GameLegend />
          </section>
        </aside>
      </main>
    </div>
  );
}
