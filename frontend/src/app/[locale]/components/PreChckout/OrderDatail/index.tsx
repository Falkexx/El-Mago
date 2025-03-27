import { Link } from "@/i18n/routing";
import Image, { StaticImageData } from "next/image";
import notActivadeCheckbox from "@/midias/Icons/Checkbox/NotAtivated.svg";
import { FiChevronDown } from "react-icons/fi";

interface Props {
  img_url: StaticImageData;
  server: string;
  price: number;
}
function OrderDetails({ img_url, server, price }: Props) {
  return (
    <section className="w-[424px]  bg-white bg-opacity-0 rounded-2xl border border-Neutral-800">
      <section className="relative">
        <Image
          src={img_url}
          alt="img title"
          className="w-[422px] rounded-tl-2xl rounded-tr-2xl"
        />

        {/* Server sobre a imagem */}
        <div className="absolute bottom-0  px-4 py-2 h-full w-full bg-black/50 rounded-lg text-white text-sm font-semibold">
          {server}
        </div>
      </section>

      <div className="px-6">

        <section className="flex flex-col gap-2 py-6">
          <h1 className="justify-start text-Neutral-100 text-xl font-bold leading-[30px]">
            My plataform
          </h1>

          <div className="flex flex-row gap-4 w-full">
            {/*BOTÃO ATIVADO*/}
            <button className="px-4 py-[9px] bg-primary-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800 inline-flex justify-center items-center gap-2">
              PC
            </button>
            {/*BOTÃO DESATIVADO*/}

            <button className="px-4 py-[9px] bg-Input-Base rounded-lg outline outline-1 outline-offset-[-1px] outline-Neutral-800 inline-flex justify-center items-center gap-2">
              PS
            </button>

            {/*BOTÃO DESATIVADO*/}

            <button className="px-4 py-[9px] bg-Input-Base rounded-lg outline outline-1 outline-offset-[-1px] outline-Neutral-800 inline-flex justify-center items-center gap-2">
              Xbox
            </button>
          </div>
        </section>

        <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-Neutral-800"></div>

        <section className="py-6">
          <h1 className="justify-start text-Neutral-100 text-xl font-bold font-['Jost'] leading-[30px]">
            Boost Method
          </h1>

          <div className="flex flex-row gap-4">
            <button className="px-4 py-[9px] bg-primary-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800 inline-flex justify-center items-center gap-2">
              Lorem Ipsum
            </button>
            <button className="px-4 py-[9px] bg-Input-Base rounded-lg outline outline-1 outline-offset-[-1px] outline-Neutral-800 inline-flex justify-center items-center gap-2">
              Lorem
            </button>
            <button className="px-4 py-[9px] bg-Input-Base rounded-lg outline outline-1 outline-offset-[-1px] outline-Neutral-800 inline-flex justify-center items-center gap-2">
              Ipsum
            </button>
          </div>
        </section>

        <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-Neutral-800"></div>

        <section className="py-6 flex flex-col gap-2">
          <h1 className="text-Neutral-100 text-xl font-bold leading-[30px]">
            Lorem Ipsum
          </h1>

          <div className="w-[376px] px-4 py-[11px] bg-[#222222] rounded-lg outline outline-1 outline-Neutral-800 inline-flex justify-between items-center">
            <span className="text-Neutral-200 text-sm font-normal leading-[17.50px]">
              Dolor
            </span>
            <FiChevronDown className="text-[#f2f5fa] w-[18px] h-[18px]" />
          </div>
        </section>

        <div className="w-full h-0 outline outline-1 outline-Neutral-800"></div>

        <section className="py-6 flex flex-col gap-2">
          <h1 className="text-Neutral-100 text-xl font-bold leading-[30px]">
            Ipsum Lorem
          </h1>

          <div className="w-[376px] px-4 py-[11px] bg-[#222222] rounded-lg outline outline-1 outline-Neutral-800 inline-flex justify-between items-center">
            <span className="text-Neutral-200 text-sm font-normal leading-[17.50px]">
              Sit Amet
            </span>
            <FiChevronDown className="text-[#f2f5fa] w-[18px] h-[18px]" />
          </div>
        </section>

        <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-Neutral-800"></div>

        <section className="py-6 flex flex-col gap-4">
          <h1 className="justify-start text-Neutral-100 text-xl font-bold font-['Jost'] leading-[30px]">
            Checkbox options
          </h1>

          <div className="flex flex-col gap-2">
            <div className="flex w-full flex-row justify-between">
              <article className="flex flex-row gap-2 items-center">
                <Image src={notActivadeCheckbox} alt="checkobx not activaded" />
                <span>Lorem Ipsum</span>
              </article>

              <span className="justify-start text-Neutral-200 text-sm font-normal font-['Jost'] leading-[17.50px]">
                +$22.22
              </span>
            </div>

            <div className="flex w-full flex-row justify-between">
              <article className="flex flex-row gap-2 items-center">
                <Image src={notActivadeCheckbox} alt="checkobx not activaded" />
                <span>Lorem Ipsum</span>
              </article>

              <span className="justify-start text-Neutral-200 text-sm font-normal font-['Jost'] leading-[17.50px]">
                +$22.22
              </span>
            </div>
          </div>
        </section>

        <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-Neutral-800"></div>

        <section className="py-6 flex flex-col gap-8">
          <h1 className="justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">
            $ {price}
          </h1>

          <div className="flex flex-row gap-4">
            <Link
              href="#"
              className="w-[179px] px-12 py-3 bg-primary-600 rounded-lg shadow-[0px_8px_16px_0px_rgba(125,42,232,0.15)] inline-flex justify-center items-center gap-1.5"
            >
              Buy Now
            </Link>
            <Link
              href="#"
              className="w-[179px] px-12 py-3 bg-Input-Base rounded-lg outline outline-1 outline-offset-[-1px] outline-Neutral-800 inline-flex justify-center items-center gap-1.5"
            >
              Add Cart
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}

export default OrderDetails;
