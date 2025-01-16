// import prisma from "@/db";
import { TeslaApiRegion } from "@/providers/tesla";
import { encrypt, hash, decrypt } from "@/utils/crypter";

import { decodeUserSession } from "./user-session";
import prisma from "@/db";
import { UserDecrypted } from "@/types/user";
import { User } from "@prisma/client";

const EMAIL_SEND_TO_SEPARATOR = ";";

const decodeEmailSendTo = (emailSendTo: string | null | undefined) => {
  if (!emailSendTo) return undefined;
  return emailSendTo.split(EMAIL_SEND_TO_SEPARATOR).map((emailCrypt) => decrypt(emailCrypt.trim()));
};

const decodeUser = (user: User): UserDecrypted => {
  return {
    ...user,
    email: decrypt(user.email),
    name: user.name ? decrypt(user.name) : null,
    region: user.region as TeslaApiRegion,
    emailSendTo: decodeEmailSendTo(user.emailSendTo) ?? [],
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

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return decodeUser(user);
};

export const getUserByTeslaAccountId = async (teslaAccountId: string) => {
  const user = await prisma.user.findUnique({ where: { teslaAccountId } });
  if (!user) return null;
  return decodeUser(user);
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

export const updateUserTermsAndConditionsAcceptedAt = async (userId: string) => {
  await prisma.user.update({ where: { id: userId }, data: { termsAndConditionsAcceptedAt: new Date() } });
};

export const updateUserFirstDownloadCompletedAt = async (userId: string) => {
  await prisma.user.update({ where: { id: userId }, data: { firstDownloadCompletedAt: new Date() } });
};
