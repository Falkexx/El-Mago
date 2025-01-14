import Operation_steps from "../components/Affiliate/Operation_steps";
import FinishOrder from "../components/Ui/Overlay/FinishOrder";
import OrderOverlay from "../components/Ui/Overlay/OrderOverlay";
import RegisterMarketplace from "../components/Ui/Overlay/RegisterMarketplage";

function page() {

  return <section>

    <main>
      <section className='px-32'>
        <Operation_steps/>

        <OrderOverlay affiliateComission={8.90} battleTag="aiaiaiaiai#69" characterName="Japalol" classGame="items > Legendary" order="Tearveil Amulet of Plains Power" orderID={3} plataform="PC" server="Eternal - Hardcore" totalValue={22.22} key={1} />

        <FinishOrder affiliateComission={8.90} orderID={3} totalValue={22.22} key={1}/>

        <RegisterMarketplace/>
      </section>
    </main>
  </section>;
}

export default page;
