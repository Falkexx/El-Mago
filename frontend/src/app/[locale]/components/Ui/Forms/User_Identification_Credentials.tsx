function User_Identification_Credentials() {
  return (
    <form className="w-full h-auto  p-6 bg-white/0 rounded-2xl border border-[#495057] grid grid-cols-2 gap-6">
      {/* First Name */}
      <div className="flex flex-col gap-2 w-full">
        <label className="LabelDefault">First Name</label>
        <input className="InputDefault" placeholder="First Name" />
      </div>

      {/* Last Name */}
      <div className="flex flex-col gap-2 w-full">
        <label className="LabelDefault">Last Name</label>
        <input className="InputDefault" placeholder="Last Name" />
      </div>

      {/* Country */}
      <div className="flex flex-col gap-2 w-full">
        <label className="LabelDefault">Country</label>
        <select className="InputDefault">
          <option>Country</option>
        </select>
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2 w-full">
        <label className="LabelDefault">Phone Number</label>
        <input className="InputDefault" placeholder="Phone" />
      </div>

      {/* Save Changes Button */}
      <div className="col-span-2 flex justify-end">
        <button type="submit" className="ctaBtn font-bold h-11 px-12">
          Save changes
        </button>
      </div>
    </form>
  );
}

export default User_Identification_Credentials;
