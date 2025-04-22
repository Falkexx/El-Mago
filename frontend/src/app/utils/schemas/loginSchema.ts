import { z } from "zod";

// Tipo para a função de tradução
type TranslationFunction = (key: string) => string;

export const getLoginSchema = (t: TranslationFunction, password: string) => ({
  validationMessages: {
    emailInvalid: t("emailInvalid"),
    passwordMin: t("passwordMin"),
    passwordUppercase: t("passwordUppercase"),
    passwordLowercase: t("passwordLowercase"),
    passwordNumber: t("passwordNumber"),
    passwordSpecial: t("passwordSpecial"),
    passwordsDoNotMatch: t("passwordsDoNotMatch"),
  },
  schema: z.object({
    email: z.string().email(t("emailInvalid")),
    password: z
      .string()
      .min(8, t("passwordMin"))
      .regex(/[A-Z]/, t("passwordUppercase"))
      .regex(/[a-z]/, t("passwordLowercase"))
      .regex(/[0-9]/, t("passwordNumber"))
      .regex(/[@#$%^&*()!]/, t("passwordSpecial")),
    confirmPassword: z
      .string()
      .min(8)
      .refine((val) => val === password, t("passwordsDoNotMatch")),
  }),
});