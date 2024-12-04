import { useTranslations } from "next-intl";
import cartIcon from "@/midias/Icons/cart.svg";
import Image from "next/image";
function ShoppingCartBtn() {
  const t = useTranslations("Navbar");
  return (
    <button className="w-[30px] h-[30px] px-[5px] py-1.5 bg-gradient-to-br from-[#6a00f4] to-[#480e9d] rounded shadow justify-start items-center gap-2 inline-flex relative">
      <i>
        <Image src={cartIcon} alt="carrinho" />
      </i>

      <div className="h-[19px] px-[5px] py-0.5 bg-[#d1105a] rounded-[64px] border border-[#f8f9fa] flex-col justify-center items-center gap-2 absolute -top-2 -right-2">
        <div className="text-white text-xs font-normal font-['Jost'] leading-[15px]">
          0
        </div>
      </div>
    </button>
  );
}

export default ShoppingCartBtn;
