import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/app/ui/Header";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="px-20 fontDefault">
      <Header />

      <section>
        <main>

        </main>
      </section>
    </div>
  );
}
