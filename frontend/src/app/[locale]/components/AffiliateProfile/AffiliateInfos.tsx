import LogOutBtn from "../Ui/Buttons/LogOutBtn";
import { IoStarSharp } from "react-icons/io5";

function AffiliateInfos() {
  return (
    <section>
      <section className="w-72 flex flex-col justify-between items-center py-6 bg-white/0 rounded-2xl border border-[#495057]">
        <section className="flex flex-col gap-4">
          <img
            className="w-[100px] m-auto h-[100px] rounded-full border border-[#495057]"
            src="https://lh4.googleusercontent.com/proxy/nqqP48UePgO-yStZfk06KxGspB-6l-Y3RWwYkEFBj_fZ59d_2LiiBE8Jxw4XlRiHcHZsjqFinM7v7vw4gt4YuMmbVrtJXol1wJbQ7EmXUL1yQQJJ3dOm2f6Y8g8"
            alt="User photo"
          />

          <h2 className="text-[#f8f9fa] text-xl font-bold text-center leading-[30px]">
            Itachi69
          </h2>

          <div className="w-full flex flex-row items-center justify-center gap-2">
            <i><IoStarSharp /></i>
            <i><IoStarSharp /></i>
            <i><IoStarSharp /></i>
            <i><IoStarSharp /></i>
            <i><IoStarSharp /></i>

            <div>

            <span className="text-[#adb5bd] text-xs font-normal font-['Jost'] leading-[15px]">3.5</span>
            </div>

          </div>

        </section>

        <div className="mt-8">
          <LogOutBtn />
        </div>
      </section>
    </section>
  );
}

export default AffiliateInfos;
