import SearchLoop from "@/midias/Icons/Search/SearchLoop.svg";
import Image from "next/image";

function ItemsSearch() {
  return (
    <section className="w-[463px]">
      <div className="relative flex items-center bg-white bg-opacity-0 rounded-lg border border-Neutral-800 p-2">
        <input
          type="text"
          placeholder="Search Items..."
          className="flex-grow text-Neutral-500 text-sm font-normal font-['Jost'] leading-[17.50px] bg-transparent outline-none px-2"
        />
        <div className="bg-primary-800 p-2 rounded-lg cursor-pointer">
          <Image src={SearchLoop} alt="Search" width={20} height={20} />
        </div>
      </div>
    </section>
  );
}

export default ItemsSearch;
