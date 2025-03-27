import { getTranslations } from "next-intl/server";

import SelectionBtn from "../components/Ui/Buttons/SelectionBtn";
import WitcherHead from "../components/Ui/Cards/WitcherHead";
import Servers_datas from "@/app/data/services/mocked/gold/servers_datas";
import SelectAQuantity from "../components/Gold/SelectAQuantity";

async function Page() {
  const t = await getTranslations("Gold");

  return (
    <section className="px-32">
      <main>
        <WitcherHead
          title="Buy Diablo 4 Gold"
          description="Buy Diablo IV Gold For Season/Eternal - Softcore/Hardcore servers from D4Gold.com is your best bet. Get cheapest D4 SC/HC Gold with 24/7 live support and great discounts. Any secure payments methods and free Diablo 4 beginners' guides are available for you at will."
        />
      </main>

      <div className="flex flex-col gap-6">
        {/*SELECT A SERVER - SECTION*/}
        <section className="flex flex-col gap-2 mt-20">
          <h1 className="text-Neutral-100 text-base font-medium">
            {t("Server.title")}
          </h1>

          <section className="w-full flex flex-row gap-2">
            {Servers_datas().map((e, i) => (
              <SelectionBtn
                id={i}
                selected={false} // Estado inicial sempre false, controlado no client
                title={e.title}
                type={e.type as "server" | "quantity"}
                value={e.title}
                key={i}
              />
            ))}
          </section>
        </section>

        {/*SELECT quan - SECTION*/}

        <section>
          <SelectAQuantity />
        </section>


        {/*TEXT SECTION*/}

        <section className="flex w-full flex-col gap-6 my-14">

          <article>
            <h1 className="self-stretch justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">Lorem Title</h1>
            <p className="self-stretch justify-start text-Neutral-500 text-base font-normal font-['Jost'] leading-normal tracking-tight">Lorem ipsum dolor sit amet. Vel accusantium veniam et veritatis quasi aut fugiat eligendi. Aut illo magnam et consequuntur eaque ut ipsa deserunt vel aperiam nesciunt non delectus commodi ut molestias voluptatem.</p>
          </article>


          <article>
            <h1 className="self-stretch justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">Title Lorem</h1>
            <p className="self-stretch justify-start text-Neutral-500 text-base font-normal font-['Jost'] leading-normal tracking-tight">Lorem ipsum dolor sit amet. Vel accusantium veniam et veritatis quasi aut fugiat eligendi. Aut illo magnam et consequuntur eaque ut ipsa deserunt vel aperiam nesciunt non delectus commodi ut molestias voluptatem.</p>
          </article>

          <article>
            <h1 className="self-stretch justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">Title Ipsum</h1>
            <p className="self-stretch justify-start text-Neutral-500 text-base font-normal font-['Jost'] leading-normal tracking-tight">Lorem ipsum dolor sit amet. Vel accusantium veniam et veritatis quasi aut fugiat eligendi. Aut illo magnam et consequuntur eaque ut ipsa deserunt vel aperiam nesciunt non delectus commodi ut molestias voluptatem.</p>
          </article>

          <article>
            <h1 className="self-stretch justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">Ipsum Title</h1>
            <p className="self-stretch justify-start text-Neutral-500 text-base font-normal font-['Jost'] leading-normal tracking-tight">Lorem ipsum dolor sit amet. Vel accusantium veniam et veritatis quasi aut fugiat eligendi. Aut illo magnam et consequuntur eaque ut ipsa deserunt vel aperiam nesciunt non delectus commodi ut molestias voluptatem.</p>
          </article>

        </section>

      </div>
    </section>
  );
}

export default Page;
