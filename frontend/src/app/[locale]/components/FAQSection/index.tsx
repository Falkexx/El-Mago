import { Link } from "@/i18n/routing";
import { FaDiscord } from "react-icons/fa";
import { useTranslations } from "next-intl";

import AccordeonCard from "../Ui/Cards/AccordeonCard";

function index() {
  const t = useTranslations("FAQs");

  const FAQs = [
    {
      id: 0,
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },

    {
      id: 1,
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },

    {
      id: 2,
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-20">
      <div>
        <h1 className="text-black text-5xl font-bold text-center">
          {t("title")}
        </h1>
      </div>

      <section className="flex flex-row gap-14">
        <section className="w-72 h-[183px] rounded-[5px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.15)] border border-[#dee2e6] p-6">
          <div className="h-full w-full flex flex-col justify-between">
            <article>
              <h1 className="text-black text-xl font-bold leading-8">
              {t("discordTitle")}

              </h1>

              <p className="text-[#6c757d] text-xs font-normal leading-4">
                {t("discordDesc")}
              </p>
            </article>

            <div>
              <Link
                href="/"
                className="w-fit py-2 px-6 bg-[#194fa0] rounded-lg flex flex-row items-center gap-2"
              >
                <i>
                  <FaDiscord />
                </i>
                {t("discoCTA")}
              </Link>
            </div>
          </div>
        </section>

        <section className="w-[80%] ">
          {FAQs.map((e) => {
            return (
              <AccordeonCard
                title={e.title}
                description={e.description}
                id={e.id}
              />
            );
          })}
        </section>
      </section>
    </section>
  );
}

export default index;
