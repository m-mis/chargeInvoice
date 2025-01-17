import { ChargingSessionWithFeesAndInvoices } from "@/types/chargingSession";
import { BoltIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { FC, ReactNode } from "react";

export const ChargeStats: FC<{ charges: ChargingSessionWithFeesAndInvoices[] }> = ({ charges }) => {
  const t = useTranslations("ChargeStats");
  const chargingData = charges.map((charge) => charge.fees.filter((fee) => fee.feeType === "CHARGING")).flat();
  const totalCharging = chargingData.reduce((acc, charge) => acc + charge.usageBase, 0);
  const cost: { [key: string]: number } = {};
  chargingData.forEach((charge) => {
    const currency = charge.currencyCode;
    if (!cost[currency]) cost[currency] = charge.totalDue;
    else cost[currency] += charge.totalDue;
  });
  const costArray = Object.entries(cost)
    .map(([currency, total]) => ({ currency, total }))
    .sort((a, b) => b.total - a.total);
  const mainCost = costArray[0] ?? { currency: "$", total: 0 };
  const otherCosts = costArray.slice(1) ?? [];
  const chargingLocationOccurrences = charges
    .map((charge) => charge.siteLocationName)
    .filter((location) => location !== null)
    .reduce((acc, location) => {
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  const chargingLocationOccurrencesArray = Object.entries(chargingLocationOccurrences)
    .map(([location, occurrences]) => ({ location, occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences);
  const mainChargingLocation = chargingLocationOccurrencesArray[0] ?? { location: "Unknown", occurrences: 0 };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ChargeStatsItem>
        <div className="h-full flex flex-col justify-center content-center">
          <h1 className="text-4xl font-bold text-center">{charges.length}</h1>
          <p className="text-center">{t("numberCharging")}</p>
        </div>
      </ChargeStatsItem>
      <ChargeStatsItem>
        <div className="h-full flex content-center">
          <div className="flex justify-center">
            <BoltIcon className="w-10 h-10 my-auto" />
          </div>
          <div className="w-full content-center">
            <h1 className="text-4xl font-bold text-center">
              {totalCharging}
              <span className="text-sm">kwh</span>
            </h1>
          </div>
        </div>
      </ChargeStatsItem>
      <ChargeStatsItem>
        <div className="h-full flex flex-col justify-center content-center">
          <h1 className="text-4xl font-bold text-center">
            {mainCost.total.toFixed(2)}
            <span className="text-sm">{mainCost.currency}</span>
          </h1>
          {otherCosts.map((cost) => (
            <p key={cost.currency} className="text-center">
              {cost.total.toFixed(2)}
              <span className="text-sm">{cost.currency}</span>
            </p>
          ))}
        </div>
      </ChargeStatsItem>
      <ChargeStatsItem>
        <div className="h-full flex content-center gap-2">
          <div className="flex justify-center">
            <MapPinIcon className="w-10 h-10 my-auto" />
          </div>
          <div className="w-full content-center">
            <p className="text-left">{t("favoriteChargingLocation")}:</p>
            <h1 className="text-4xl font-bold text-center">
              {mainChargingLocation.location}
              <span className="text-sm text-gray opacity-80"> {mainChargingLocation.occurrences}x</span>
            </h1>
          </div>
        </div>
      </ChargeStatsItem>
    </div>
  );
};

const ChargeStatsItem: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="col-span-1 border border-gray rounded-md p-4">{children}</div>;
};
