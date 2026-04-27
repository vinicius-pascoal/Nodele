"use client";

import { useState } from "react";
import { GameLegend } from "@/components/GameLegend";
import { GuessHistory } from "@/components/GuessHistory";
import { GuessInput } from "@/components/GuessInput";
import { TreeView } from "@/components/TreeView";
import { countUnrevealedHiddenNodes } from "@/lib/tree";
import { createInitialGameState, processGuess } from "@/lib/game";
import type { GameDifficulty, GameState } from "@/types/game";

const panelClass =
  "rounded-[20px] border border-[#3a6280]/63 bg-[#0d2435]/90 p-4 shadow-[0_16px_32px_rgba(4,12,19,0.4)] backdrop-blur-sm";

const difficulties: Array<{ value: GameDifficulty; label: string; hint: string }> = [
  {
    value: "easy",
    label: "Facil",
    hint: "Menos nos ocultos para aquecer.",
  },
  {
    value: "medium",
    label: "Medio",
    hint: "Equilibrado para partidas padrao.",
  },
  {
    value: "hard",
    label: "Dificil",
    hint: "Mais nos ocultos e mais espaco para erro.",
  },
];

export function GameBoard() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>("medium");
  const [activeDifficulty, setActiveDifficulty] = useState<GameDifficulty | null>(null);
  const [state, setState] = useState<GameState | null>(null);

  const startGame = (difficulty: GameDifficulty) => {
    setActiveDifficulty(difficulty);
    setState(createInitialGameState(difficulty));
  };

  const backToMenu = () => {
    setState(null);
    setActiveDifficulty(null);
  };

  if (!state) {
    return (
      <div className="mx-auto my-[18px] w-[94vw] max-w-[980px] sm:my-8 sm:w-[92vw]">
        <section className="animate-in fade-in slide-in-from-bottom-2 rounded-3xl border border-[#3a6280]/65 bg-gradient-to-br from-[#163249]/88 to-[#0d2435]/92 p-5 shadow-[0_18px_40px_rgba(3,10,18,0.45)] sm:p-7">
          <p className="m-0 text-[0.82rem] uppercase tracking-[0.06em] text-[#c8deef]">Puzzle de lógica</p>
          <h1 className="my-2 text-[clamp(2rem,5vw,3.4rem)] leading-none">Nodele</h1>
          <p className="m-0 max-w-[58ch] text-[clamp(1rem,2.6vw,1.12rem)] text-[#c8deef]">
            Escolha a dificuldade para gerar uma fase aleatoria. Quanto maior a dificuldade,
            maior a quantidade de nos ocultos.
          </p>

          <div className="mt-5 grid gap-3">
            {difficulties.map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty.value;

              return (
                <button
                  key={difficulty.value}
                  type="button"
                  onClick={() => setSelectedDifficulty(difficulty.value)}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-left transition ${isSelected
                    ? "border-[#f5d56c] bg-[#f5d56c]/18"
                    : "border-[#3f6987] bg-[#0f2b40]/68 hover:border-[#6ea9d6]"
                    }`}
                >
                  <p className="m-0 text-[1rem] font-semibold">{difficulty.label}</p>
                  <p className="mt-1 mb-0 text-[0.9rem] text-[#c5d9e9]">{difficulty.hint}</p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => startGame(selectedDifficulty)}
            className="mt-5 w-full cursor-pointer rounded-xl bg-gradient-to-br from-[#81f5c2] to-[#56dca6] px-4 py-3 font-bold text-[#08301f] transition hover:brightness-105"
          >
            Iniciar partida
          </button>
        </section>
      </div>
    );
  }

  const lastGuess = state.guesses[state.guesses.length - 1] ?? null;
  const canHighlight = lastGuess?.result === "revealed" || lastGuess?.result === "ghost";
  const remainingHidden = countUnrevealedHiddenNodes(state.tree);

  const submitGuess = (value: number) => {
    setState((current) => {
      if (!current) {
        return current;
      }

      return processGuess(current, value);
    });
  };

  const resetGame = () => {
    if (!activeDifficulty) {
      return;
    }

    setState(createInitialGameState(activeDifficulty));
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
        <div className="flex flex-wrap items-center gap-2 text-[#c8deef]">
          <p className="m-0 text-[clamp(1rem,2.6vw,1.2rem)]">Descubra os nos ocultos da arvore binaria.</p>
          <span className="rounded-full border border-[#4e7896] bg-[#0c2437] px-2.5 py-1 text-[0.82rem] font-semibold uppercase tracking-[0.05em]">
            {activeDifficulty}
          </span>
          <span className="rounded-full border border-[#4e7896] bg-[#0c2437] px-2.5 py-1 text-[0.82rem]">
            {remainingHidden} ocultos restantes
          </span>
        </div>
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
            animationTick={state.guesses.length}
          />

          <div className={statusClass} role="status" aria-live="polite">
            {state.message}
          </div>
        </section>

        <aside className="grid gap-[14px]">
          <section className={panelClass}>
            <h2 className="mb-3 text-[1.08rem]">Jogada</h2>
            <GuessInput disabled={state.status === "won"} onGuess={submitGuess} />
          </section>

          <section className={panelClass}>
            <h2 className="mb-3 text-[1.08rem]">Legenda</h2>
            <GameLegend />
          </section>
          <section className={panelClass}>
            <h2 className="mb-3 text-[1.08rem]">Controles</h2>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                className="w-full cursor-pointer rounded-xl bg-gradient-to-br from-[#81f5c2] to-[#56dca6] px-3.5 py-2.5 font-bold text-[#08301f]"
                onClick={resetGame}
              >
                Nova fase
              </button>
              <button
                type="button"
                className="w-full cursor-pointer rounded-xl border border-[#557a98] bg-[#163249] px-3.5 py-2.5 font-semibold text-[#d8e8f5]"
                onClick={backToMenu}
              >
                Menu inicial
              </button>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
