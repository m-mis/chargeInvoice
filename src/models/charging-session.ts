import { ChargingHistory, GetChargingHistoryParams } from "@/types/tesla";
import { getLastUserSession } from "./user-session";
import { Tesla, TeslaApiRegion } from "@/providers/tesla";
import prisma from "@/db";
import { Prisma } from "@prisma/client";

export const fetchChargingSessionsAndSave = async (userId: string, filters?: GetChargingHistoryParams) => {
  const session = await getLastUserSession(userId);
  if (!session) throw new Error("User session not found");
  const tesla = Tesla({ id: session.userId, region: session.user.region as TeslaApiRegion }, session);
  const data = await tesla.getChargingHistory(filters); // TODO: handle errors
  const dataCreated = await createChargingSession(data, userId);
  return {
    totalResults: data.totalResults,
    ...dataCreated,
    data: data.data,
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
  if (!chargingHistoryData)
    return {
      chargingSessions: 0,
      chargingSessionsIds: [],
      chargingFees: 0,
      chargingFeesIds: [],
      chargingInvoices: [],
      chargingInvoicesIds: [],
    };
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

  const createdChargingFeesPromise = prisma.chargingFee.createManyAndReturn({
    data: chargingFeeData.flat(),
    select: {
      id: true,
    },
  });

  const chargingInvoiceData: Prisma.ChargingInvoiceCreateManyInput[][] = chargingHistoryData.map((item) => {
    const invoices = item.invoices ? item.invoices : [];
    return invoices.map((invoice) => {
      const data: Prisma.ChargingInvoiceCreateManyInput = {
        chargingSessionId: chargingSessionIdsMap[item.sessionId],
        contentId: invoice.contentId,
        fileName: invoice.fileName,
        invoiceType: invoice.invoiceType,
      };
      return data;
    });
  });

  const createdChargingInvoicesPromise = prisma.chargingInvoice.createManyAndReturn({
    data: chargingInvoiceData.flat(),
    select: {
      id: true,
      contentId: true,
      fileName: true,
    },
  });

  const [createdChargingFees, createdChargingInvoices] = await Promise.all([createdChargingFeesPromise, createdChargingInvoicesPromise]);
  return {
    chargingSessions: chargingSessionIds.length,
    chargingSessionsIds: chargingSessionIds.map((item) => item.id),
    chargingFees: createdChargingFees.length,
    chargingFeesIds: createdChargingFees.map((item) => item.id),
    chargingInvoices: createdChargingInvoices,
    chargingInvoicesIds: createdChargingInvoices.map((item) => item.id),
  };
};

export const fetchNewChargingSessions = async (userId: string) => {
  // const session = await getLastUserSession(userId);
  // if (!session) throw new Error("User session not found");
  // const tesla = Tesla(session.user.region as TeslaApiRegion, session.accessToken);

  const lastChargingSession = await prisma.chargingSession.findFirst({
    where: {
      userId,
    },
    orderBy: {
      chargeStartDateTime: "desc",
    },
  });

  const lastChargingSessionDate = lastChargingSession?.unlatchDateTime ?? null;

  return await fetchChargingSessionsAndSave(userId, {
    startTime: lastChargingSessionDate ?? undefined,
    endTime: new Date(),
  });
};

export const deleteChargingSession = async (id: string) => {
  await prisma.chargingSession.delete({
    where: { id },
  });
};

export const getChargingSessions = async (userId: string) => {
  return await prisma.chargingSession.findMany({
    where: { userId },
    orderBy: {
      chargeStartDateTime: "desc",
    },
    include: {
      invoices: true,
      fees: true,
    },
  });
};
