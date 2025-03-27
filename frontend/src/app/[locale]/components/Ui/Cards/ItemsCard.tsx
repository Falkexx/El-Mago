'use client'
import { StaticImageData } from "next/image";
import Image from "next/image";
import { useState } from "react";

interface Props {
  img_src: StaticImageData;
  title: string;
  price: number;
}

function ItemsCard({ img_src, title, price }: Props) {
  const [count, setCount] = useState(1);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <section className="py-4 px-6 w-[194px] bg-white bg-opacity-5 rounded">
      <div className="flex flex-col gap-2 w-full">
        <Image className="w-[82px] h-[82px] mx-auto" src={img_src} alt={title} />

        <article className="w-full flex flex-col gap-2">
          <h1 className="w-full text-center justify-start text-Neutral-500 text-sm font-semibold leading-[17.50px]">
            {title}
          </h1>
          <span className="text-center text-primary-500 text-base font-semibold leading-tight">
            $ {price.toFixed(3)}
          </span>
        </article>
      </div>

      <div className="mt-4 mb-6 flex items-center justify-center gap-3 border border-Neutral-800 px-3 py-1 rounded-md">
        <button className="text-lg font-bold" onClick={decrement}>-</button>
        <span className="text-lg font-semibold">{count}</span>
        <button className="text-lg font-bold" onClick={increment}>+</button>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button className="w-full px-8 py-[9px] bg-primary-600 rounded shadow-[0px_8px_16px_0px_rgba(125,42,232,0.15)] inline-flex justify-center items-center gap-1.5">
          Buy Now
        </button>
        <button className="w-full px-8 py-[9px] bg-Input-Base rounded inline-flex justify-center items-center gap-1.5">
          Add To Cart
        </button>
      </div>
    </section>
  );
}

export default ItemsCard;
