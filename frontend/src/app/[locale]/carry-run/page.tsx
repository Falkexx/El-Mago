import { getTranslations } from "next-intl/server";

import WitcherHead from "../components/Ui/Cards/WitcherHead";
import ItemsCard from "../components/Ui/Cards/ItemsCard";
import ItemsSections from "../components/Ui/Checkbox/ItemsSections";
import ItemsSearch from "../components/Ui/Search/ItemsSearch";
import Servers_datas from "@/app/data/services/mocked/gold/servers_datas";
import SelectionBtn from "@/app/[locale]/components/Ui/Buttons/SelectionBtn";


import Item_img from "@/midias/Items/elementos.png"

async function Page() {

    const t = await getTranslations("Gold");
  

    const equipments_data = [
      "all",
      "Kill Summon Boss",
      "Dungeons",
      "Character Boosting",
      "Infernal Hardes Compass",
      "Nahantu Nightmare Dungeon",
    ];
    const items_data = [
      {
        title: "Andariel Materials (x2 Shackles & x2 Doll)",
        img_url: Item_img,
        price: 0.002,
      }
    ];
  
  return ( 

    <section className="px-32">
      <main>
        <WitcherHead title="Buy Diablo 4 Carry Run" description="D4Gold.com is the best Diablo 4 Items selling store, offering affordable materials, uniques, legendary and more. Buy D4 Items Season/Eternal - Softcore/Hardcore with easy process, safe payment and fast delivery."/>
      </main>


      <div className="flex flex-col gap-6">
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

        <section>
          <ItemsSections
            title="Select Equipment Parts and Affixes"
            options={equipments_data}
          />
        </section>

        <section>
          <ItemsSearch />
        </section>

        <section className="flex flex-row w-full gap-4 flex-wrap">
          {items_data.map((e) => {
            return (
              <ItemsCard img_src={e.img_url} price={e.price} title={e.title} />
            );
          })}
        </section>

        {/*TEXT SECTION*/}

        <section className="flex w-full flex-col gap-6 my-14">
          <article>
            <h1 className="self-stretch justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">
              Lorem Title
            </h1>
            <p className="self-stretch justify-start text-Neutral-500 text-base font-normal font-['Jost'] leading-normal tracking-tight">
              Lorem ipsum dolor sit amet. Vel accusantium veniam et veritatis
              quasi aut fugiat eligendi. Aut illo magnam et consequuntur eaque
              ut ipsa deserunt vel aperiam nesciunt non delectus commodi ut
              molestias voluptatem.
            </p>
          </article>

          <article>
            <h1 className="self-stretch justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">
              Title Lorem
            </h1>
            <p className="self-stretch justify-start text-Neutral-500 text-base font-normal font-['Jost'] leading-normal tracking-tight">
              Lorem ipsum dolor sit amet. Vel accusantium veniam et veritatis
              quasi aut fugiat eligendi. Aut illo magnam et consequuntur eaque
              ut ipsa deserunt vel aperiam nesciunt non delectus commodi ut
              molestias voluptatem.
            </p>
          </article>

          <article>
            <h1 className="self-stretch justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">
              Title Ipsum
            </h1>
            <p className="self-stretch justify-start text-Neutral-500 text-base font-normal font-['Jost'] leading-normal tracking-tight">
              Lorem ipsum dolor sit amet. Vel accusantium veniam et veritatis
              quasi aut fugiat eligendi. Aut illo magnam et consequuntur eaque
              ut ipsa deserunt vel aperiam nesciunt non delectus commodi ut
              molestias voluptatem.
            </p>
          </article>

          <article>
            <h1 className="self-stretch justify-start text-Neutral-100 text-3xl font-bold font-['Jost'] leading-[37.50px]">
              Ipsum Title
            </h1>
            <p className="self-stretch justify-start text-Neutral-500 text-base font-normal font-['Jost'] leading-normal tracking-tight">
              Lorem ipsum dolor sit amet. Vel accusantium veniam et veritatis
              quasi aut fugiat eligendi. Aut illo magnam et consequuntur eaque
              ut ipsa deserunt vel aperiam nesciunt non delectus commodi ut
              molestias voluptatem.
            </p>
          </article>
        </section>
      </div>


    </section>
   );
}

export default Page;