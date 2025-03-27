import Description from "../../components/PreChckout/Descriptions";
import OrderDetails from "../../components/PreChckout/OrderDatail";
import medalhas from "@/midias/Boosting/medalhas.png"

function Page() {
  return ( 

    <main className="px-32 flex flex-row gap-8 mt-6">

      <Description/>

      <OrderDetails img_url={medalhas} price={0.05} server="Season 6 - Softscore" />
    </main>

  );
}

export default Page;