"use server";

import { fetchChargingSessionsAndSave } from "@/models/charging-session";
import { MAX_PAGE_SIZE } from "@/providers/tesla";

export const fetchChargingHistory = async (pageNo: number, pageSize: number = MAX_PAGE_SIZE) => {
  const data = await fetchChargingSessionsAndSave({
    pageNo,
    pageSize,
  });
  return data;
};
