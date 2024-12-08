"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const t = useTranslations("ErrorPage");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorCode = searchParams.get("code");

  return (
    <div>
      <h1>{t("title")}</h1>
      {errorCode && <p>{t(`code.${errorCode}`)}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default function Error() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
