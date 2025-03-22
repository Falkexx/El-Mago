interface props {
  id: number;
  title: string;
  value: string | number;
  type: "server" | "quantity";
  selected: boolean;
}

function SelectionBtn({ id, title, type, value, selected }: props) {
  if (type == "server") {
    //Tipo botão não selecionado
    return (
      <button
        className={`h-11 px-4 py-[9px] ${selected ? "bg-[#5d11cc]":"bg-white/0"} rounded-lg border ${selected ? "border-[#5d11cc]":"border-[#343a40]/30"}  text-center`}
        value={value}
      >
        {title}
      </button>
    );
  }else if(type="quantity"){

    return (
      <button
        className={`h-11 px-4 py-[9px] ${selected ? "bg-[#5d11cc]":"bg-white/0"} rounded-lg border ${selected ? "border-[#5d11cc]":"border-[#343a40]/30"}  text-center`}
        value={value}
      >
        {title}
      </button>
    );
      
  }
  

}

export default SelectionBtn;
