// import prisma from "@/db";
import { TeslaApiRegion } from "@/providers/tesla";
import { encrypt, hash } from "@/utils/crypter";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (email: string, name: string, teslaAccountId: string, teslaVaultId: string, region: TeslaApiRegion) => {
  const encryptedEmail = encrypt(email);
  const emailHash = hash(email);
  const encryptedName = encrypt(name);
  const user = await prisma.user.create({
    data: { email: encryptedEmail, emailHash, name: encryptedName, teslaAccountId, teslaVaultId, region },
  });
  return user;
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
