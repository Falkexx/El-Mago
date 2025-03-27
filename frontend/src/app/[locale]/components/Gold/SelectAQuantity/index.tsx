"use-client";

import { Quantity_datas } from "@/app/data/services/mocked/gold/quantity_datas";
import SelectionBtn from "../../Ui/Buttons/SelectionBtn";
import NumberControl from "../NumberControl";

function SelectAQuantity() {
  return (
    <section className="w-full bg-white bg-opacity-0 rounded-[20px] border border-[#495057] p-6">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-Neutral-100 text-base font-medium">
          Select Quantity
        </h1>

        <div className="flex flex-row w-full justify-between gap-4">
          {/* Seção esquerda */}
          <div className="flex flex-col w-[65%] gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Quantity_datas().map((e, i) => (
                <SelectionBtn
                  id={i}
                  selected={false}
                  title={e.title}
                  type="quantity"
                  value={e.value}
                  key={i}
                />
              ))}
            </div>

            <div>
              <NumberControl value={2000} />
            </div>

            <div className="w-full h-[137px] flex justify-center items-center bg-white bg-opacity-0 rounded-lg border border-[#495057]">
              <div className="flex gap-12">
                <div className="flex flex-col items-center">
                  <span className="text-Neutral-600 text-sm font-normal font-['Jost'] leading-[17.50px]">
                    Amount
                  </span>
                  <span className="text-Neutral-100 text-xl font-bold font-['Jost'] leading-[30px]">
                    2000M
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-Neutral-600 text-sm font-normal font-['Jost'] leading-[17.50px]">
                    Total
                  </span>
                  <span className="text-[#8e33ff] text-xl font-bold font-['Jost'] leading-[30px]">
                    $0.36
                  </span>
                  <span className="text-Neutral-800 text-xs font-normal font-['Jost'] line-through leading-[15px]">
                    $0.40
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-Neutral-600 text-sm font-normal font-['Jost'] leading-[17.50px]">
                    Discount
                  </span>
                  <span className="text-[#8e33ff] text-xl font-bold font-['Jost'] leading-[30px]">
                    -10% off
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção direita (quadrado roxo) */}
          <div className="w-[30%]">
            <div className="w-full h-full bg-white bg-opacity-0 rounded-lg border border-primary-600 p-6 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <article className="flex justify-between items-center">
                  <h1 className="text-Neutral-600 text-sm font-normal leading-[17.50px]">
                    Server
                  </h1>
                  <h2 className="text-Neutral-100 text-sm font-bold leading-[17.50px]">
                    Season 6- Softcore
                  </h2>
                </article>

                <article className="flex justify-between items-center">
                  <h1 className="text-Neutral-600 text-sm font-normal leading-[17.50px]">
                    Delivery Information
                  </h1>
                  <h2 className="text-Neutral-100 text-sm font-bold leading-[17.50px]">
                    Face To Face
                  </h2>
                </article>

                <div className="w-full h-px bg-Neutral-800" />
              </div>

              <div className="flex flex-col gap-4">
                <article className="flex justify-between items-center mt-6">
                  <h1 className="text-Neutral-600 text-sm font-normal leading-[17.50px]">
                    Total
                  </h1>
                  <div className="flex flex-row gap-1 items-center">
                    <span className="text-Neutral-800 text-[10px] font-medium">$0.40</span>
                    <span className="text-primary-600 text-sm font-bold leading-[17.50px]">$0.36</span>
                  </div>
                </article>

                <button className="w-full px-12 py-3 bg-primary-600 rounded-lg shadow-[0px_8px_16px_0px_rgba(125,42,232,0.15)] flex justify-center items-center gap-1.5">
                  Buy now
                </button>

                <button className="w-full px-12 py-3 rounded-lg shadow-[0px_8px_16px_0px_rgba(125,42,232,0.15)] outline outline-1 outline-offset-[-1px] outline-Neutral-800 flex justify-center items-center gap-1.5">
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectAQuantity;