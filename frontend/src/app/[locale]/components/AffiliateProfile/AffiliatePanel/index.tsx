import AffiliateInfos from "../AffiliateInfos";
import { Link } from "@/i18n/routing";

function index() {
  return (
    <section className="flex flex-col gap-4 mt-4">
      <AffiliateInfos />

      <div className="w-72 h-28 bg-white/0 rounded-2xl border border-[#495057] flex flex-col justify-around px-6">
        <Link
          href="/"
          className="block"
        >
          My Orders
        </Link>

        <div className="w-full h-[0px] border border-[#495057]"></div>
        <Link
          href="/"
          className="block"
        >
          My Sales
        </Link>

      </div>
    </section>
  );
}

export default index;
