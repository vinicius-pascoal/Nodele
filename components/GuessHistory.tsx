import type { Guess } from "@/types/game";

type GuessHistoryProps = {
  guesses: Guess[];
};

function resultLabel(result: Guess["result"]): string {
  if (result === "revealed") {
    return "revelado";
  }

  if (result === "ghost") {
    return "nó fantasma";
  }

  return "valor repetido";
}

function resultClass(result: Guess["result"]): string {
  if (result === "revealed") {
    return "rounded-full border border-emerald-300/60 bg-emerald-300/20 px-2.5 py-0.5 text-[0.78rem] text-emerald-100";
  }

  if (result === "ghost") {
    return "rounded-full border border-sky-300/55 bg-sky-300/16 px-2.5 py-0.5 text-[0.78rem] text-sky-100";
  }

  return "rounded-full border border-rose-300/48 bg-rose-300/16 px-2.5 py-0.5 text-[0.78rem] text-rose-100";
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  if (guesses.length === 0) {
    return <p className="m-0 text-[0.94rem] text-[#c5daea]">Nenhum palpite ainda.</p>;
  }

  const ordered = [...guesses].reverse();

  return (
    <ul className="m-0 grid max-h-[200px] list-none gap-2 overflow-auto p-0">
      {ordered.map((guess, index) => (
        <li
          key={`${guess.value}-${guess.createdAt.toISOString()}-${index}`}
          className="flex items-center justify-between gap-2 rounded-[10px] border border-[#3a6280]/55 bg-[#163249]/62 px-2.5 py-2"
        >
          <span className="font-mono font-bold">{guess.value}</span>
          <span className={resultClass(guess.result)}>{resultLabel(guess.result)}</span>
        </li>
      ))}
    </ul>
  );
}
