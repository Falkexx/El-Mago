import Image from "next/image";
import Link from "next/link";
import rightArrow from "@/midias/Icons/CardIcons/rightArrow.svg";
interface HomeCardProps {
  icon: string;
  title: string;
  description: string;
  btnContent: string;
  btnUrl:string
}

function HomeCard({ icon, title, description, btnContent, btnUrl }: HomeCardProps) {
  return (
    <section className="w-1/4 h-40 bg-white rounded-2xl shadow">
      <section className="w-full h-[42px] px-6 py-[9px] bg-gradient-to-br from-[#6a00f4] to-[#480e9d] rounded-tl-2xl rounded-tr-2xl flex flex-row justify-start items-center gap-2.5 ">
        <i>
          <Image src={icon} alt={title} />
        </i>

        <span className="text-[#f8f9fa] text-base font-bold font-['Jost'] leading-normal">
          {title}
        </span>
      </section>

      <section className="w-full px-6 py-4 flex flex-col gap-6">
        <article>
          <p className="text-[#343a40] text-sm font-medium leading-[17.50px]">
            {description}
          </p>
        </article>

        {/* CARD BTN*/}
        <Link
          href={btnUrl}
          className="group h-[30px] pl-4 pr-3 py-1.5 rounded-[40px] border border-[#6a00f4] justify-center items-center inline-flex  hover:scale-105 transition-transform duration-300 ease-out w-fit "
        >
          <span className="text-primary-900 text-sm font-medium font-['Jost'] leading-[17.50px] tracking-tight">
            {btnContent}
          </span>

          <Image
            src={rightArrow}
            alt="right arrow"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          />
        </Link>
      </section>
    </section>
  );
}

export default HomeCard;
