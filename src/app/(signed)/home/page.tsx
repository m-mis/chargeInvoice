import { tesla } from "@/providers/tesla";
import { cookies } from "next/headers";
import { FC } from "react";
import { ChargingHistoryInvoice } from "@/types/tesla";

export default async function Page() {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value ?? "";
  const refreshToken = cookiesStore.get("refreshToken")?.value ?? "";
  const chargingHistory = await tesla.getChargingHistory({
    accessToken,
    refreshToken,
    region: "eu",
  });
  const charges = chargingHistory.data;
  console.log({ chargingHistory });
  return (
    <div>
      home page {charges.length}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Location</th>
            <th>Cost /kw</th>
            <th>Charge</th>
            <th>Net</th>
            <th>Total</th>
            <th>invoice</th>
          </tr>
        </thead>
        <tbody>
          {charges.map((charge) => (
            <tr key={charge.sessionId}>
              <td>{charge.chargeStartDateTime}</td>
              <td>{charge.siteLocationName}</td>
              <td>{charge.fees[0].rateBase}</td>
              <td>{charge.fees[0].usageBase}</td>
              <td>{charge.fees[0].netDue}</td>
              <td>{charge.fees[0].totalBase}</td>
              <td>{<InvoiceName invoices={charge.invoices} accessToken={accessToken} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const InvoiceName: FC<{ invoices: ChargingHistoryInvoice[]; accessToken: string }> = ({ invoices }) => {
  return (
    <div>
      {invoices.map((invoice) => (
        <a key={invoice.contentId} href={`/invoice/${invoice.contentId}`} className="text-blue-500 hover:underline" target="_blank">
          {invoice.fileName}
        </a>
      ))}
    </div>
  );
};
