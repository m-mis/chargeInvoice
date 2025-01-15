// import prisma from "@/db";
import { TeslaApiRegion } from "@/providers/tesla";
import { encrypt, hash, decrypt } from "@/utils/crypter";

import { decodeUserSession } from "./user-session";
import prisma from "@/db";

const EMAIL_SEND_TO_SEPARATOR = ";";

const decodeEmailSendTo = (emailSendTo: string | null | undefined) => {
  if (!emailSendTo) return undefined;
  return emailSendTo.split(EMAIL_SEND_TO_SEPARATOR).map((emailCrypt) => decrypt(emailCrypt.trim()));
};

const decodeUser = <T extends { email: string; name?: string | null; region: string | null; emailSendTo?: string | null }>(user: T) => {
  return {
    ...user,
    email: decrypt(user.email),
    name: user.name ? decrypt(user.name) : undefined,
    region: user.region as TeslaApiRegion,
    emailSendTo: decodeEmailSendTo(user.emailSendTo),
  };
};

export const createUser = async (email: string, name: string, teslaAccountId: string, teslaVaultId: string, region: TeslaApiRegion) => {
  const encryptedEmail = encrypt(email);
  const emailHash = hash(email);
  const encryptedName = encrypt(name);
  const user = await prisma.user.create({
    data: { email: encryptedEmail, emailHash, name: encryptedName, teslaAccountId, teslaVaultId, region },
  });
  return decodeUser(user);
};

export const getUserByEmail = async (email: string) => {
  const hashedEmail = hash(email);
  const user = await prisma.user.findUnique({ where: { emailHash: hashedEmail } });
  return user;
};

export const getUserByTeslaAccountId = async (teslaAccountId: string) => {
  const user = await prisma.user.findUnique({ where: { teslaAccountId } });
  return user;
};

export const getUsersForCron = async () => {
  const users = await prisma.user.findMany({
    include: {
      sessions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
  return users.map((user) => ({ ...decodeUser(user), session: decodeUserSession(user.sessions[0]) }));
};

export const getUserWithLastSession = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      sessions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
  if (!user) return null;
  return {
    ...decodeUser(user),
    session: decodeUserSession(user.sessions[0]),
  };
};

export const getUserEmailsSendTo = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return decodeEmailSendTo(user?.emailSendTo);
};

export const updateUserEmailSendTo = async (userId: string, emailsSendTo: string[]) => {
  const encryptedEmailsSendTo = emailsSendTo.map((email) => encrypt(email));
  const emailSendTo = encryptedEmailsSendTo.join(EMAIL_SEND_TO_SEPARATOR);
  await prisma.user.update({ where: { id: userId }, data: { emailSendTo } });
};
