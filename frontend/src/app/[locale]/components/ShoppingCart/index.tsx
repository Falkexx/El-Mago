import Product_Shopping_Cart from "../Ui/Cards/Product_Shopping_Cart";

function Index() {
  return (
    <section className="flex flex-col h-screen p-4">
      {/* Cabeçalho */}
      <header className="w-full flex flex-col gap-6 mb-4">
        <article className="w-full flex flex-row justify-between items-center">
          <h1 className="text-[#111111] text-lg font-bold leading-[27px]">
            Shopping cart
          </h1>
        </article>
      </header>

      {/* Lista de Produtos */}
      <section className="flex-grow overflow-auto">
        <Product_Shopping_Cart />
      </section>

      {/* Subtotal e Checkout */}
      <section className="w-full flex flex-col gap-4">
        <article className="w-full flex flex-row justify-between items-center">
          <h2 className="text-[#111111] text-base font-normal leading-normal">
            Subtotal
          </h2>
          <span className="text-[#6a00f4] text-lg font-bold leading-[27px]">
            $0.36
          </span>
        </article>

        {/* Linha Divisória */}
        <div className="w-full h-[1px] bg-[#dee2e6]"></div>

        {/* Botão de Checkout */}
        <button className="ctaBtn w-full h-11 text-white text-base font-semibold leading-tight px-12">
          Checkout
        </button>
      </section>
    </section>
  );
}

export default Index;
