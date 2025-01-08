import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: any };
}) {
  const locale = params?.locale; // Garantir que params existe antes de acessar locale

  // Validação do locale
  if (!locale || !routing.locales.includes(locale)) {
    notFound();
  }

  // Obtém mensagens com base no locale
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col bg-[#111111] fontDefault">
        <Header />
        <main className="flex-1">
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
