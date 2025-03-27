"use client";
import { useState } from "react";
import Image from "next/image";
import activatedCheckbox from "@/midias/Icons/Checkbox/Activated.svg";
import notActivatedCheckbox from "@/midias/Icons/Checkbox/NotAtivated.svg";

interface Props {
  title: string;
  options: string[];
}

function ItemsSections({ title, options }: Props) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(options.map((option) => [option, false]))
  );

  const toggleCheckbox = (option: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <section className="w-full py-4 px-6 bg-white bg-opacity-0 rounded-[10px] border border-Neutral-800">
      <section className="flex flex-col gap-4">
        <h1 className="text-Neutral-100 text-base font-medium leading-normal">
          {title}
        </h1>

        <div className="flex flex-row w-full gap-28 flex-wrap">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleCheckbox(option)}
            >
              <Image
                src={
                  checkedItems[option]
                    ? activatedCheckbox
                    : notActivatedCheckbox
                }
                alt={option}
              />
              <span
                className={`text-sm leading-[17.50px] ${
                  checkedItems[option] ? "text-primary-500" : "text-Neutral-600"
                }`}
              >
                {option}
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

export default ItemsSections;
