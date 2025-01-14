"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import cartIcon from "@/midias/Icons/cart.svg";
import Image from "next/image";
import ShoppingCart from "@/app/[locale]/components/ShoppingCart/index";

function ShoppingCartBtn() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const openCart = () => {
    setIsCartOpen(true);

    // Animar a entrada do carrinho
    if (cartRef.current) {
      gsap.to(cartRef.current, {
        x: 0, // Move o carrinho para a posição visível
        duration: 0.5,
        ease: "power3.out",
      });
    }

    // Mostrar o fundo preto
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0.5,
        duration: 0.5,
        ease: "power3.out",
        display: "block", // Garante que o fundo fique visível
      });
    }
  };

  const closeCart = () => {
    // Animar a saída do carrinho
    if (cartRef.current) {
      gsap.to(cartRef.current, {
        x: "100%", // Move o carrinho para fora da tela
        duration: 0.5,
        ease: "power3.in",
      });
    }

    // Esconder o fundo preto
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => setIsCartOpen(false), // Fecha o estado após a animação
      });
    }
  };

  return (
    <>
      {/* Botão do carrinho */}
      <button
        onClick={openCart}
        className="w-[30px] h-[30px] px-[5px] py-1.5 bg-gradient-to-br from-[#6a00f4] to-[#480e9d] rounded shadow justify-start items-center gap-2 inline-flex relative"
      >
        <i>
          <Image src={cartIcon} alt="carrinho" />
        </i>
        <div className="h-[19px] px-[5px] py-0.5 bg-[#d1105a] rounded-[64px] border border-[#f8f9fa] flex-col justify-center items-center gap-2 absolute -top-2 -right-2">
          <div className="text-white text-xs font-normal font-['Jost'] leading-[15px]">
            0
          </div>
        </div>
      </button>

      {/* Fundo preto semitransparente */}
      {isCartOpen && (
        <div
          ref={overlayRef}
          onClick={closeCart}
          className="fixed inset-0 bg-black opacity-40 z-40"
        ></div>
      )}

      {/* Carrinho */}
      <div
        ref={cartRef}
        className="fixed top-0 right-0 w-[371px] h-full bg-white shadow-lg z-50 translate-x-full"
      >
        <ShoppingCart />
      </div>
    </>
  );
}

export default ShoppingCartBtn;
