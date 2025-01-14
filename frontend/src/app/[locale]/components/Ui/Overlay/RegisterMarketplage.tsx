import { IoMdClose } from "react-icons/io";
import UploadImg from "../UploadFiles/UploadImg";

function RegisterMarketplace() {
  return (
    <section className="w-2/4 rounded-2xl border-2 border-[#8e33ff] px-8 py-8 bg-[#1a1a1a]">
      <header className="w-full flex flex-col gap-6">
        <article className="w-full flex flex-row justify-between items-center mb-6">
          <h1 className="text-whiteDef text-3xl font-bold leading-9">
            Register Marketplace Item
          </h1>

          <i className="text-whiteDef cursor-pointer">
            <IoMdClose />
          </i>
        </article>
      </header>

      <form className="flex flex-col w-full gap-4">
        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Item Name</label>

          <input className="InputDefault" />
        </div>

        <div className="flex flex-col gap-2">
          <label>Equipment Type</label>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <input type="checkbox" />
              <span>Unique</span>
            </div>

            <div className="flex flex-row gap-2">
              <input type="checkbox" />
              <span>Legendary</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label>Server</label>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <input type="checkbox" />
              <span>Season 6 - Softcore</span>
            </div>

            <div className="flex flex-row gap-2">
              <input type="checkbox" />
              <span>Eternal - Softcore</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Equipament Part</label>

          <select className="InputDefault h-20">
            <option>Select equipament Part</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Item Value</label>

          <input className="InputDefault" />
        </div>

        <div className="">
          <label>Equipment Print</label>
          <UploadImg />
        </div>

        <button type="submit" className="ctaBtn w-full h-11 px-12 text-center">
          Register Item
        </button>
      </form>
    </section>
  );
}

export default RegisterMarketplace;
