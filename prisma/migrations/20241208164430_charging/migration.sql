-- DropForeignKey
ALTER TABLE "ChargingFee" DROP CONSTRAINT "ChargingFee_chargingSessionId_fkey";

-- DropForeignKey
ALTER TABLE "ChargingInvoice" DROP CONSTRAINT "ChargingInvoice_chargingSessionId_fkey";

-- AddForeignKey
ALTER TABLE "ChargingFee" ADD CONSTRAINT "ChargingFee_chargingSessionId_fkey" FOREIGN KEY ("chargingSessionId") REFERENCES "ChargingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargingInvoice" ADD CONSTRAINT "ChargingInvoice_chargingSessionId_fkey" FOREIGN KEY ("chargingSessionId") REFERENCES "ChargingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
