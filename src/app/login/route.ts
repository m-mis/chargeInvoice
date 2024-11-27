import { redirect } from "next/navigation";
import { appUrl } from "@/utils/app";
import { getUserAuthUrl } from "@/providers/tesla";

export const GET = async () => {
  console.log(`${appUrl}/login/callback`);
  return redirect(getUserAuthUrl(`${appUrl}/login/callback`));
};
