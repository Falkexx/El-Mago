
import Orders_affiliate_details from "../Cards/Orders_affiliate_details";
import GetOrderBtn from "../Buttons/GetOrderBtn";

function AllPendingOrders() {

  const orders = [
    {
      id: "0002",
      medal: "Item",
      title: "Seasson-6 Score",
      numberClients: "Andariel Materials x50",
      nickName: "Lorem Nickname",
      value: "USD 0.90",
    },

  ];

  return (
    <section className="w-full min-h-96 bg-white/0 rounded-2xl border-2 border-[#343a40]/30 px-6 py-6 ">
      <h1 className="text-[#f8f9fa] text-xl font-bold leading-8 mb-6">
        All pending orders
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

              <GetOrderBtn/>
            </div>
          );
        })}
      </section>


    </section>
  );
}

export default AllPendingOrders;
