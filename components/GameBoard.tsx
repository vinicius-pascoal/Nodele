"use client";

import { useState } from "react";
import { GameLegend } from "@/components/GameLegend";
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
  {
    value: "brutal",
    label: "Brutal",
    hint: "Comeca com 8 nos ocultos e nenhum no visivel.",
  },
];

export function GameBoard() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>("medium");
  const [selectedAutoBalance, setSelectedAutoBalance] = useState(true);
  const [activeDifficulty, setActiveDifficulty] = useState<GameDifficulty | null>(null);
  const [activeAutoBalance, setActiveAutoBalance] = useState(true);
  const [state, setState] = useState<GameState | null>(null);

  const startGame = (difficulty: GameDifficulty, autoBalance: boolean) => {
    setActiveDifficulty(difficulty);
    setActiveAutoBalance(autoBalance);
    setState(createInitialGameState(difficulty, { autoBalance }));
  };

  const backToMenu = () => {
    setState(null);
    setActiveDifficulty(null);
  };

  if (!state) {
    return (
      <div className="mx-auto my-[18px] w-[94vw] max-w-[980px] sm:my-8 sm:w-[92vw]">
        <section className="ui-enter-rise rounded-3xl border border-[#3a6280]/65 bg-gradient-to-br from-[#163249]/88 to-[#0d2435]/92 p-5 shadow-[0_18px_40px_rgba(3,10,18,0.45)] sm:p-7">
          <h1 className="ui-enter-right my-2 text-[clamp(2rem,5vw,3.4rem)] leading-none">Nodele</h1>
          <p className="m-0 max-w-[58ch] text-[clamp(1rem,2.6vw,1.12rem)] text-[#c8deef]">
            Escolha a dificuldade para gerar uma fase aleatoria. Quanto maior a dificuldade,
            maior a quantidade de nos ocultos.
          </p>

          <div className="mt-6 grid gap-4 sm:gap-5">
            <section className="ui-enter-rise ui-enter-delay-1 rounded-2xl border border-[#3f6987]/80 bg-[#0f2b40]/62 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="m-0 text-[0.98rem] font-semibold text-[#e7f2fb]">Dificuldade</h2>
              </div>

              <div className="grid gap-3">
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
            </section>

            <section className="ui-enter-rise ui-enter-delay-2 rounded-2xl border border-[#4a7390]/80 bg-[#10263a]/64 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="m-0 text-[0.98rem] font-semibold text-[#e7f2fb]">Configuracoes da partida</h2>
              </div>

              <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#3f6987] bg-[#0f2b40]/68 px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="m-0 text-[0.95rem] font-semibold text-[#e7f2fb]">Auto balancear arvore</p>
                    <span className="group relative inline-flex">
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label="Explicacao do auto balanceamento"
                        className="grid h-5 w-5 place-items-center rounded-full border border-[#5a85a6] bg-[#163249] text-[0.72rem] font-bold text-[#d8e8f5]"
                      >
                        ?
                      </button>
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-10 w-[250px] rounded-xl border border-[#5a85a6] bg-[#0a2233] px-3 py-2 text-[0.76rem] leading-[1.35] text-[#deedf8] opacity-0 shadow-[0_12px_24px_rgba(2,8,14,0.55)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                      >
                        Ligado: a arvore e reorganizada apos cada jogada para ficar mais equilibrada. Desligado: a estrutura cresce naturalmente como BST.
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={selectedAutoBalance}
                  aria-label="Alternar auto balanceamento"
                  onClick={() => setSelectedAutoBalance((current) => !current)}
                  className={`relative h-8 w-14 shrink-0 cursor-pointer overflow-hidden rounded-full border transition-colors ${selectedAutoBalance
                    ? "border-[#7ee9b8] bg-[#1d6f4f]"
                    : "border-[#5d7f99] bg-[#173449]"
                    }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-[#ecf5fc] shadow-[0_2px_8px_rgba(1,10,18,0.45)] transition-transform ${selectedAutoBalance ? "translate-x-7" : "translate-x-0"
                      }`}
                  />
                </button>
              </label>
            </section>
          </div>

          <button
            type="button"
            onClick={() => startGame(selectedDifficulty, selectedAutoBalance)}
            className="ui-enter-rise ui-enter-delay-3 mt-5 w-full cursor-pointer rounded-xl bg-gradient-to-br from-[#81f5c2] to-[#56dca6] px-4 py-3 font-bold text-[#08301f] transition hover:brightness-105"
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

    setState(createInitialGameState(activeDifficulty, { autoBalance: activeAutoBalance }));
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
      <header className="ui-enter-rise rounded-3xl border border-[#3a6280]/65 bg-gradient-to-br from-[#163249]/88 to-[#0d2435]/92 px-4 py-[18px] shadow-[0_18px_40px_rgba(3,10,18,0.45)] sm:px-6 sm:py-[26px]">
        <h1 className="my-2 text-[clamp(2rem,5vw,3.5rem)] leading-none">Nodele</h1>
        <div className="flex flex-wrap items-center gap-2 text-[#c8deef]">
          <p className="m-0 text-[clamp(1rem,2.6vw,1.2rem)]">Descubra os nos ocultos da arvore binaria.</p>
          <span className="rounded-full border border-[#4e7896] bg-[#0c2437] px-2.5 py-1 text-[0.82rem] font-semibold uppercase tracking-[0.05em]">
            {activeDifficulty}
          </span>
          <span className="rounded-full border border-[#4e7896] bg-[#0c2437] px-2.5 py-1 text-[0.82rem]">
            {remainingHidden} ocultos restantes
          </span>
          <span className="rounded-full border border-[#4e7896] bg-[#0c2437] px-2.5 py-1 text-[0.82rem]">
            Auto balancear: {state.autoBalance ? "on" : "off"}
          </span>
        </div>
      </header>

      <main className="mt-[18px] grid items-start gap-[18px] lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,1fr)]">
        <section className={`${panelClass} ui-enter-rise ui-enter-delay-1 flex min-h-[430px] flex-col lg:min-h-[500px]`}>
          <div className={statusClass} role="status" aria-live="polite">
            {state.message}
          </div>

          <TreeView
            tree={state.tree}
            highlightValue={canHighlight ? (lastGuess?.value ?? null) : null}
            highlightKind={highlightKind}
            animationTick={state.guesses.length}
            canExport={state.status === "won"}
          />


        </section>

        <aside className="ui-enter-right ui-enter-delay-2 grid gap-[14px]">
          <section className={`${panelClass} ui-enter-rise ui-enter-delay-2`}>
            <h2 className="mb-3 text-[1.08rem]">Jogada</h2>
            <GuessInput disabled={state.status === "won"} onGuess={submitGuess} />
          </section>

          <section className={`${panelClass} ui-enter-rise ui-enter-delay-3`}>
            <h2 className="mb-3 text-[1.08rem]">Legenda</h2>
            <GameLegend />
          </section>
          <section className={`${panelClass} ui-enter-rise ui-enter-delay-4`}>
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
