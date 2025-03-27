import { Link } from "@/i18n/routing";
import Image, { StaticImageData } from "next/image";

interface Props {
  title: string;
  item_description: string[];
  price: number;
  img_url: StaticImageData | string;
}

function BoostingItemsCard({ title, item_description, price, img_url }: Props) {
  return (
    <section className="w-56 relative bg-[linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.03) 100%), var(--Neutral-Default, #111)] bg-white bg-opacity-5 rounded">
      <div className="relative w-56 h-[212px]">
        <Image src={img_url} alt={title} layout="fill" objectFit="cover" className="absolute inset-0 rounded-t" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-black/30 flex items-end p-2 rounded-t">
          <h1 className="text-white text-lg font-semibold leading-[17.50px] text-left">
            {title}
          </h1>
        </div>
      </div>
      
      <section className="w-full px-4 py-2">
        {item_description.map((e, index) => (
          <ul key={index}>
            <li className="text-Neutral-700 text-xs font-normal leading-[20px]">{e}</li>
          </ul>
        ))}

        <div className="flex flex-row justify-between items-center w-full mt-2">
          <span className="text-center justify-start text-primary-500 text-base font-bold leading-tight">
            $ {price}
          </span>
          <Link href="/boosting" className="px-3 py-[5px] bg-primary-600 rounded shadow-[0px_8px_16px_0px_rgba(125,42,232,0.15)]"> Order Now</Link>
        </div>
      </section>
    </section>
  );
}

export default BoostingItemsCard;
