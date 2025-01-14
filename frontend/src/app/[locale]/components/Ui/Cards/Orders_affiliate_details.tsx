interface orderDetails {
  id: string; // Identificador único
  medal: string // Medalha com valores pré-definidos
  title: string; // Título do tipo de medalha ou nível
  numberClients: string; // Número de clientes em um formato de string
  nickName: string; // Nome ou apelido associado
  value: string; // Valor no formato de string (incluindo a moeda)
}

function Orders_affiliate_details({id,medal,nickName,numberClients,title,value}:orderDetails) {
  return ( 

    <section className="w-full h-11 flex flex-row items-center justify-between px-4 bg-[#222222] rounded-lg border border-[#495057] text-[#f8f9fa] text-sm font-normal leading-4">

      <span>{id}</span>
      <span>{medal}</span>
      <span>{nickName}</span>
      <span>{numberClients}</span>
      <span>{title}</span>
      <span>{value}</span>
    </section>
   );
}

export default Orders_affiliate_details;