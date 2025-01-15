import { TeslaFromUserId } from "@/providers/tesla";
import { getCookieSession } from "@/utils/cookies-manager";

export const GET = async (request: Request, { params }: { params: Promise<{ contentId: string }> }) => {
  const routeParams = await params;
  const cookieSession = await getCookieSession();
  if (!cookieSession) {
    return new Response("Unauthorized", { status: 401 });
  }
  const teslaProvider = await TeslaFromUserId(cookieSession.userId);
  const response = await teslaProvider.getChargingInvoice(routeParams.contentId);
  return new Response(response);
};
