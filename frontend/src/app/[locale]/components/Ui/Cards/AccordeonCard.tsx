'use client'

import Image from "next/image";
import InterrogationIcon from "@/midias/Interrogation.svg";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

interface AccordeonProps {
  id: number
  title: string;
  description: string;
}

function AccordeonCard({ title, description, id }: AccordeonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article
      className={`w-full overflow-hidden rounded-[5px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)] border border-[#dee2e6] px-3 cursor-pointer ease-in-out transition-all mb-4 ${
        isOpen ? "h-fit" : "h-12"
      }`}
      onClick={() => setIsOpen(!isOpen)}

      key={id}
    >
      <section className="w-full">
        <section className="w-full h-12 flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            <div>
              <Image
                src={InterrogationIcon}
                alt="Interogation Icon"
                className=""
              />
            </div>
            <h1 className="text-[#111111] text-base font-normal leading-normal tracking-tight">
              {title}
            </h1>
          </div>

          <div className={`text-[#6a00f4] h-fit w-fit transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}>
            <i className={`text-[#6a00f4]`}>
              <IoIosArrowDown />
            </i>
          </div>
        </section>
      </section>

      {/* Conteúdo Animado */}
      <div
        className={`transition-[opacity,height] ease-in-out duration-300 ${
          isOpen ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
        }`}
      >
        <p className="my-2 opacity-80 text-[#111111] text-sm font-normal leading-4">{description}</p>
      </div>
    </article>
  );
}


export default AccordeonCard;
