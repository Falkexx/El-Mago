import Image from "next/image";
import LogOutBtn from "../Ui/Buttons/LogOutBtn";

function UserInfos() {
  return (
    <section className="w-72 flex flex-col justify-between items-center py-6 bg-white/0 rounded-2xl border border-[#495057]">
      <section className="flex flex-col gap-4">
        <img
          className="w-[100px] h-[100px] rounded-full border border-[#495057]"
          src="https://lh4.googleusercontent.com/proxy/nqqP48UePgO-yStZfk06KxGspB-6l-Y3RWwYkEFBj_fZ59d_2LiiBE8Jxw4XlRiHcHZsjqFinM7v7vw4gt4YuMmbVrtJXol1wJbQ7EmXUL1yQQJJ3dOm2f6Y8g8"
          alt="User photo"
        />

        <h2 className="text-[#adb5bd] text-xs font-normal font-['Jost'] leading-[15px]">
          loremipsum@gmail.com
        </h2>
      </section>

      <div className="mt-8">
        <LogOutBtn />
      </div>
    </section>
  );
}

export default UserInfos;
