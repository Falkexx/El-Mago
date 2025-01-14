import MyCurrentOrders from "@/app/[locale]/components/Ui/OrdersDisplay/MyCurrentOrders";
import AllPendingOrders from "../../Ui/OrdersDisplay/AllPendingOrders";
function index() {
  return (
    <section className="w-full ">
      <section className=" flex flex-row gap-12 mt-10 mb-11 w-3/4 ">
        <section className="w-[35%] border-r border-[#495057] ">
          <article>
            <h1 className="text-[#f8f9fa] text-4xl font-bold leading-[45px]">
              Balance
            </h1>
            <h2 className="text-[#a84dff] text-xl font-normal leading-8">
              USD 12.40
            </h2>
          </article>

          <div className="flex flex-col gap-4 w-[90%]">
            <button className="ctaBtn px-12 h-11 w-full">Withdraw</button>

            <button className="ctaBtn_WithoutBg px-12 h-11 w-full">
              Sell martplace Item
            </button>
          </div>
        </section>

        <article className="flex flex-col gap-2">
          <h1 className="text-[#f8f9fa] text-4xl font-bold font-['Jost'] leading-[45px]">
            Affiliate Level System
          </h1>

          <div className="flex flex-col gap-2">
            <p className="text-[#f2f5fa] text-base font-normal font-['Jost'] leading-normal tracking-tight">
              <span className="text-[#db9370] text-base font-bold font-['Jost'] leading-normal">
                Bronze affiliate :{" "}
              </span>
              Lorem Ipsum
            </p>

            <p className="text-[#f2f5fa] text-base font-normal font-['Jost'] leading-normal tracking-tight">
              <span className="text-[#c0c0c0] text-base font-bold font-['Jost'] leading-normal">
                Silver affiliate :{" "}
              </span>
              Lorem Ipsum
            </p>

            <p className="text-[#f2f5fa] text-base font-normal font-['Jost'] leading-normal tracking-tight">
              <span className="text-[#ffd700] text-base font-bold font-['Jost'] leading-normal">
                Gold affiliate :{" "}
              </span>
              Lorem Ipsum
            </p>

            <p className="text-[#f2f5fa] text-base font-normal font-['Jost'] leading-normal tracking-tight">
              <span className="text-[#50c878] text-base font-bold font-['Jost'] leading-normal">
                Platinum affiliate :{" "}
              </span>
              Lorem Ipsum
            </p>

            <p className="text-[#f2f5fa] text-base font-normal font-['Jost'] leading-normal tracking-tight">
              <span className="text-[#f14275] text-base font-bold font-['Jost'] leading-normal">
                PRIME affiliate :{" "}
              </span>
              Lorem Ipsum
            </p>
          </div>
        </article>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <MyCurrentOrders />
        </div>

        <div>
          <AllPendingOrders />
        </div>
      </section>
    </section>
  );
}

export default index;
