import { useTranslations } from "next-intl";
import userIcon from "@/midias/Icons/userIcon.svg";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function MyAccountBtn() {
  const t = useTranslations("Navbar");
  const data = await getServerSession(authOptions)
  const isLogged = data?.accessToken
  console.log(isLogged)

  return (
    <Link href={isLogged ? "/profile" : "/login"} className="flex flex-row items-center h-[30px] pl-3 pr-4 py-1.5 bg-gradient-to-br from-[#6a00f4] to-[#480e9d] rounded shadow gap-1.5 text-white text-sm font-normal font-['Jost'] leading-[17.50px] tracking-tight">
      <i className="w-3 h-3">{<Image src={userIcon} alt="User Icon" />}</i>

        <span>{t("MyAccount")}</span>
    </Link>
  );
}

export default MyAccountBtn;
