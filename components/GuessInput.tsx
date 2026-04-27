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

    if (parsed < 1 || parsed > 99) {
      return;
    }

    onGuess(parsed);
    setValue("");
  };

  return (
    <form className="grid gap-2" onSubmit={submit}>
      <label htmlFor="guess-input" className="text-[0.95rem] text-[#d3e5f3]">
        Seu palpite
      </label>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input
          id="guess-input"
          type="number"
          inputMode="numeric"
          min={1}
          max={99}
          step={1}
          className="guess-number-input rounded-xl border border-[#4f7390] bg-[#071825] px-3 py-2.5 text-base text-[#e6f2fb] placeholder:text-[#88a9c0] focus:border-[#f5d56c] focus:outline-none focus:ring-3 focus:ring-[#f5d56c]/20"
          placeholder="Ex.: 30"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          required
        />
        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-gradient-to-br from-[#f5d56c] to-[#f0b63f] px-4 py-2.5 font-bold text-[#102434] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        >
          Inserir
        </button>
      </div>
    </form>
  );
}
