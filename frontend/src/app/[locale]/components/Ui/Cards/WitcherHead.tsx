import Image from "next/image";
import WitcherImg from "@/midias/witcher_Standed.png"

interface props {

  title: string
  description: string
}

function WitcherHead({title, description}:props) {
  return ( 

    <section className="w-full items-center flex flex-row gap-10">
        <div>
          <Image src={WitcherImg} alt="Witcher" className="w-60 h-60"/>
        </div>

        <article className="flex flex-col gap-4">
          <h1 className="text-[#f8f9fa] text-3xl font-bold leading-9">{title}</h1>
          <p className="text-[#ced4da] text-sm font-normal leading-6">{description}</p>
        </article>
        
    </section>
   );
}

export default WitcherHead;