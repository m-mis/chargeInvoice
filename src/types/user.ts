import { TeslaApiRegion } from "@/providers/tesla";

export type UserSession = {
  userId: string;
  userName: string;
  userEmail: string;
  region: TeslaApiRegion;
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
