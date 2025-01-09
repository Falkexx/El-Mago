import BecomeAffiliateBtn from "../../Ui/Buttons/BecomeAffiliateBtn";
import { useTranslations } from "next-intl";

function index() {
  const t = useTranslations("Affiliates");

  return (
    <section className="w-full flex flex-row my-auto gap-16 text-whiteDef">
      <div className="w-1/2 bg-blue-600 h-96 rounded-[42px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.60)]"></div>

      <article className="w-1/2 flex flex-col justify-between ">
        <article className="w-full h-full flex flex-col gap-4">
          <h1 className="text-5xl font-bold leading-[48px]">{t("title")}</h1>

          <div className="text-base font-normal leading-normal tracking-tight">
            <p>{t("description")}</p>
          </div>
        </article>
        <BecomeAffiliateBtn />
      </article>
    </section>
  );
}

export default index;
