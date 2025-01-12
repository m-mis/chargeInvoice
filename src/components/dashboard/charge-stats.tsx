import { ChargingSessionWithFeesAndInvoices } from "@/types/chargingSession";
import { FC } from "react";

export const ChargeStats: FC<{ charges: ChargingSessionWithFeesAndInvoices[] }> = ({ charges }) => {
  const chargingFees = charges.map((charge) => charge.fees.filter((fee) => fee.feeType === "CHARGING")).flat();
  const totalCharging = chargingFees.reduce((acc, charge) => acc + charge.usageBase, 0);
  const totalCost = chargingFees.reduce((acc, charge) => acc + charge.totalBase, 0);
  return (
    <div>
      <div>Total Charging: {charges.length}</div>
      <div>Total kwh: {totalCharging}</div>
      <div>Total Cost: {totalCost}</div>
    </div>
  );
};
