'use client'

import { useState, useEffect } from "react";

interface props {
  id: number;
  title: string;
  value: string | number;
  type: "server" | "quantity";
  selected: boolean;
}

function SelectionBtn({ id, title, type, value, selected }: props) {
  const [isSelected, setIsSelected] = useState(selected);

  // Escuta eventos de outros botões para desmarcar este se outro for selecionado
  useEffect(() => {
    const handleOtherSelection = (event: CustomEvent) => {
      if (event.detail !== id) {
        setIsSelected(false); // Desmarca este botão se outro foi selecionado
      }
    };

    window.addEventListener("buttonSelected", handleOtherSelection as EventListener);
    return () => {
      window.removeEventListener("buttonSelected", handleOtherSelection as EventListener);
    };
  }, [id]);

  function handleClick() {
    const newSelectedState = !isSelected;
    setIsSelected(newSelectedState);

    // Dispara um evento customizado para notificar outros botões
    const event = new CustomEvent("buttonSelected", { detail: id });
    window.dispatchEvent(event);

    // Mostra os dados no console
    if (newSelectedState) {
      console.log({ id, title, value, type, selected: true });
    }
  }

  const buttonStyles = `h-11 px-4 py-[9px] ${
    isSelected ? "bg-[#5d11cc]" : "bg-white/0"
  } rounded-lg border ${
    isSelected ? "border-[#5d11cc]" : "border-[#343a40]/30"
  } text-center`;

  if (type === "server") {
    return (
      <button onClick={handleClick} className={buttonStyles} value={value}>
        {title}
      </button>
    );
  } else if (type === "quantity") {
    return (
      <button onClick={handleClick} className={buttonStyles} value={value}>
        {title}
      </button>
    );
  }

  return null;
}

export default SelectionBtn;