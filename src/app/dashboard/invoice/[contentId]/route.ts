import { TeslaFromUserId } from "@/providers/tesla";
import { getCookieSession } from "@/utils/cookies-manager";

export const GET = async (request: Request, { params }: { params: { contentId: string } }) => {
  const cookieSession = await getCookieSession();
  if (!cookieSession) {
    return new Response("Unauthorized", { status: 401 });
  }
  const teslaProvider = await TeslaFromUserId(cookieSession.userId);
  const response = await teslaProvider.getChargingInvoice(params.contentId);
  return new Response(response);
};
