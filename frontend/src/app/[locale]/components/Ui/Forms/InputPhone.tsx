"use client";

import { useState } from "react";
import { useController, Control } from "react-hook-form";
import { PlayerFormData } from "./Affiliate_Player_Register";

interface FlagInfo {
  flagUrl: string;
  locale: string;
  currency: string;
  DDI: string;
}

export const Flags: FlagInfo[] = [
  {
    flagUrl: "https://flagcdn.com/w40/br.png",
    locale: "pt",
    currency: "BRL",
    DDI: "+55",
  },
  {
    flagUrl: "https://flagcdn.com/w40/us.png",
    locale: "en",
    currency: "USD",
    DDI: "+1",
  },
];

interface InputPhoneProps {
  control: Control<PlayerFormData>;
  name: keyof PlayerFormData;
  onPhoneChange: (phone: string) => void; // Nova função para passar o telefone completo
}

function InputPhone({ control, name, onPhoneChange }: InputPhoneProps) {
  const { field } = useController({ name, control });
  const [selectedFlag, setSelectedFlag] = useState<FlagInfo>(Flags[0]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const selectFlag = (flag: FlagInfo) => {
    setSelectedFlag(flag);
    setIsOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value;
    onPhoneChange(`${selectedFlag.DDI} ${phoneNumber}`); 
    field.onChange(phoneNumber); 
  };

  return (
    <div className="relative flex flex-col gap-2">
      <label className="LabelDefault">Phone Number</label>
      <div className="relative flex">
        {/* Bandeira e DDI */}
        <div className="relative flex items-center">
          <div
            onClick={toggleDropdown}
            className="flex items-center cursor-pointer px-3 bg-[#222222] border-t border-b border-l rounded-l-lg border-[#495057] h-full"
          >
            <img
              src={selectedFlag.flagUrl}
              alt={`Flag of ${selectedFlag.locale}`}
              className="w-6 h-4 object-cover"
            />
            <span className="ml-2 text-sm text-white">{selectedFlag.DDI}</span>
          </div>

          {/* Dropdown para selecionar bandeiras */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-[#222222] rounded shadow-lg z-10 ">
              {Flags.map((flag, index) => (
                <div
                  key={index}
                  onClick={() => selectFlag(flag)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={flag.flagUrl}
                    alt={`Flag of ${flag.locale}`}
                    className="w-6 h-4 object-cover"
                  />
                  <span className="text-sm text-gray-700">{flag.DDI}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campo de entrada de telefone */}
        <input
          {...field}
          type="tel"
          className="flex-1 h-11 bg-[#222222] border-t border-b border-r rounded-r-lg border-[#495057] focus:outline-none"
          onChange={handlePhoneChange} 
        />
      </div>
    </div>
  );
}

export default InputPhone;
