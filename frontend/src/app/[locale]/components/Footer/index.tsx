import Image from "next/image"
import Logo from "@/midias/logo.svg"
function Footer(){

  return(

    <footer className="w-full flex flex-row gap-8 items-center bg-[#111111] px-32 py-5 fixed bottom-0 border-t border-[#343A40]">
      <Image src={Logo} alt="Logo"/>
      <span> © 2024 El Mago/</span>
    </footer>
  )
}

export default Footer;