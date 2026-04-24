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
    return "history-pill history-pill-hit";
  }

  if (result === "ghost") {
    return "history-pill history-pill-ghost";
  }

  return "history-pill history-pill-duplicate";
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  if (guesses.length === 0) {
    return <p className="panel-empty">Nenhum palpite ainda.</p>;
  }

  const ordered = [...guesses].reverse();

  return (
    <ul className="history-list">
      {ordered.map((guess, index) => (
        <li key={`${guess.value}-${guess.createdAt.toISOString()}-${index}`} className="history-item">
          <span className="history-value">{guess.value}</span>
          <span className={resultClass(guess.result)}>{resultLabel(guess.result)}</span>
        </li>
      ))}
    </ul>
  );
}
