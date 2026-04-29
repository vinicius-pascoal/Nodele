"use client";

import { useState } from "react";
import { GameLegend } from "@/components/GameLegend";
import { GuessInput } from "@/components/GuessInput";
import { useLanguage } from "@/components/LanguageProvider";
import { TreeView } from "@/components/TreeView";
import { getDifficultyMaxValue } from "@/lib/challenges";
import { countUnrevealedHiddenNodes } from "@/lib/tree";
import { createInitialGameState, processGuess } from "@/lib/game";
import { localeLabels } from "@/lib/i18n";
import type { GameDifficulty, GameMessage, GameState } from "@/types/game";
import type { Locale, Translations } from "@/lib/i18n";

const panelClass =
  "rounded-[20px] border border-[#3a6280]/63 bg-[#0d2435]/90 p-3 shadow-[0_16px_32px_rgba(4,12,19,0.4)] backdrop-blur-sm sm:p-4";

function formatGameMessage(message: GameMessage | undefined, t: Translations): string {
  if (!message) {
    return "";
  }

  switch (message.key) {
    case "initial":
      return t.game.initialMessage(t.app.difficulty[message.difficulty].label, message.autoBalance);
    case "duplicate":
      return t.game.duplicate;
    case "revealed":
      return t.game.revealed;
    case "ghost":
      return t.game.ghost;
    case "won":
      return t.game.won;
    default:
      return "";
  }
}

function LanguageSelect() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <label className="grid gap-1 text-right text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#d4e6f4] max-sm:text-left">
      <span>{t.app.languageLabel}</span>
      <select
        aria-label={t.app.languageLabel}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="rounded-xl border border-[#4e7896] bg-[#0c2437] px-3 py-2 text-[0.9rem] font-semibold text-[#e8f1f7] outline-none transition focus:border-[#f5d56c]"
      >
        <option value="pt">
          {localeLabels.pt.flag} {localeLabels.pt.code}
        </option>
        <option value="en">
          {localeLabels.en.flag} {localeLabels.en.code}
        </option>
        <option value="es">
          {localeLabels.es.flag} {localeLabels.es.code}
        </option>
      </select>
    </label>
  );
}

