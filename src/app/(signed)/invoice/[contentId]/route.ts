// import { tesla } from "@/providers/tesla";
// import { cookies } from "next/headers";

export const GET = async (request: Request) => {
  // const accessToken = (await cookies()).get("accessToken")?.value;
  // if (!accessToken) {
  //   return new Response("Unauthorized", { status: 401 });
  // }
  // const response = await tesla.getChargingInvoice({ accessToken, region: "eu", refreshToken: "" }, params.contentId);
  // console.log("response", response.status);
  // return new Response(await response.blob());
  // // return new Response();
  console.log("Not implemented", request.credentials);
  return new Response("Not implemented");
};
