import Link from "next/link";
import UserInfos from "../UserInfos";

function index() {
  return (
    <section>
      <UserInfos />

      <Link href="/" className="">My Orders</Link>
    </section>
  );
}

export default index;
