"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function Error() {
  const t = useTranslations("ErrorPage");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorCode = searchParams.get("code");
  console.log(errorCode);
  return (
    <div>
      <h1>{t("title")}</h1>
      {errorCode && <p>{t(`code.${errorCode}`)}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
