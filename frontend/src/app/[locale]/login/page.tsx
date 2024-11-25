"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import facebookIcon from "@/midias/icons/facebookIcon.svg";
import googleIcon from "@/midias/icons/googleIcon.svg";
import discordIcon from "@/midias/icons/discordIcon.svg";
import envelopeIcon from "@/midias/icons/envelopeIcon.svg";
import lockIcon from "@/midias/icons/lockIcon.svg";
import eyeOffIcon from "@/midias/icons/eyeOffIcon.svg";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const t = useTranslations("LoginPage");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputField = (type: string, name: string, placeholder: string) => (
    <div className="mb-4 md:mb-6 relative">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 md:py-3 bg-[#2c2c2c] text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
        required
      />
      <Image
        src={name === "email" ? envelopeIcon : lockIcon}
        alt={`${name} Icon`}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400"
      />
      {name === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <Image src={eyeOffIcon} alt="Toggle Password Visibility" className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
    </div>
  );
    return (
    <div className="md:min-h-screen bg-[#111111] text-foreground flex flex-col md:justify-center items-center">
      <main className="flex items-center justify-center flex-1 w-full">
        <div className="bg-[#1a1a1a] rounded-[24px] p-8 md:p-12 shadow-lg w-[504px] max-w-[90%] md:max-w-[600px] border border-[#43434A]/30">
          <div className="flex justify-center mb-4 md:mb-8">
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg w-[220px] h-[54px] md:h-[64px] ${
                  activeTab === tab ? "text-white font-bold" : "text-gray-400"
                }`}
              >
                {tab === "login" ? "Log In" : "Register"}
              </button>
            ))}
          </div>
          <div className="flex mb-4 md:mb-6">
            {["login", "register"].map((tab) => (
              <div
                key={tab}
                className={`w-[220px] h-[2px] md:h-[3px] ${
                  activeTab === tab ? "bg-purple-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
          <form onSubmit={(e) => (e.preventDefault(), console.log(formData))}>
            {inputField("email", "email", "Email")}
            {inputField(showPassword ? "text" : "password", "password", "Password")}
            {activeTab === "register" &&
              inputField(showPassword ? "text" : "password", "confirmPassword", "Re-type password")}
            {activeTab === "login" ? (
              <div className="flex items-center justify-between mb-6 md:mb-8 text-sm text-gray-400">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 accent-purple-500" />
                  {t("rememberme")}
                </label>
                <a href="#" className="text-purple-400 hover:text-purple-500">{t("forgotPassword")}</a>
              </div>
            ) : (
              <div className="flex items-center mb-6 md:mb-8 text-sm text-gray-400">
                <input type="checkbox" className="mr-2 accent-purple-500" required />
                <span>
                  I accept{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-500">Terms and conditions</a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-500">Privacy Policy</a>
                </span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 md:py-4 bg-purple-500 hover:bg-purple-600 text-white rounded font-semibold"
            >
              {activeTab === "login" ? "Log In" : "Register"}
            </button>
          </form>
          <div className="flex items-center my-6 md:my-8">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="px-2 md:px-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <div className="flex justify-center gap-4 md:gap-6">
            {[facebookIcon, googleIcon, discordIcon].map((icon, index) => (
              <Link key={index} href="/">
                <Image src={icon} alt="Social Icon" className="w-10 h-10 md:w-12 md:h-12" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default LoginPage;
