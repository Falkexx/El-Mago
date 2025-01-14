import { IoMdClose } from "react-icons/io";

interface OverlayProps {
  orderID: number;
  server: string;
  classGame: string;
  order: string;
  plataform: string;
  characterName: string;
  battleTag: string;
  totalValue: number;
  affiliateComission: number;
}

function OrderOverlay({
  affiliateComission,
  battleTag,
  characterName,
  classGame,
  order,
  orderID,
  plataform,
  server,
  totalValue,
}: OverlayProps) {
  return (
    <section className="w-2/4 rounded-2xl border-2 border-[#8e33ff] px-8 py-6 bg-[#1a1a1a]">
      {/* Header */}
      <article className="w-full flex flex-row justify-between items-center mb-6">
        <h1 className="text-whiteDef text-3xl font-bold leading-9">
          Order: {`${orderID}`}
        </h1>
        <i className="text-whiteDef cursor-pointer">
          <IoMdClose />
        </i>
      </article>

      {/* Body */}
      <section className="flex flex-col gap-6">
        {/* Server */}
        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Server</label>
          <input
            readOnly
            disabled
            placeholder={`${server}`}
            className="InputDefault"
          />
        </div>

        {/* Platform */}
        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Platform</label>
          <input
            readOnly
            disabled
            placeholder={`${plataform}`}
            className="InputDefault"
          />
        </div>

        {/* Class Game */}
        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Class/Game</label>
          <input
            readOnly
            disabled
            placeholder={`${classGame}`}
            className="InputDefault"
          />
        </div>

        {/* Character Name */}
        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Character Name</label>
          <input
            readOnly
            disabled
            placeholder={`${characterName}`}
            className="InputDefault"
          />
        </div>

        {/* Battle Tag */}
        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Battle Tag</label>
          <input
            readOnly
            disabled
            placeholder={`${battleTag}`}
            className="InputDefault"
          />
        </div>

        {/* Order Details */}
        <div className="flex flex-col gap-2">
          <label className="LabelDefault">Order</label>
          <input
            readOnly
            disabled
            placeholder={`${order}`}
            className="InputDefault"
          />
        </div>
      </section>

      {/*Fiscal Details*/}

      <section className="w-full flex flex-col gap-4 my-8">

        <article className="flex flex-row justify-between">
          <h1 className="text-lg font-medium  leading-7">Total Value</h1>
          <span className="text-right text-[#8e33ff] text-lg font-bold leading-[27px]">{`${totalValue}`}</span>
        </article>

        <article className="flex flex-row justify-between">
          <h1 className="text-lg font-medium  leading-7">Affiliate Commission</h1>
          <span className="text-right text-[#8e33ff] text-lg font-bold leading-[27px]">{`${affiliateComission}`}</span>
        </article>

      </section>
    </section>
  );
}

export default OrderOverlay;
