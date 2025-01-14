import Image from "next/image";
import { useState } from "react";
import Trash_Can from "@/midias/bag (1).svg";

function Product_Shopping_Cart() {
  const [quantity, setQuantity] = useState(1); // Estado para a quantidade do produto

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <section className="flex gap-4  justify-between rounded-lg h-20 ">
      {/* Imagem do Produto */}

      <section className="flex flex-row items-center w-3/4 h-20 gap-4">
        <section>
          <div className="w-20 h-20 bg-[#d9d9d9] rounded-lg"></div>
        </section>

        {/* Informações do Produto */}
        <article className="flex flex-col justify-between h-20  ">
          <h1 className="text-black text-sm font-normal leading-[17.50px]">
            Diablo IV Gold Season 6 - Softcore 2000M
          </h1>

          {/* Contador do Produto */}
          <div className="flex items-center justify-between">
            {/* Botão de Decremento */}
            <button
              onClick={decrementQuantity}
              className="w-[18px] h-[18px] bg-[#f5f5f5] flex items-center justify-center font-bold text-gray-700"
            >
              -
            </button>

            {/* Quantidade */}
            <span className="text-center w-full h-[18px] bg-[#f5f5f5] text-[#111111] text-sm font-normal leading-[17.50px]">
              {quantity}
            </span>

            {/* Botão de Incremento */}
            <button
              onClick={incrementQuantity}
              className="w-[18px] h-[18px] bg-[#f5f5f5] flex items-center justify-center text-gray-700"
            >
              +
            </button>
          </div>
        </article>
      </section>

      {/* Preço e Ícone de Lixeira */}
      <div className="flex flex-col items-center gap-2 h-20  justify-between">
        <button>
          <Image src={Trash_Can} alt="lixeira" width={24} height={24} />
        </button>

        <span className="text-[#6a00f4] text-sm font-bold font-['Jost'] leading-[17.50px]">
          $0.36
        </span>
      </div>
    </section>
  );
}

export default Product_Shopping_Cart;
