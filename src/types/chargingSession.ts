import { ChargingSession, ChargingFee, ChargingInvoice } from "@prisma/client";

export type ChargingSessionWithFeesAndInvoices = ChargingSession & {
  fees: ChargingFee[];
  invoices: ChargingInvoice[];
};
