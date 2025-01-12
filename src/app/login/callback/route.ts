import PATHS from "@/app/path-config";
import { ERROR_CODES } from "@/error-codes";
import { createUser, getUserByTeslaAccountId } from "@/models/user";
import { createUserSession } from "@/models/user-session";
import { TeslaApiRegion, TeslaInit } from "@/providers/tesla";
import { setCookieSession } from "@/utils/cookies-manager";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  if (!code) {
    return redirect(PATHS.errorCode(ERROR_CODES.tesla.callback.noCode));
  }
  const state = searchParams.get("state");
  if (!state) {
    return redirect(PATHS.errorCode(ERROR_CODES.tesla.callback.noState));
  }

  const { teslaUserInfo, codeExchange, account_id, ou_code } = await TeslaInit(code);

  let newUser = false;
  let user = await getUserByTeslaAccountId(account_id);
  if (!user) {
    user = await createUser(teslaUserInfo.response.email, teslaUserInfo.response.full_name, account_id, teslaUserInfo.response.vault_uuid, ou_code);
    newUser = true;
  }

  const userSessionPromise = createUserSession(user.id, codeExchange.access_token, codeExchange.refresh_token, codeExchange.expires_in);

  const setCookieSessionPromise = setCookieSession({
    userId: user.id,
    userEmail: teslaUserInfo.response.email,
    userName: teslaUserInfo.response.full_name,
    region: user.region as TeslaApiRegion,
  });

  await Promise.all([userSessionPromise, setCookieSessionPromise]);

  redirect(newUser ? PATHS.newUser : PATHS.dashboard);
}
