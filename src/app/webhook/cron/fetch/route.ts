import { Resend } from "resend";
import { fetchNewChargingSessions } from "@/models/charging-session";
import { getUsersForCron } from "@/models/user";
import { Tesla } from "@/providers/tesla";
import { NextRequest, NextResponse } from "next/server";
import { blobToBuffer } from "@/utils/blob";

const resend = new Resend(process.env.EMAIL_RESEND_API_KEY);

export const GET = async (request: NextRequest) => {
  //TODO check authorization
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await getUsersForCron();

  const usersPromise = users.map(async (user) => (user.teslaAccountId ? { ...user, chargingSessions: await fetchNewChargingSessions(user.id) } : null));
  const usersChargingSessions = await Promise.all(usersPromise);
  const userDataSend = usersChargingSessions
    .filter((user) => user && user.chargingSessions.totalResults > 0)
    .map(async (user) => {
      if (!user) return;

      const tesla = Tesla(user, user.session);
      const invoicesPDFs = user.chargingSessions.chargingInvoices.map((item) => ({
        fileName: item.fileName,
        pdfBlob: tesla.getChargingInvoice(item.contentId),
      }));
      const invoicesPDFsAttachments = await Promise.all(
        invoicesPDFs.map(async (invoiceData) => ({
          filename: invoiceData.fileName,
          content: await blobToBuffer(await invoiceData.pdfBlob),
        }))
      );
      try {
        const emailsend = await resend.emails.send({
          from: "invoices@polarwind.be",
          to: user?.email,
          subject: "New charging sessions",
          html: "You have new Tesla charging sessions",
          attachments: invoicesPDFsAttachments,
        });
        console.log("Email sent", emailsend);
      } catch (error) {
        console.error("Error sending email", error);
      }
    });
  await Promise.all(userDataSend);
  return NextResponse.json({ message: "ok" });
};
