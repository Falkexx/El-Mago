import OrderDoneBtn from "../Buttons/OrderDoneBtn";
import Orders_affiliate_details from "../Cards/Orders_affiliate_details";

function MyCurrentOrders() {
  const orders = [
    {
      id: "0001",
      medal: "Gold",
      title: "Eternal-Hardcore",
      numberClients: "100M",
      nickName: "Lorem Nickname",
      value: "USD 2.68",
    },

    {
      id: "0001",
      medal: "Gold",
      title: "Eternal-Hardcore",
      numberClients: "100M",
      nickName: "Lorem Nickname",
      value: "USD 2.68",
    },
  ];
  return (
    <section className="w-full min-h-96 bg-white/0 rounded-2xl border-2 border-[#343a40]/30 px-6 py-6 ">
      <h1 className="text-[#f8f9fa] text-xl font-bold leading-8 mb-6">
        My Current Orders
      </h1>

      <section className="w-full">
        {orders.map((e) => {
          return (
            <div className="flex flex-row gap-2 mb-4">
              <Orders_affiliate_details
                id={e.id}
                medal={e.medal}
                title={e.title}
                nickName={e.nickName}
                numberClients={e.numberClients}
                value={e.value}
              />

              <OrderDoneBtn />
            </div>
          );
        })}
      </section>
    </section>
  );
}

export default MyCurrentOrders;
