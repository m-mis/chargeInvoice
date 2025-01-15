"use server";

import PATHS from "@/app/path-config";
import { deleteCookieSession, setLanguage } from "@/utils/cookies-manager";
import { redirect } from "next/navigation";

export const changeLanguage = async (lang: string) => {
  await setLanguage(lang);
};

export const logout = async () => {
  await deleteCookieSession();
  redirect(PATHS.home);
};
