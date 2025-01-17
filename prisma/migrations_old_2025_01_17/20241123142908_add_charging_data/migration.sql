-- CreateTable
CREATE TABLE "ChargingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "vin" TEXT,
    "siteLocationName" TEXT,
    "chargeStartDateTime" TIMESTAMP(3),
    "chargeStopDateTime" TIMESTAMP(3),
    "unlatchDateTime" TIMESTAMP(3),
    "countryCode" TEXT,
    "billingType" TEXT,
    "vehicleMakeType" TEXT,

    CONSTRAINT "ChargingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChargingFee" (
    "id" TEXT NOT NULL,
    "chargingSessionId" TEXT NOT NULL,
    "feeType" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "pricingType" TEXT NOT NULL,
    "rateBase" DOUBLE PRECISION NOT NULL,
    "rateTier1" DOUBLE PRECISION NOT NULL,
    "rateTier2" DOUBLE PRECISION NOT NULL,
    "rateTier3" DOUBLE PRECISION,
    "rateTier4" DOUBLE PRECISION,
    "usageBase" DOUBLE PRECISION NOT NULL,
    "usageTier1" DOUBLE PRECISION NOT NULL,
    "usageTier2" DOUBLE PRECISION NOT NULL,
    "usageTier3" DOUBLE PRECISION,
    "usageTier4" DOUBLE PRECISION,
    "totalBase" DOUBLE PRECISION NOT NULL,
    "totalTier1" DOUBLE PRECISION NOT NULL,
    "totalTier2" DOUBLE PRECISION NOT NULL,
    "totalTier3" DOUBLE PRECISION,
    "totalTier4" DOUBLE PRECISION,
    "totalDue" DOUBLE PRECISION NOT NULL,
    "netDue" DOUBLE PRECISION NOT NULL,
    "uom" TEXT,
    "isPaid" BOOLEAN NOT NULL,
    "status" TEXT,

    CONSTRAINT "ChargingFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChargingInvoice" (
    "id" TEXT NOT NULL,
    "chargingSessionId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "invoiceType" TEXT NOT NULL,

    CONSTRAINT "ChargingInvoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChargingSession" ADD CONSTRAINT "ChargingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargingFee" ADD CONSTRAINT "ChargingFee_chargingSessionId_fkey" FOREIGN KEY ("chargingSessionId") REFERENCES "ChargingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargingInvoice" ADD CONSTRAINT "ChargingInvoice_chargingSessionId_fkey" FOREIGN KEY ("chargingSessionId") REFERENCES "ChargingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
