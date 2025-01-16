import { TeslaApiRegion } from "@/providers/tesla";
import { User } from "@prisma/client";

export type UserSession = {
  userId: string;
  userName: string;
  userEmail: string;
  region: TeslaApiRegion;
  newUser: boolean;
};

export type ApiRequest = {
  accessToken: string;
  refreshToken: string;
  region: "eu" | "na" | "cn";
};

export type UserInfo = {
  id: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken: string;
  region: "eu" | "na" | "cn";
};

export type UserDecrypted = Omit<User, "emailSendTo"> & {
  email: string;
  region: TeslaApiRegion;
  emailSendTo?: string[];
};
