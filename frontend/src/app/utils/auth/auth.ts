import { signIn } from "next-auth/react";

interface SignUpData {
  name: string;
  country: string;
  email: string;
  password: string;
}

export const handleSignUp = async (
  data: SignUpData,
  setErrors: (errors: Record<string, string>) => void
) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      setErrors({ email: responseData.message || "Erro ao registrar" });
      return false;
    }

    const loginResponse = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (loginResponse?.error) {
      setErrors({ password: "Erro ao fazer login após registro" });
      return false;
    }

    return true;
  } catch (err) {
    setErrors({ email: "Erro inesperado. Tente novamente." });
    console.error("Erro ao registrar:", err);
    return false;
  }
};

export const handleSignIn = async (
  email: string,
  password: string,
  setErrors: (errors: Record<string, string>) => void,
  t: (key: string) => string
) => {
  const response = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (response?.error) {
    setErrors({ password: t("invalidCredentials") });
    return false;
  }

  return true;
};