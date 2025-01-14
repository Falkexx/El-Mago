import { IoMdClose } from "react-icons/io";
import UploadImg from "../UploadFiles/UploadImg";

interface OverlayProps {
  orderID: number;
  totalValue: number;
  affiliateComission: number;
}
function FinishOrder({
  affiliateComission,
  orderID,
  totalValue,
}: OverlayProps) {
  return (
    <section className="w-2/4 rounded-2xl border-2 border-[#8e33ff] px-8 py-6 bg-[#1a1a1a]">
      <header className="w-full flex flex-col gap-6">
        <article className="w-full flex flex-row justify-between items-center mb-6">
          <h1 className="text-whiteDef text-3xl font-bold leading-9">
            Finish Order: {`${orderID}`}
          </h1>

          <i className="text-whiteDef cursor-pointer">
            <IoMdClose />
          </i>
        </article>

        <article>
          <p className=" text-[#dee2e6] text-lg font-normal leading-7">
            To finalize the order, please send a printscreen to prove that the
            in-game trade was completed.
          </p>
        </article>
      </header>

      <UploadImg/>

      <section className="w-full flex flex-col gap-4 my-8">
        <article className="flex flex-row justify-between">
          <h1 className="text-lg font-medium  leading-7">Total Value</h1>
          <span className="text-right text-[#8e33ff] text-lg font-bold leading-[27px]">{`${totalValue}`}</span>
        </article>

        <article className="flex flex-row justify-between">
          <h1 className="text-lg font-medium  leading-7">
            Affiliate Commission
          </h1>
          <span className="text-right text-[#8e33ff] text-lg font-bold leading-[27px]">{`${affiliateComission}`}</span>
        </article>
      </section>
    </section>
  );
}

export default FinishOrder;
