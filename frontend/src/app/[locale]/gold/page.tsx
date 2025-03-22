import SelectionBtn from "../components/Ui/Buttons/SelectionBtn";
import WitcherHead from "../components/Ui/Cards/WitcherHead";

function page() {
  return (
    <section className='px-32'>
      <main>
        <WitcherHead title="Buy Diablo 4 Gold" description="Buy Diablo IV Gold For Season/Eternal - Softcore/Hardcore servers from D4Gold.com is your best bet. Get cheapest D4 SC/HC Gold with 24/7 live support and great discounts. Any secure payments methods and free Diablo 4 beginners'guides are available for you at will."/>
      </main>

      <section className="w-full flex flex-row">
        <SelectionBtn id={0} selected={false} title="testing" type="server" value={100} key={0} />
        <SelectionBtn id={0} selected={true} title="testing" type="server" value={100} key={0} />
      </section>
    </section>
  );
}

export default page;
