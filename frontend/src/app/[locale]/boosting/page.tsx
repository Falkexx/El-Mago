import BoostingSelection from "../components/Boosting/BoostingSelection";
import WitcherHead from "../components/Ui/Cards/WitcherHead";
import Medals from "@/midias/Icons/Medals/Medals.png"
import Bruxa from "@/midias/Boosting/bruxa.png"
import BoostingItemsCard from "../components/Ui/Cards/BoostingItemsCard";

function Page() {

  const data = [

    {title: "All", id: 1},
    {title: "Vessel of Hatred", id: 1},
    {title: "Leveling", id: 1},
    {title: "Bundles", id: 1},
    {title: "Bosses", id: 1},
    {title: "Dungeons", id: 1},
    {title: "Character Boosting", id: 1},
    {title: "Materials", id: 1},
  ]

  return (  
    <section className="px-32">

      <main>
        <WitcherHead title="Diablo IV Boosting Service For Sale" description="Via D4Gold.com to buy Diablo 4 Boosting for Softcore/Hardcore servers to level up faster. Get the cheapest D4 Power Leveling SC/HC with secure payment methods and 24/7 live chat.
Subsequent guides are provided free of charge." optional_img={Medals} />
      </main>


      <section className="flex flex-row gap-4 mt-32 mb-6">

        {data.map((e,i)=>{

          return(

            <BoostingSelection id={i} title={e.title} selected={false} value={e.title} key={i}/>
          )
        })}

      </section>


      <section>

        <BoostingItemsCard title="Power Leveling" price={0.05} img_url={Bruxa} item_description={['The desired Level Range', 'Skip the tedious grind', 'Fast Easy Level Up']}/>

      </section>
    </section>
  );
}

export default Page;