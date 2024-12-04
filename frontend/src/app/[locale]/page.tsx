import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/app/[locale]/Header";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="fontDefault">
      <section>
        <main></main>
      </section>
    </div>
  );
}
