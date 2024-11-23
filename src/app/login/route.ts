import { redirect } from "next/navigation";
import { tesla } from "@/providers/tesla";

export const GET = async () => {
  return redirect(tesla.getUserAuthUrl("/login/callback"));
};
