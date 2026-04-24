export function GameLegend() {
  return (
    <ul className="m-0 grid list-none gap-2.5 p-0">
      <li className="grid grid-cols-[auto_1fr] items-center gap-2 text-[0.92rem] text-[#d7e8f5]">
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full border border-[#6ea9d6] bg-gradient-to-br from-[#12344b] to-[#0f2a3f] font-mono text-[0.84rem]">
          12
        </span>
        <span>Nó sólido: valor oficial da solução</span>
      </li>
      <li className="grid grid-cols-[auto_1fr] items-center gap-2 text-[0.92rem] text-[#d7e8f5]">
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full border-2 border-dashed border-[#f5d56c] bg-gradient-to-br from-[#1c252e] to-[#111d27] font-mono text-[0.84rem] text-[#ffe8a3]">
          ?
        </span>
        <span>Nó oculto: precisa ser revelado com o valor certo</span>
      </li>
      <li className="grid grid-cols-[auto_1fr] items-center gap-2 text-[0.92rem] text-[#d7e8f5]">
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full border border-dashed border-[#8cc4ff]/65 bg-[#8cc4ff]/16 font-mono text-[0.84rem] text-[#cee7ff]">
          35
        </span>
        <span>Nó fantasma: palpite incorreto inserido na BST</span>
      </li>
    </ul>
  );
}
