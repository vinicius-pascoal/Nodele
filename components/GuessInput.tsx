"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type GuessInputProps = {
  disabled?: boolean;
  maxValue: number;
  onGuess: (value: number) => void;
};

export function GuessInput({ disabled = false, maxValue, onGuess }: GuessInputProps) {
  const { t } = useLanguage();
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

    if (parsed < 1 || parsed > maxValue) {
      return;
    }

    onGuess(parsed);
    setValue("");
  };

  return (
    <form className="grid gap-2" onSubmit={submit}>
      <label htmlFor="guess-input" className="text-[0.9rem] text-[#d3e5f3] sm:text-[0.95rem]">
        {t.guessInput.label}
      </label>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input
          id="guess-input"
          type="number"
          inputMode="numeric"
          min={1}
          max={maxValue}
          step={1}
          className="guess-number-input w-full rounded-xl border border-[#4f7390] bg-[#071825] px-3 py-2.5 text-base text-[#e6f2fb] placeholder:text-[#88a9c0] focus:border-[#f5d56c] focus:outline-none focus:ring-3 focus:ring-[#f5d56c]/20"
          placeholder={t.guessInput.placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          required
        />
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-linear-to-br from-[#f5d56c] to-[#f0b63f] px-4 py-2.5 font-bold text-[#102434] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          disabled={disabled}
        >
          {t.guessInput.submit}
        </button>
      </div>
    </form>
  );
}
