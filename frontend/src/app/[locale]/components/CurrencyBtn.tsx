"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import nookies from "nookies";
import Image from "next/image";
import { useLocale } from "next-intl";
import arrowDonw from '@/midias/Icons/arrow-down.svg'


interface FlagInfo {
  flagUrl: string;
  locale: string;
  currency: string;
}

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
  const locale = useLocale();
  const router = useRouter();
  const [selectedFlag, setSelectedFlag] = useState<FlagInfo>(
    Flags.find((flag) => flag.locale === locale) || Flags[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [pathName, setPathName] = useState<string>("");
  const pathnameURL = usePathname()


  // Sincronizar a bandeira selecionada com o locale atual
  useEffect(() => {
    const matchingFlag = Flags.find((flag) => flag.locale === locale);
    if (matchingFlag) {
      setSelectedFlag(matchingFlag);
    }
  }, [locale]);

  // Obter o pathName no cliente
  useEffect(() => {
    setPathName(pathnameURL);

  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const selectFlag = (flag: FlagInfo) => {
    setSelectedFlag(flag);
    setIsOpen(false);

    // Atualizar o cookie com o novo idioma
    nookies.set(null, "NEXT_LOCALE", flag.locale, {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: "/",
    });

    // Montar a nova URL com o novo idioma
    const segments = pathName.split("/").filter(Boolean); // Dividir e limpar segmentos
    if (Flags.some((f) => f.locale === segments[0])) {
      segments[0] = flag.locale; // Substituir o locale na rota
    } else {
      segments.unshift(flag.locale); // Adicionar o locale ao início se não estiver presente
    }

    // Redirecionar para a nova URL
    const newPath = `/${segments.join("/")}`;
    router.push(newPath);
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={toggleDropdown}
        className="h-[30px] px-3 py-1.5 bg-white/5 rounded shadow justify-center items-center gap-2 inline-flex cursor-pointer"
      >
        <div className="w-[18px] h-3 relative">
          <img
            src={selectedFlag.flagUrl}
            alt={`Bandeira do país ${selectedFlag.locale}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white text-sm font-normal font-['Jost'] leading-[17.50px] tracking-tight">
          {selectedFlag.currency}
        </div>
        <Image
          src={arrowDonw}
          alt="Abrir dropdown"
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
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
            <div className="w-[18px] h-3 relative">
              <img
                src={flag.flagUrl}
                alt={`Bandeira do país ${flag.locale}`}
                className="w-full h-full object-cover"
              />
            </div>
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
