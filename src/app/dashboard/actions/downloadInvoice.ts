"use server";

import { cookies } from "next/headers";

export const downloadInvoice = async (contentId: string) => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  console.log(accessToken);
  const response = await fetch(`https://fleet-api.prd.eu.vn.cloud.tesla.com/api/1/dx/charging/invoice/${contentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.status);
  const buffer = await response.arrayBuffer();
  return Array.from(new Uint8Array(buffer));
};