export function GameBoard() {
  const { t } = useLanguage();
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>("medium");
  const [selectedAutoBalance, setSelectedAutoBalance] = useState(true);
  const [activeDifficulty, setActiveDifficulty] = useState<GameDifficulty | null>(null);
  const [activeAutoBalance, setActiveAutoBalance] = useState(true);
  const [state, setState] = useState<GameState | null>(null);

  const difficulties: Array<{ value: GameDifficulty; label: string; hint: string }> = [
    {
      value: "easy",
      label: t.app.difficulty.easy.label,
      hint: t.app.difficulty.easy.hint,
    },
    {
      value: "medium",
      label: t.app.difficulty.medium.label,
      hint: t.app.difficulty.medium.hint,
    },
    {
      value: "hard",
      label: t.app.difficulty.hard.label,
      hint: t.app.difficulty.hard.hint,
    },
    {
      value: "brutal",
      label: t.app.difficulty.brutal.label,
      hint: t.app.difficulty.brutal.hint,
    },
  ];

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
      <div className="mx-auto my-4.5 w-[94vw] max-w-245 sm:my-8 sm:w-[92vw]">
        <section className="ui-enter-rise rounded-3xl border border-[#3a6280]/65 bg-linear-to-br from-[#163249]/88 to-[#0d2435]/92 p-4 shadow-[0_18px_40px_rgba(3,10,18,0.45)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="ui-enter-right my-2 text-[clamp(2rem,5vw,3.4rem)] leading-none">{t.app.title}</h1>
              <p className="m-0 max-w-[58ch] text-[clamp(1rem,2.6vw,1.12rem)] text-[#c8deef]">
                {t.app.intro}
              </p>
            </div>

            <LanguageSelect />
          </div>

          <div className="mt-6 grid gap-4 sm:gap-5">
            <section className="ui-enter-rise ui-enter-delay-1 rounded-2xl border border-[#3f6987]/80 bg-[#0f2b40]/62 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="m-0 text-[0.98rem] font-semibold text-[#e7f2fb]">{t.app.difficultyTitle}</h2>
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
                <h2 className="m-0 text-[0.98rem] font-semibold text-[#e7f2fb]">{t.app.settingsTitle}</h2>
              </div>

              <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#3f6987] bg-[#0f2b40]/68 px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="m-0 text-[0.95rem] font-semibold text-[#e7f2fb]">{t.app.autoBalanceLabel}</p>
                    <span className="group relative inline-flex">
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label={t.app.autoBalanceInfo}
                        className="grid h-5 w-5 place-items-center rounded-full border border-[#5a85a6] bg-[#163249] text-[0.72rem] font-bold text-[#d8e8f5]"
                      >
                        ?
                      </button>
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-10 w-[calc(100vw-2rem)] max-w-62.5 rounded-xl border border-[#5a85a6] bg-[#0a2233] px-3 py-2 text-[0.76rem] leading-[1.35] text-[#deedf8] opacity-0 shadow-[0_12px_24px_rgba(2,8,14,0.55)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                      >
                        {t.app.autoBalanceHint}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={selectedAutoBalance}
                  aria-label={t.app.autoBalanceAria}
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
            className="ui-enter-rise ui-enter-delay-3 mt-5 w-full cursor-pointer rounded-xl bg-linear-to-br from-[#81f5c2] to-[#56dca6] px-4 py-3 font-bold text-[#08301f] transition hover:brightness-105"
          >
            {t.app.startGame}
          </button>
        </section>
      </div>
    );
  }

  const lastGuess = state.guesses[state.guesses.length - 1] ?? null;
  const canHighlight = lastGuess?.result === "revealed" || lastGuess?.result === "ghost";
  const remainingHidden = countUnrevealedHiddenNodes(state.tree);
  const maxGuessValue = getDifficultyMaxValue(activeDifficulty ?? selectedDifficulty);

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
  const currentMessage = formatGameMessage(state.message, t);

  return (
    <div className="mx-auto my-4.5 w-[94vw] max-w-300 sm:my-8 sm:w-[92vw]">
      <header className="ui-enter-rise rounded-3xl border border-[#3a6280]/65 bg-linear-to-br from-[#163249]/88 to-[#0d2435]/92 px-4 py-4.5 shadow-[0_18px_40px_rgba(3,10,18,0.45)] sm:px-6 sm:py-6.5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="my-2 text-[clamp(2rem,5vw,3.5rem)] leading-none">{t.app.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-[#c8deef]">
              <p className="m-0 text-[clamp(1rem,2.6vw,1.2rem)]">{t.app.boardTitle}</p>
              <span className="rounded-full border border-[#4e7896] bg-[#0c2437] px-2.5 py-1 text-[0.82rem] font-semibold uppercase tracking-wider">
                {activeDifficulty ? t.app.difficulty[activeDifficulty].label : ""}
              </span>
              <span className="rounded-full border border-[#4e7896] bg-[#0c2437] px-2.5 py-1 text-[0.82rem]">
                {remainingHidden} {t.app.remainingHidden}
              </span>
              <span className="rounded-full border border-[#4e7896] bg-[#0c2437] px-2.5 py-1 text-[0.82rem]">
                {t.app.autoBalanceLabel}: {state.autoBalance ? t.app.autoBalanceOn : t.app.autoBalanceOff}
              </span>
            </div>
          </div>

          <LanguageSelect />
        </div>
      </header>

      <main className="mt-4.5 grid items-start gap-3.5 sm:gap-4.5 lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,1fr)]">
        <section className={`${panelClass} ui-enter-rise ui-enter-delay-1 flex min-h-90 min-w-0 flex-col lg:min-h-125 max-sm:min-h-0`}>
          <div className={statusClass} role="status" aria-live="polite">
            {currentMessage}
          </div>

          <TreeView
            tree={state.tree}
            highlightValue={canHighlight ? (lastGuess?.value ?? null) : null}
            highlightKind={highlightKind}
            animationTick={state.guesses.length}
            canExport={state.status === "won"}
          />
        </section>

        <aside className="ui-enter-right ui-enter-delay-2 grid gap-3.5">
          <section className={`${panelClass} ui-enter-rise ui-enter-delay-2`}>
            <h2 className="mb-3 text-[1.08rem]">{t.app.moveTitle}</h2>
            <GuessInput disabled={state.status === "won"} maxValue={maxGuessValue} onGuess={submitGuess} />
          </section>

          <section className={`${panelClass} ui-enter-rise ui-enter-delay-3`}>
            <h2 className="mb-3 text-[1.08rem]">{t.app.legendTitle}</h2>
            <GameLegend maxValue={maxGuessValue} />
          </section>

          <section className={`${panelClass} ui-enter-rise ui-enter-delay-4`}>
            <h2 className="mb-3 text-[1.08rem]">{t.app.controlsTitle}</h2>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                className="w-full cursor-pointer rounded-xl bg-linear-to-br from-[#81f5c2] to-[#56dca6] px-3.5 py-2.5 font-bold text-[#08301f] max-sm:text-[0.95rem]"
                onClick={resetGame}
              >
                {t.app.newPhase}
              </button>
              <button
                type="button"
                className="w-full cursor-pointer rounded-xl border border-[#557a98] bg-[#163249] px-3.5 py-2.5 font-semibold text-[#d8e8f5] max-sm:text-[0.95rem]"
                onClick={backToMenu}
              >
                {t.app.menuInitial}
              </button>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
