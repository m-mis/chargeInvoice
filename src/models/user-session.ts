import prisma from "@/db";
import { refreshTeslaToken } from "@/providers/tesla";
import { decrypt, encrypt } from "@/utils/crypter";

export const createUserSession = async (userId: string, accessToken: string, refreshToken: string, expiresIn: number) => {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  const accessTokenEncrypted = encrypt(accessToken);
  const refreshTokenEncrypted = encrypt(refreshToken);
  const userSession = await prisma.userSession.create({
    data: {
      userId,
      accessToken: accessTokenEncrypted,
      refreshToken: refreshTokenEncrypted,
      expiresAt,
    },
    include: {
      user: {
        select: {
          region: true,
        },
      },
    },
  });
  return decodeUserSession(userSession);
};

export const decodeUserSession = <T extends { accessToken: string; refreshToken: string }>(userSession: T) => {
  return {
    ...userSession,
    accessToken: decrypt(userSession.accessToken),
    refreshToken: decrypt(userSession.refreshToken),
  };
};

export const getLastUserSession = async (userId: string) => {
  const userSession = await prisma.userSession.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          region: true,
        },
      },
    },
  });
  if (!userSession) return null;
  return decodeUserSession(userSession);
};

export const refreshUserSession = async (userId: string, refreshToken: string) => {
  const data = await refreshTeslaToken(refreshToken);
  return createUserSession(userId, data.access_token, data.refresh_token, data.expires_in);
};
