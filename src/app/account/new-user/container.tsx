"use client";

import { ButtonBlue } from "@/components/button";
import { UserDecrypted } from "@/types/user";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { acceptTAndC, completeFirstDownload, fetchChargingHistory } from "./action";
import { ProgressBar } from "@/components/progress-bar";
import { redirect } from "next/navigation";
import PATHS from "@/app/path-config";

export const NewUser: FC<{ user: UserDecrypted }> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTandCAccepted, setIsTandCAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const t = useTranslations("NewUsePage");

  const handleAcceptTAndC = async () => {
    setIsLoading(true);
    await acceptTAndC(user);
    setIsTandCAccepted(true);
    setMessage(t("fetchingSessions", { number: 0, total: "?" }));
    const data = await fetchChargingHistory(1);
    const numberOfChargingSessions = data.totalResults;
    let numberOfChargingSessionsImported = data.data?.length ?? 0;
    setMessage(t("fetchingSessions", { number: numberOfChargingSessionsImported, total: numberOfChargingSessions }));
    const numberOfPages = Math.ceil(numberOfChargingSessions / numberOfChargingSessionsImported);
    setProgress(numberOfChargingSessionsImported / numberOfChargingSessions);

    for (let i = 2; i <= numberOfPages; i++) {
      const data = await fetchChargingHistory(i);
      numberOfChargingSessionsImported += data.data?.length ?? 0;
      setMessage(t("fetchingSessions", { number: numberOfChargingSessionsImported, total: numberOfChargingSessions }));
      setProgress(numberOfChargingSessionsImported / numberOfChargingSessions);
    }
    setMessage(t("fetchingSessionsCompleted"));
    setIsLoading(false);
    setMessage(t("updateUser"));
    await completeFirstDownload(user);
    redirect(PATHS.dashboard);
  };

  return (
    <div className="w-full h-full">
      <h1>
        {t("title", {
          name: user.name,
        })}
      </h1>
      {!isTandCAccepted && (
        <>
          <p className="mt-2">
            {t.rich("t&c", {
              a: (chunks) => (
                <a href="/terms-and-conditions" target="_blank" className="text-gray underline decoration-gray">
                  {chunks}
                </a>
              ),
            })}
          </p>
          <ButtonBlue onClick={handleAcceptTAndC} disabled={isLoading}>
            {t("acceptT&C")}
          </ButtonBlue>
        </>
      )}
      {isTandCAccepted && (
        <div>
          <ProgressBar percentage={progress} />
          <p className="mt-1 text-gray">{message}</p>
        </div>
      )}
    </div>
  );
};
