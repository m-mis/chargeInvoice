"use client";

import { ChargingHistoryInvoice } from "@/types/tesla";
import { FC } from "react";

export const InvoiceName: FC<{ invoices: ChargingHistoryInvoice[] }> = ({ invoices }) => {
  return (
    <div>
      {invoices.map((invoice) => (
        <a key={invoice.contentId} href={`/invoice/${invoice.contentId}`} className="text-blue-500 hover:underline">
          {invoice.fileName}
        </a>
      ))}
    </div>
  );
};
