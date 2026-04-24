"use client";

import { FormEvent, useState } from "react";

type GuessInputProps = {
  disabled?: boolean;
  onGuess: (value: number) => void;
};

export function GuessInput({ disabled = false, onGuess }: GuessInputProps) {
  const [value, setValue] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      return;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return;
    }

    onGuess(parsed);
    setValue("");
  };

  return (
    <form className="guess-form" onSubmit={submit}>
      <label htmlFor="guess-input" className="guess-label">
        Seu palpite
      </label>
      <div className="guess-controls">
        <input
          id="guess-input"
          type="number"
          inputMode="numeric"
          className="guess-input"
          placeholder="Ex.: 30"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          required
        />
        <button type="submit" className="guess-button" disabled={disabled}>
          Inserir
        </button>
      </div>
    </form>
  );
}
