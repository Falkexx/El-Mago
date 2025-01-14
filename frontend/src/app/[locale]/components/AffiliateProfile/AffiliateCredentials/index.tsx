import User_Identification_Credentials from "../../Ui/Forms/User_Identification_Credentials";
import Change_Password from "../../Ui/Forms/Change_Password";

function index() {
  return (
    <section className="w-full mt-4 flex flex-col gap-4">
      <section className="flex flex-col gap-4">
        <h1 className="text-[#f8f9fa] text-xl font-bold  leading-8">
          My Profile
        </h1>
        <User_Identification_Credentials />
      </section>

      <section className="flex flex-col gap-4">
        <h1 className="text-[#f8f9fa] text-xl font-bold  leading-8">
          Change Password
        </h1>

        <Change_Password/>

      </section>
    </section>
  );
}

export default index;