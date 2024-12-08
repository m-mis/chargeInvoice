"use server";

import PATHS from "@/app/path-config";
import { fetchChargingSessionsAndSave } from "@/models/charging-session";
import { MAX_PAGE_SIZE } from "@/providers/tesla";
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
