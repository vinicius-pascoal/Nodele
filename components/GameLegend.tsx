export function GameLegend() {
  return (
    <ul className="m-0 grid list-none gap-2.5 p-0">
      <li className="grid grid-cols-[auto_1fr] items-start gap-2 text-[0.86rem] leading-[1.35] text-[#d7e8f5] sm:items-center sm:text-[0.92rem]">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-[#6ea9d6] bg-linear-to-br from-[#12344b] to-[#0f2a3f] font-mono text-[0.8rem] sm:h-8.5 sm:w-8.5 sm:text-[0.84rem]">
          12
        </span>
        <span>Nó sólido: valor oficial da solução</span>
      </li>
      <li className="grid grid-cols-[auto_1fr] items-start gap-2 text-[0.86rem] leading-[1.35] text-[#d7e8f5] sm:items-center sm:text-[0.92rem]">
        <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-dashed border-[#f5d56c] bg-linear-to-br from-[#1c252e] to-[#111d27] font-mono text-[0.8rem] text-[#ffe8a3] sm:h-8.5 sm:w-8.5 sm:text-[0.84rem]">
          ?
        </span>
        <span>Nó oculto: precisa ser revelado com o valor certo</span>
      </li>
      <li className="grid grid-cols-[auto_1fr] items-start gap-2 text-[0.86rem] leading-[1.35] text-[#d7e8f5] sm:items-center sm:text-[0.92rem]">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-[#8cc4ff]/65 bg-[#8cc4ff]/16 font-mono text-[0.8rem] text-[#cee7ff] sm:h-8.5 sm:w-8.5 sm:text-[0.84rem]">
          35
        </span>
        <span>Nó fantasma: palpite incorreto inserido na BST</span>
      </li>
      <li className="rounded-xl border border-[#3a6280]/60 bg-[#11283b]/65 px-3 py-2 text-[0.85rem] leading-[1.4] text-[#cfe3f2] sm:text-[0.9rem]">
        Valores permitidos para palpites: de 1 a 99.
      </li>
      <li className="rounded-xl border border-[#3a6280]/60 bg-[#11283b]/65 px-3 py-2 text-[0.85rem] leading-[1.4] text-[#cfe3f2] sm:text-[0.9rem]">
        Lógica da árvore: valores menores que o nó atual vão para a esquerda, e valores maiores
        vão para a direita.
      </li>
    </ul>
  );
}
