import { getLanguage } from "@/utils/cookies-manager";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = await getLanguage();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
