import { ApiRequest, UserSession, UserInfo } from "@/types/user";
import { ChargingHistory, UserInfoResponse } from "@/types/tesla";
import { appUrl } from "@/utils/app";

enum TeslaApiEndpoints {
  AUTH = "https://auth.tesla.com",
  EU = "https://fleet-api.prd.eu.vn.cloud.tesla.com",
  NA = "https://fleet-api.prd.na.vn.cloud.tesla.com",
  CN = "https://fleet-api.prd.cn.vn.cloud.tesla.com",
}

enum TeslaApiScopes {
  OFFLINE_ACCESS = "offline_access",
  USER_DATA = "user_data",
  VEHICLE_CHARGING_CMDS = "vehicle_charging_cmds",
}

const getClientId = () => {
  if (!process.env.tesla_api_client_id) throw new Error("Tesla API client ID is not set");
  return process.env.tesla_api_client_id;
};
const getClientSecret = () => {
  if (!process.env.tesla_api_client_secret) throw new Error("Tesla API client secret is not set");
  return process.env.tesla_api_client_secret;
};

const getScopes = (scopes: TeslaApiScopes[]) => {
  return scopes.join(" ");
};

const getUserAuthUrl = () => {
  const url = new URL(`${TeslaApiEndpoints.AUTH}/oauth2/v3/authorize`);
  url.searchParams.set("client_id", getClientId());
  url.searchParams.set("redirect_uri", `${appUrl}/signinAuth`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", getScopes([TeslaApiScopes.OFFLINE_ACCESS, TeslaApiScopes.USER_DATA, TeslaApiScopes.VEHICLE_CHARGING_CMDS]));
  url.searchParams.set("state", "signin");
  return url.toString();
};

const getCodeExchangeUrl = async (code: string): Promise<UserSession> => {
  const url = new URL(`${TeslaApiEndpoints.AUTH}/oauth2/v3/token`);

  const body = {
    grant_type: "authorization_code",
    client_id: getClientId(),
    client_secret: getClientSecret(),
    code,
    redirect_uri: `${appUrl}/signinAuth`,
  };
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
};

const getBaseUrl = (region: ApiRequest["region"]) => {
  return TeslaApiEndpoints[region.toUpperCase() as keyof typeof TeslaApiEndpoints];
};

const requestTeslaApi = async <T>(userInfo: ApiRequest, path: string, method: "GET" | "POST" = "GET", body?: unknown) => {
  const url = new URL(`${getBaseUrl(userInfo.region)}/${path}`);
  const response = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json() as Promise<T>;
};

const getUserInfo = async (userInfo: ApiRequest): Promise<UserInfo> => {
  const response = await requestTeslaApi<UserInfoResponse>(userInfo, "api/1/users/me");

  return {
    id: response.response.vault_uuid,
    email: response.response.email,
    fullName: response.response.full_name,
    accessToken: userInfo.accessToken,
    refreshToken: userInfo.refreshToken,
    region: userInfo.region,
  };
};
const getChargingHistory = async (userInfo: ApiRequest): Promise<ChargingHistory> => {
  return await requestTeslaApi<ChargingHistory>(userInfo, "api/1/dx/charging/history");
};

const getChargingInvoice = async (userInfo: ApiRequest, contentId: string) => {
  return fetch(`${getBaseUrl(userInfo.region)}/api/1/dx/charging/invoice/${contentId}`, {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
    },
  });
};

export const tesla = {
  userAuthUrl: getUserAuthUrl(),
  codeExchangeUrl: getCodeExchangeUrl,
  getUserInfo,
  getChargingHistory,
  getChargingInvoice,
};
