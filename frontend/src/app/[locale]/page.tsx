import { title } from "process";
import Hero from "./components/Hero";
import HomeCard from "./components/Ui/Cards/HomeCard";
import GoldIcon from "@/midias/Icons/CardIcons/gold.svg";
import BoxIcon from '@/midias/Icons/CardIcons/box.svg'
import FireManIcon from '@/midias/Icons/CardIcons/fireMan.svg'
import SwordIcon from '@/midias/Icons/CardIcons/sword.svg'

import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");

  const Cards = [
    {icon: GoldIcon, title: "Gold", description:t("cardContentDescriptionGold"), btnContent: t("cardContentBtnGold"), id:1, btnUrl:"/" },

    
    {icon: BoxIcon, title: "Items", description:t("cardContentDescriptionItem"), btnContent: t("cardContentBtnItem"), id:1, btnUrl:"/" },

    
    {icon: FireManIcon, title: "Boosting", description:t("cardContentDescriptionBoosting"), btnContent: t("cardContentBtnBoosting"), id:1, btnUrl:"/" },

    
    {icon: SwordIcon, title: "Build", description:t("cardContentDescriptionBuild"), btnContent: t("cardContentBtnBuild"), id:1, btnUrl:"/" },
  ]

  return (
    <main>

      {/*HERO SECTION*/}
      <section>
        <Hero />
      </section>

      {/*CARDS SECTION*/}
      <section className="md:w-full bg-white h-96 md:flex justify-center items-center">

        <div className="w-4/5 m-auto flex flex-col gap-16">
          <section className="w-full text-center">
            <article className="flex flex-col gap-4">
              <h1 className="text-[#111111] text-5xl font-bold font-['Jost'] leading-[48px]">{t("cardSecTitle")}</h1>

              <h2 className="text-center text-[#343a40] text-base font-normal font-['Jost'] leading-normal tracking-tight">
                {t("cardSecSubtitle")}
              </h2>
            </article>
          </section>

          <section className="w-full flex flex-row gap-8">
            {Cards.map((e)=>{
              return(
                <HomeCard
                  icon={e.icon}
                  title={e.title}
                  description={e.description}
                  btnContent={e.btnContent}
                  btnUrl={e.btnUrl}
                  key={e.id}
                />
              )
            })}
          </section>
        </div>
      </section>
    </main>
  );
}
