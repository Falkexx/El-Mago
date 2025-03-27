import Image, { StaticImageData } from "next/image";
import WitcherImg from "@/midias/witcher_Standed.png";

interface Props {
  title: string;
  description: string;
  optional_img?: StaticImageData;
}

function WitcherHead({ title, description, optional_img }: Props) {
  return (
    <section className="w-full items-center flex flex-row gap-10">
      <div>
        <Image src={WitcherImg} alt="Witcher" className="w-60 h-60" />
      </div>

      <article className="flex flex-col gap-4">
        <h1 className="text-[#f8f9fa] text-3xl font-bold leading-9">{title}</h1>
        <p className="text-[#ced4da] text-sm font-normal leading-6">{description}</p>

        {optional_img && <Image src={optional_img} alt={title} className="mt-8" />} {/* Renderiza somente se existir */}
      </article>
    </section>
  );
}

export default WitcherHead;
