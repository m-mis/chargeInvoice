import { UserSession } from "@/types/user";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const COOKIE_SESSION_NAME = "session";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

export const setCookieSession = async (data: UserSession) => {
  const cookiesStore = await cookies();
  const token = jwt.sign(data, JWT_SECRET);
  cookiesStore.set(COOKIE_SESSION_NAME, token, {
    maxAge: COOKIE_MAX_AGE,
  });
};

export const getCookieSession = async (): Promise<UserSession | null> => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(COOKIE_SESSION_NAME)?.value;
  return token ? (jwt.verify(token, JWT_SECRET) as UserSession) : null;
};
