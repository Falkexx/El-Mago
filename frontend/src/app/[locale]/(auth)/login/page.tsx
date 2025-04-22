"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { InputField } from "@/app/[locale]/components/Ui/Inputs/InputField";
import { handleSignIn, handleSignUp } from "@/app/utils/auth/auth";
import facebookIcon from "@/midias/Icons/facebookIcon.svg";
import googleIcon from "@/midias/Icons/googleIcon.svg";
import discordIcon from "@/midias/Icons/discordIcon.svg";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("LoginPage");
  const { data: session, status } = useSession();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (activeTab === "login") {
        const success = await handleSignIn(
          formData.email,
          formData.password,
          setErrors,
          t
        );
        if (success) window.location.href = "/";
      } else {
        const success = await handleSignUp(
          {
            name: "Teste",
            country: "Brazil",
            email: formData.email,
            password: formData.password,
          },
          setErrors
        );
        if (success) window.location.href = "/";
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:min-h-screen bg-[#111111] text-foreground flex flex-col md:justify-center items-center">
      <main className="flex items-center justify-center flex-1 w-full">
        <div className="bg-[#1a1a1a] rounded-[24px] p-8 md:p-12 shadow-lg w-[504px] max-w-[90%] md:max-w-[600px] border border-[#43434A]/30">
          <div className="flex justify-center mb-4 md:mb-8">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg w-[220px] h-[54px] md:h-[64px] ${
                  activeTab === tab ? "text-white font-bold" : "text-gray-400"
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>
          <div className="flex mb-4 md:mb-6">
            {(["login", "register"] as const).map((tab) => (
              <div
                key={tab}
                className={`w-[220px] h-[2px] md:h-[3px] ${
                  activeTab === tab ? "bg-purple-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <InputField
              type="email"
              name="email"
              placeholder={t("emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("passwordPlaceholder")}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              showPassword={showPassword}
              togglePassword={handleTogglePassword}
            />
            {activeTab === "register" && (
              <InputField
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={t("confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            )}
            {activeTab === "login" ? (
              <div className="flex items-center justify-between mb-6 md:mb-8 text-sm text-gray-400">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 accent-purple-500" />
                  {t("rememberme")}
                </label>
                <a href="#" className="text-purple-400 hover:text-purple-500">
                  {t("forgotPassword")}
                </a>
              </div>
            ) : (
              <div className="flex items-center mb-6 md:mb-8 text-sm text-gray-400">
                <input
                  type="checkbox"
                  className="mr-2 accent-purple-500"
                  required
                />
                <span>
                  I accept{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-500">
                    Terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-500">
                    Privacy Policy
                  </a>
                </span>
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-3 md:py-4 bg-purple-500 hover:bg-purple-600 text-white rounded font-semibold flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner mr-2"></span>
                  {t("loading")}
                </>
              ) : (
                t(activeTab)
              )}
            </button>
          </form>
          <div className="flex items-center my-6 md:my-8">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="px-2 md:px-4 text-gray-400">{t("or")}</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <div className="flex justify-center gap-4 md:gap-6">
            {[facebookIcon, googleIcon, discordIcon].map((icon, index) => (
              <Link key={index} href="/">
                <Image
                  src={icon}
                  alt="Social Icon"
                  className="w-10 h-10 md:w-12 md:h-12"
                />
              </Link>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;