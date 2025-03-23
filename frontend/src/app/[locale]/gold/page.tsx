import { getTranslations } from "next-intl/server";

import SelectionBtn from "../components/Ui/Buttons/SelectionBtn";
import WitcherHead from "../components/Ui/Cards/WitcherHead";
import Servers_datas from "@/app/data/services/mocked/gold/servers_datas";

async function Page() {

  const t = await getTranslations("Gold")

  return (
    <section className="px-32">
      <main>
        <WitcherHead
          title="Buy Diablo 4 Gold"
          description="Buy Diablo IV Gold For Season/Eternal - Softcore/Hardcore servers from D4Gold.com is your best bet. Get cheapest D4 SC/HC Gold with 24/7 live support and great discounts. Any secure payments methods and free Diablo 4 beginners' guides are available for you at will."
        />
      </main>

      <section>

        <h1>
          {t("Server.title")}
        </h1>

        <section className="w-full flex flex-row">
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
    </section>
  );
}

export default Page;
