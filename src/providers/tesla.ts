import jwt from "jsonwebtoken";
import { ChargingHistory, CodeExchange, GetChargingHistoryParams, TeslaBearerTokenData, UserInfoResponse } from "@/types/tesla";
import { appUrl } from "@/utils/app";
import PATHS from "@/app/path-config";
import { refreshUserSession } from "@/models/user-session";
import { getUserWithLastSession } from "@/models/user";

export const MAX_PAGE_SIZE = 50;

export enum TeslaApiRegion {
  EU = "EU",
  NA = "NA",
  CN = "CN",
}

enum TeslaApiEndpoints {
  AUTH = "https://auth.tesla.com",
  EU = "https://fleet-api.prd.eu.vn.cloud.tesla.com",
  NA = "https://fleet-api.prd.na.vn.cloud.tesla.com",
  CN = "https://fleet-api.prd.cn.vn.cloud.tesla.com",
}

export enum TeslaApiScopes {
  OFFLINE_ACCESS = "offline_access",
  USER_DATA = "user_data",
  VEHICLE_CHARGING_CMDS = "vehicle_charging_cmds",
}

const getClientId = () => {
  if (!process.env.TESLA_API_CLIENT_ID) throw new Error("Tesla API client ID is not set");
  return process.env.TESLA_API_CLIENT_ID;
};
const getClientSecret = () => {
  if (!process.env.TESLA_API_CLIENT_SECRET) throw new Error("Tesla API client secret is not set");
  return process.env.TESLA_API_CLIENT_SECRET;
};

const getScopes = (scopes: TeslaApiScopes[]) => {
  return scopes.join(" ");
};

export const getUserAuthUrl = (callbackUrl: string) => {
  const url = new URL(`${TeslaApiEndpoints.AUTH}/oauth2/v3/authorize`);
  url.searchParams.set("client_id", getClientId());
  url.searchParams.set("redirect_uri", callbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", getScopes([TeslaApiScopes.OFFLINE_ACCESS, TeslaApiScopes.USER_DATA, TeslaApiScopes.VEHICLE_CHARGING_CMDS]));
  url.searchParams.set("state", "signin");
  return url.toString();
};

const getCodeExchangeUrl = async (code: string): Promise<CodeExchange> => {
  const url = new URL(`${TeslaApiEndpoints.AUTH}/oauth2/v3/token`);

  const body = {
    grant_type: "authorization_code",
    client_id: getClientId(),
    client_secret: getClientSecret(),
    code,
    redirect_uri: `${appUrl}${PATHS.loginCallback}`,
  };
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

export const refreshTeslaToken = async (refreshToken: string): Promise<CodeExchange> => {
  const url = new URL(`${TeslaApiEndpoints.AUTH}/oauth2/v3/token`);
  const body = {
    grant_type: "refresh_token",
    client_id: getClientId(),
    client_secret: getClientSecret(),
    refresh_token: refreshToken,
  };
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

const getBearerTokenData = (accessToken: string) => {
  const decoded = jwt.decode(accessToken);
  if (!decoded) throw new Error("Invalid access token");
  return decoded as TeslaBearerTokenData;
};

export const Tesla = (user: { id: string; region: TeslaApiRegion }, token: { accessToken: string; refreshToken: string; expiresAt: Date }) => {
  const teslaUrl = TeslaApiEndpoints[user.region];

  const requestTeslaApi = async <T>(path: string, method: "GET" | "POST" = "GET", data: { body?: unknown; query?: Record<string, string | number> } = {}) => {
    if (token.expiresAt < new Date()) {
      token = await refreshUserSession(user.id, token.refreshToken);
    }
    if (data.query && data.query.pageSize && Number(data.query.pageSize) > MAX_PAGE_SIZE) data.query.pageSize = MAX_PAGE_SIZE.toString();
    const url = new URL(`${teslaUrl}/${path}`);
    if (data.query) {
      Object.entries(data.query)
        .filter(([key, value]) => key && value !== undefined)
        .forEach(([key, value]) => {
          url.searchParams.set(key, value.toString());
        });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: data.body ? JSON.stringify(data.body) : undefined,
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  };

  const getUserInfo = async (): Promise<UserInfoResponse> => await requestTeslaApi<UserInfoResponse>("api/1/users/me");
  const getChargingHistory = async (filters?: GetChargingHistoryParams) => {
    const formatToTeslaDate = (date: Date) => date.toISOString();
    const query = filters
      ? {
          ...filters,
          endTime: filters.endTime ? formatToTeslaDate(filters.endTime) : undefined,
          startTime: filters.startTime ? formatToTeslaDate(filters.startTime) : undefined,
        }
      : {};
    return await requestTeslaApi<ChargingHistory>("api/1/dx/charging/history", "GET", { query });
  };
  const getChargingInvoice = async (contentId: string) => {
    const response = await fetch(`${teslaUrl}/api/1/dx/charging/invoice/${contentId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    return response.blob();
  };

  return {
    ...getBearerTokenData(token.accessToken),
    getUserInfo,
    getChargingHistory,
    getChargingInvoice,
  };
};

export const TeslaInit = async (code: string) => {
  const codeExchange = await getCodeExchangeUrl(code);
  const bearerTokenData = getBearerTokenData(codeExchange.access_token);
  const teslaUserInfo = await Tesla(
    { id: "", region: bearerTokenData.ou_code as TeslaApiRegion },
    {
      accessToken: codeExchange.access_token,
      refreshToken: codeExchange.refresh_token,
      expiresAt: new Date(Date.now() + codeExchange.expires_in * 1000),
    }
  ).getUserInfo();
  return {
    ...getBearerTokenData(codeExchange.access_token),
    teslaUserInfo,
    codeExchange,
  };
};

export const TeslaFromUserId = async (userId: string) => {
  const user = await getUserWithLastSession(userId);
  if (!user) throw new Error("User not found");
  return Tesla({ id: user.id, region: user.region as TeslaApiRegion }, user.session);
};
