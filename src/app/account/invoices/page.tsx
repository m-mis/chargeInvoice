// import { tesla } from "@/providers/tesla";
// import { cookies } from "next/headers";
// import { FC } from "react";
// import { ChargingHistoryInvoice } from "@/types/tesla";

import { getChargingSessions } from "@/models/charging-session";
import { getCookieSession } from "@/utils/cookies-manager";
import { redirect } from "next/navigation";
import PATHS from "../../path-config";
import { ChargesTable } from "@/components/dashboard/charge-table";

export default async function Page() {
  const cookieSession = await getCookieSession();
  if (!cookieSession) redirect(PATHS.login);
  const charges = await getChargingSessions(cookieSession.userId);
  return (
    <div>
      <ChargesTable charges={charges} />
    </div>
  );
}

// const InvoiceName: FC<{ invoices: ChargingHistoryInvoice[]; accessToken: string }> = ({ invoices }) => {
//   return (
//     <div>
//       {invoices.map((invoice) => (
//         <a key={invoice.contentId} href={`/invoice/${invoice.contentId}`} className="text-blue-500 hover:underline" target="_blank">
//           {invoice.fileName}
//         </a>
//       ))}
//     </div>
//   );
// };
