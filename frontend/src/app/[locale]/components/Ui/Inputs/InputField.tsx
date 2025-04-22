import React from "react";
import Image from "next/image";
import envelopeIcon from "@/midias/Icons/envelopeIcon.svg";
import lockIcon from "@/midias/Icons/lockIcon.svg";
import eyeOffIcon from "@/midias/Icons/eyeOffIcon.svg";

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showPassword?: boolean;
  togglePassword?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  showPassword,
  togglePassword,
}) => (
  <div className="mb-4 md:mb-6 relative">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 pr-4 py-2 md:py-3 bg-[#2c2c2c] text-white rounded border ${
        error ? "border-red-500" : "border-gray-600"
      } focus:outline-none focus:border-purple-500`}
      required
    />
    <Image
      src={name === "email" ? envelopeIcon : lockIcon}
      alt={`${name} Icon`}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400"
    />
    {name === "password" && togglePassword && (
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <Image
          src={eyeOffIcon}
          alt="Toggle Password Visibility"
          className="w-5 h-5 md:w-6 md:h-6"
        />
      </button>
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);