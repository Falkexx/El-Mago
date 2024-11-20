'use client'
import { useState } from "react";
import ArrowDown from "@/midias/Icons/arrow-down.svg";
import Image from "next/image";

interface FlagInfo {
  flagUrl: string; // URL da bandeira
  locale: string;  // Código do idioma
  currency: string; // Moeda associada
}

// Dados dinâmicos das bandeiras
const Flags: FlagInfo[] = [
  {
    flagUrl: "https://flagcdn.com/w40/br.png",
    locale: "pt",
    currency: "BRL",
  },
  {
    flagUrl: "https://flagcdn.com/w40/us.png",
    locale: "en",
    currency: "USD",
  },
];

function CurrencyBtn() {
  const [selectedFlag, setSelectedFlag] = useState<FlagInfo>(Flags[0]);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar expansão

  // Alternar expansão
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Selecionar uma bandeira
  const selectFlag = (flag: FlagInfo) => {
    setSelectedFlag(flag);
    setIsOpen(false); 
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={toggleDropdown}
        className="h-[30px] px-3 py-1.5 bg-white/5 rounded shadow justify-center items-center gap-2 inline-flex cursor-pointer"
      >
        {/* Bandeira Selecionada */}
        <div className="w-[18px] h-3 relative">
          <img
            src={selectedFlag.flagUrl}
            alt={`Bandeira do país ${selectedFlag.locale}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Código da moeda */}
        <div className="text-white text-sm font-normal font-['Jost'] leading-[17.50px] tracking-tight">
          {selectedFlag.currency}
        </div>

        {/* Ícone de seta */}
        <Image
          src={ArrowDown}
          alt="Abrir dropdown"
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown (expansível) */}
      <div
        className={`absolute left-0 mt-1 w-full bg-white/5 rounded shadow transition-[max-height] duration-300 overflow-hidden ${
          isOpen ? "max-h-40" : "max-h-0"
        }`}
      >
        {Flags.map((flag, index) => (
          <div
            key={index}
            onClick={() => selectFlag(flag)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 cursor-pointer"
          >
            {/* Bandeira */}
            <div className="w-[18px] h-3 relative">
              <img
                src={flag.flagUrl}
                alt={`Bandeira do país ${flag.locale}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Código da moeda */}
            <div className="text-white text-sm font-normal font-['Jost'] leading-[17.50px] tracking-tight">
              {flag.currency}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrencyBtn;
