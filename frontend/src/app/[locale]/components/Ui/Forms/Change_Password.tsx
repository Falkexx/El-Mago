function Change_Password() {
  return (
    <form className="w-full h-auto  p-6 bg-white/0 rounded-2xl border border-[#495057] grid grid-cols-2 gap-6">
      {/* First Name */}
      <div className="flex flex-col gap-2 w-full">
        <label className="LabelDefault">Original Password:</label>
        <input className="InputDefault" placeholder="First Name" />
      </div>

      {/* Last Name */}
      <div className="flex flex-col gap-2 w-full">
        <label className="LabelDefault">Confirm Original Password:</label>
        <input className="InputDefault" placeholder="Last Name" />
      </div>

      {/* Country */}
      <div className="flex flex-col gap-2 w-full">
        <label className="LabelDefault">New Password:</label>
        <input className="InputDefault" placeholder="Last Name" />
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2 w-full">
        <label className="LabelDefault">Confirm New Password:</label>
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

export default Change_Password;
