import { tesla } from "@/providers/tesla";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  console.log(code, state);
  const userSession = await tesla.codeExchangeUrl(code as string);
  console.log(userSession);
  const cookiesStore = await cookies();
  cookiesStore.set("accessToken", userSession.accessToken);
  cookiesStore.set("refreshToken", userSession.refreshToken);
  redirect("/tt");
}
