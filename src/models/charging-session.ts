import { ChargingHistory, GetChargingHistoryParams } from "@/types/tesla";
import { getCookieSession } from "@/utils/cookies-manager";
import { redirect } from "next/navigation";
import { getLastUserSession } from "./user-session";
import PATHS from "@/app/path-config";
import { Tesla } from "@/providers/tesla";
import prisma from "@/db";
import { Prisma } from "@prisma/client";

export const fetchChargingSessionsAndSave = async (filters?: GetChargingHistoryParams) => {
  console.log("fetchChargingHistory");
  const cookieSession = await getCookieSession();
  if (!cookieSession) redirect(PATHS.login);
  const session = await getLastUserSession(cookieSession.userId);
  if (!session) redirect(PATHS.login);
  const tesla = Tesla(cookieSession.region, session.accessToken);
  const data = await tesla.getChargingHistory(filters);
  const dataCreated = await createChargingSession(data, cookieSession.userId);
  return {
    totalResults: data.totalResults,
    ...dataCreated,
  };
};
// const mapChargingHistoryDataToChargingSession = (data: ChargingHistoryData, userId: string) => {
//   return data.map((item) => ({
//     vin: item.vin,
//     userId,
//     startDate: item.chargeStartDateTime,
//     endDate: item.chargeStopDateTime,
//   }));
// };

const createChargingSession = async (data: ChargingHistory, userId: string) => {
  const { data: chargingHistoryData } = data;
  const chargeSessionCreateData: Prisma.ChargingSessionCreateManyInput[] = chargingHistoryData.map((item) => ({
    vin: item.vin,
    userId,
    vehicleMakeType: item.vehicleMakeType,
    unlatchDateTime: item.unlatchDateTime,
    siteLocationName: item.siteLocationName,
    countryCode: item.countryCode,
    billingType: item.billingType,
    chargeStartDateTime: item.chargeStartDateTime,
    chargeStopDateTime: item.chargeStopDateTime,
    sessionId: item.sessionId,
  }));
  const chargingSessionIds = await prisma.chargingSession.createManyAndReturn({
    data: chargeSessionCreateData,
    select: {
      id: true,
      sessionId: true,
    },
  });
  const chargingSessionIdsMap = chargingSessionIds.reduce((acc, item) => {
    acc[item.sessionId] = item.id;
    return acc;
  }, {} as { [key: number]: string });

  const chargingFeeData: Prisma.ChargingFeeCreateManyInput[][] = chargingHistoryData.map((item) =>
    item.fees.map((fee) => {
      const data: Prisma.ChargingFeeCreateManyInput = {
        chargingSessionId: chargingSessionIdsMap[item.sessionId],
        currencyCode: fee.currencyCode,
        feeType: fee.feeType,
        pricingType: fee.pricingType,
        rateBase: fee.rateBase,
        isPaid: fee.isPaid,
        rateTier1: fee.rateTier1,
        rateTier2: fee.rateTier2,
        usageBase: fee.usageBase,
        usageTier1: fee.usageTier1,
        usageTier2: fee.usageTier2,
        netDue: fee.netDue,
        totalBase: fee.totalBase,
        totalTier1: fee.totalTier1,
        totalTier2: fee.totalTier2,
        totalDue: fee.totalDue,
        rateTier3: fee.rateTier3,
        usageTier3: fee.usageTier3,
        totalTier3: fee.totalTier3,
        rateTier4: fee.rateTier4,
        usageTier4: fee.usageTier4,
        totalTier4: fee.totalTier4,
        status: fee.status,
        uom: fee.uom,
      };
      return data;
    })
  );

  const createdChargingFeesPromise = prisma.chargingFee.createMany({
    data: chargingFeeData.flat(),
  });

  const chargingInvoiceData: Prisma.ChargingInvoiceCreateManyInput[][] = chargingHistoryData.map((item) =>
    item.invoices.map((invoice) => {
      const data: Prisma.ChargingInvoiceCreateManyInput = {
        chargingSessionId: chargingSessionIdsMap[item.sessionId],
        contentId: invoice.contentId,
        fileName: invoice.fileName,
        invoiceType: invoice.invoiceType,
      };
      return data;
    })
  );

  const createdChargingInvoicesPromise = prisma.chargingInvoice.createMany({
    data: chargingInvoiceData.flat(),
  });

  const [createdChargingFees, createdChargingInvoices] = await Promise.all([createdChargingFeesPromise, createdChargingInvoicesPromise]);
  return {
    chargingSessions: chargingSessionIds.length,
    chargingFees: createdChargingFees.count,
    chargingInvoices: createdChargingInvoices.count,
  };
};
