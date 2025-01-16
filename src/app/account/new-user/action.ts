"use server";

import PATHS from "@/app/path-config";
import { fetchChargingSessionsAndSave } from "@/models/charging-session";
import { updateUserFirstDownloadCompletedAt, updateUserTermsAndConditionsAcceptedAt } from "@/models/user";
import { MAX_PAGE_SIZE } from "@/providers/tesla";
import { UserDecrypted } from "@/types/user";
import { getCookieSession } from "@/utils/cookies-manager";
import { redirect } from "next/navigation";

export const fetchChargingHistory = async (pageNo: number, pageSize: number = MAX_PAGE_SIZE) => {
  const cookieSession = await getCookieSession();
  if (!cookieSession) redirect(PATHS.login);
  const data = await fetchChargingSessionsAndSave(cookieSession.userId, {
    pageNo,
    pageSize,
  });
  return data;
};

export const acceptTAndC = async (user: UserDecrypted) => {
  await updateUserTermsAndConditionsAcceptedAt(user.id);
};

export const completeFirstDownload = async (user: UserDecrypted) => {
  await updateUserFirstDownloadCompletedAt(user.id);
};
