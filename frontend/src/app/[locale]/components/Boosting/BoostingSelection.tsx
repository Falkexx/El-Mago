'use client'

import { useState, useEffect } from "react";

interface props {
  id: number;
  title: string;
  value: string | number;
  selected: boolean;
}

function BoostingSelection({ id, title, value, selected }: props) {
  const [isSelected, setIsSelected] = useState(selected);

  useEffect(() => {
    const handleOtherSelection = (event: CustomEvent) => {
      if (event.detail !== id) {
        setIsSelected(false);
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

    const event = new CustomEvent("buttonSelected", { detail: id });
    window.dispatchEvent(event);

    if (newSelectedState) {
      console.log({ id, title, value, selected: true });
    }
  }

  const buttonStyles = `h-11 px-4 py-[9px] ${
    isSelected ? "bg-[#5d11cc]" : "bg-white/0"
  } rounded-lg border ${
    isSelected ? "border-[#5d11cc]" : "border-[#343a40]/30"
  } text-center`;

  return (
    <button onClick={handleClick} className={buttonStyles} value={value}>
      {title}
    </button>
  );
}

export default BoostingSelection;