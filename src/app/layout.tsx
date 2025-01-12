import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
// import { getCookieSession } from "@/utils/cookies-manager";
// import { redirect } from "next/navigation";
// import PATHS from "./path-config";

export const metadata: Metadata = {
  title: "Charge invoices",
  description: "Simplify your life",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} className="h-full">
      <body className={`antialiased h-full`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
