
import Image from "next/image";
import Witcher_Stand from "@/midias/witcher_Standed.png"
import Player_Form from "@/app/[locale]/components/Affiliate/Player_Form"
function Operation_steps() {
  return ( <section>

      <section className="flex flex-row w-full items-center gap-10">

        <div>
          <Image src={Witcher_Stand} alt='Witcher' className="w-60 h-60"/>
        </div>

        <article className="flex flex-col gap-4">

          <h1 className="text-white text-3xl font-bold leading-9">Affiliate Operation Steps</h1>

          <ol className="list-decimal pl-4">
            <li className="text-white text-sm font-normal leading-6">Lorem ipsum dolor sit amet. Sit inventore nihil et aperiam consequatur qui dolorum deserunt non maxime officia.</li>

            <li>Lorem ipsum dolor sit amet. Sit inventore nihil et aperiam consequatur qui dolorum deserunt non maxime officia.</li>

            <li>Lorem ipsum dolor sit amet. Sit inventore nihil et aperiam consequatur qui dolorum deserunt non maxime officia.</li>

            <li>Lorem ipsum dolor sit amet. Sit inventore nihil et aperiam consequatur qui dolorum deserunt non maxime officia.</li>
          </ol>

        </article>
      </section>


      {/*FORMULÁRIO DOS PLAYERS | COMPONENT */}

      <section>

        <Player_Form/>

      </section>

  </section> );
}

export default Operation_steps;