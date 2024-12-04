import Image from "next/image";
import Logo from "@/midias/logo.svg";

import { Link } from "@/i18n/routing";
import CurrencyBtn from "@/app/[locale]/components/CurrencyBtn";
import MyAccountBtn from "@/app/[locale]/components/MyAccountBtn";
import ShoppingCartBtn from "@/app/[locale]/components/ShoppingCartBtn";

function Header() {

  return (
    <header className="bg-[#111111] text-white w-full py-2 md:max-w-[2800px]">
      <nav className="w-full md:flex md:flex-row md:justify-between md:items-center">
        <section className="w-2/4 md:flex md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/">
              <Image src={Logo} alt="Logo" />
            </Link>
          </div>

          {/*LINKS DA NAVBAR */}
          <div className="fontDefault">
            <ul className="md:w-full md:flex md:flex-row md:gap-4">
              <li>
                <Link href="/">Home</Link>
              </li>

              <li>
                <Link href="/Gold">Gold</Link>
              </li>

              <li>
                <Link href="/Items">Items</Link>
              </li>

              <li>
                <Link href="/Carry Run">Carry Run</Link>
              </li>

              <li>
                <Link href="/Boosting">Boosting</Link>
              </li>

              <li>
                <Link href="/Build">Build</Link>
              </li>

              <li>
                <Link href="/Affiliate">Affiliate</Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="md:flex md:flex-row md:gap-3">
          <CurrencyBtn/>
          <MyAccountBtn/>
          <ShoppingCartBtn/>
        </section>
      </nav>
    </header>
  );
}

export default Header;
