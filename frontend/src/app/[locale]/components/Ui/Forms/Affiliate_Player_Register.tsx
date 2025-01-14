"use client";

import InputPhone from "./InputPhone";
import { useForm, SubmitHandler } from "react-hook-form";

export interface PlayerFormData {
  name: string;
  discord: string;
  battleTag: string;
  characterName: string;
  phoneNumber: string;
  cpf: string;
}

interface AffiliatePlayerRegisterProps {
  onSubmit: (data: PlayerFormData) => void;
}

function Affiliate_Player_Register({ onSubmit }: AffiliatePlayerRegisterProps) {
  const { register, handleSubmit, control, setValue } = useForm<PlayerFormData>();

  const submitForm: SubmitHandler<PlayerFormData> = (data) => {
    onSubmit(data); // Passa os dados para o componente pai
  };

  const handlePhoneChange = (phone: string) => {
    setValue("phoneNumber", phone); 
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="flex flex-col gap-6 mt-8"
    >
      <div className="flex flex-col gap-2">
        <label className="LabelDefault">Name</label>
        <input
          {...register("name")}
          className="InputDefault"
          id="name"
          type="text"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="LabelDefault">Discord</label>
        <input
          {...register("discord")}
          className="InputDefault"
          id="discord"
          type="text"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="LabelDefault">Battle TAG</label>
        <input
          {...register("battleTag")}
          className="InputDefault"
          id="battleTag"
          type="text"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="LabelDefault">Character Name</label>
        <input
          {...register("characterName")}
          className="InputDefault"
          id="characterName"
          type="text"
        />
      </div>

      {/* Phone Number Field */}
      <div className="flex flex-col gap-2">
        <InputPhone
          control={control}
          name="phoneNumber"
          onPhoneChange={handlePhoneChange}
        />
      </div>

      {/* CPF Field */}
      <div className="flex flex-col gap-2">
        <label className="LabelDefault">CPF/RG</label>
        <input
          {...register("cpf")}
          className="InputDefault"
          id="cpf"
          type="text"
        />
      </div>
    </form>
  );
}

export default Affiliate_Player_Register;
