// import prisma from "@/db";
import { TeslaApiRegion } from "@/providers/tesla";
import { encrypt, hash, decrypt } from "@/utils/crypter";

import { PrismaClient } from "@prisma/client";
import { decodeUserSession } from "./user-session";
const prisma = new PrismaClient();

const decodeUser = <T extends { email: string; name?: string | null; region: string | null }>(user: T) => {
  return {
    ...user,
    email: decrypt(user.email),
    name: user.name ? decrypt(user.name) : undefined,
    region: user.region as TeslaApiRegion,
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
