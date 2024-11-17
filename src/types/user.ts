export type UserSession = {
  accessToken: string;
  refreshToken: string;
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
