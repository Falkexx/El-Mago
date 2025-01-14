import Image from "next/image";
import Witcher_Standed from "@/midias/witcher_Standed.png"
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
function index() {

  const t = useTranslations("Unauthorized_affiliates")

  return (  

    <section className="flex flex-row gap-10 items-center">

        <div>
          <Image src={Witcher_Standed} alt="Witcher_Standed" className="w-60 h-60"/>
        </div>

        <article className="flex flex-col gap-10">
          <h1 className="text-3xl font-bold leading-9">{t("title")}</h1>

          <div className="flex flex-row gap-6">
            <Link href="/" className="h-11 ctaBtn px-12 py-3">{t("siginBtn")}</Link>

            <Link href="/" className="h-11 ctaBtn_WithoutBg px-12 py-3">{t("signupBtn")}</Link>
          </div>
        </article>

    </section>
  );
}

export default index;