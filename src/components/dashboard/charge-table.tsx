import { FC } from "react";
import { format } from "date-fns";
import { ChargingSessionWithFeesAndInvoices } from "@/types/chargingSession";
import PATHS from "@/app/path-config";

export const ChargesTable: FC<{ charges: ChargingSessionWithFeesAndInvoices[] }> = ({ charges }) => {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Invoices</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {charges.map((charge) => (
                  <ChargeRow key={charge.id} charge={charge} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChargeRow: FC<{ charge: ChargingSessionWithFeesAndInvoices }> = ({ charge }) => {
  const { fees } = charge;
  const total = fees?.reduce((acc, fee) => acc + fee.totalDue, 0) ?? 0;
  const firstFee = fees?.[0];
  const currency = firstFee?.currencyCode;
  const chargingFee = fees?.find((fee) => fee.feeType === "CHARGING");
  const chargingAmount = chargingFee?.usageBase ?? 0;
  const chargingUnit = chargingFee?.uom ?? "kwh";
  const invoices = charge.invoices;
  return (
    <tr key={charge.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {charge.chargeStartDateTime ? format(charge.chargeStartDateTime, "MM/dd/yyyy") : ""}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{charge.siteLocationName}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {chargingAmount} {chargingUnit}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {total}
        {currency}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        {invoices.map((invoice) => (
          <a key={invoice.id} href={`${PATHS.invoice}/${invoice.contentId}`} target="_blank" className="text-indigo-600 hover:text-indigo-900">
            {invoice.fileName}
          </a>
        ))}
      </td>
    </tr>
  );
};
