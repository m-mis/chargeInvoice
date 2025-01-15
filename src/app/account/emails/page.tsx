import { getCookieSession } from "@/utils/cookies-manager";
import { redirect } from "next/navigation";
import PATHS from "@/app/path-config";
import { getUserEmailsSendTo, updateUserEmailSendTo } from "@/models/user";
import EmailsForm from "@/components/dashboard/emails-form";

export default async function Page() {
  const cookieSession = await getCookieSession();
  if (!cookieSession) redirect(PATHS.login);
  const emailsSendTo = await getUserEmailsSendTo(cookieSession.userId);

  const updateEmailsSendTo = async (emails: string[]) => {
    "use server";
    await updateUserEmailSendTo(cookieSession.userId, emails);
  };

  return <EmailsForm initialEmails={emailsSendTo} onSubmit={updateEmailsSendTo} />;
}
