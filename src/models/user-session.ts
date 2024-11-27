import prisma from "@/db";
import { refreshTeslaToken } from "@/providers/tesla";
import { decrypt, encrypt } from "@/utils/crypter";
import { UserSession } from "@prisma/client";

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
  });
  return userSession;
};

export const getLastUserSession = async (userId: string) => {
  let userSession = await prisma.userSession.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  if (!userSession) return null;
  const expiresAt = userSession.expiresAt;
  if (expiresAt < new Date()) {
    console.log("Refreshing user session");
    userSession = await refreshUserSession(userSession);
  }
  return {
    ...userSession,
    accessToken: decrypt(userSession.accessToken),
    refreshToken: decrypt(userSession.refreshToken),
  };
};

const refreshUserSession = async (userSession: UserSession) => {
  const { refreshToken } = userSession;
  const data = await refreshTeslaToken(decrypt(refreshToken));
  return createUserSession(userSession.userId, data.access_token, data.refresh_token, data.expires_in);
};
