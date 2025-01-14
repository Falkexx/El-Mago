import Link from "next/link";
import UserInfos from "../UserInfos";

function index() {
  return (
    <section className="flex flex-col gap-4 mt-4">
      <UserInfos />

      <Link href="/" className="w-72  h-[75px] bg-white/0 rounded-2xl border border-[#495057] flex items-center px-6">My Orders</Link>
    </section>
  );
}

export default index;
