import { TeslaApiRegion, TeslaApiScopes } from "@/providers/tesla";

export type UserRegionResponse = {
  response: {
    region: "eu" | "na" | "cn";
    fleet_api_base_url:
      | "https://fleet-api.prd.eu.vn.cloud.tesla.com"
      | "https://fleet-api.prd.na.vn.cloud.tesla.com"
      | "https://fleet-api.prd.cn.vn.cloud.tesla.com";
  };
};

export type CodeExchange = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  state: string;
  token_type: "Bearer";
};

export type UserInfo = {
  response: {
    email: string;
    full_name: string;
    profile_image_url: null | string;
    vault_uuid: string;
  };
};

export type UserInfoResponse = {
  response: {
    email: string;
    full_name: string;
    profile_image_url: string | null;
    vault_uuid: string;
  };
};

export type ChargingFeeData = {
  sessionFeeId: number;
  feeType: string;
  currencyCode: string;
  pricingType: string;
  rateBase: number;
  rateTier1: number;
  rateTier2: number;
  rateTier3: null;
  rateTier4: null;
  usageBase: number;
  usageTier1: number;
  usageTier2: number;
  usageTier3: null;
  usageTier4: null;
  totalBase: number;
  totalTier1: number;
  totalTier2: number;
  totalTier3: number;
  totalTier4: number;
  totalDue: number;
  netDue: number;
  uom: string;
  isPaid: boolean;
  status: string;
};
export type ChargingHistoryInvoice = {
  fileName: string;
  contentId: string;
  invoiceType: string;
};

export type ChargingHistoryData = {
  sessionId: number;
  vin: string;
  siteLocationName: string;
  chargeStartDateTime: string;
  chargeStopDateTime: string;
  unlatchDateTime: string;
  countryCode: string;
  fees: ChargingFeeData[];
  billingType: string;
  invoices: ChargingHistoryInvoice[];
  vehicleMakeType: string;
};

export type ChargingHistory = {
  data: ChargingHistoryData[];
  totalResults: number;
};

export type TeslaBearerTokenData = {
  iss: string;
  azp: string;
  sub: string;
  aud: string[];
  scp: TeslaApiScopes[];
  amr: string[];
  exp: number;
  iat: 1732352765;
  ou_code: TeslaApiRegion;
  locale: string;
  account_type: "business" | string;
  open_source: boolean;
  account_id: string;
  auth_time: number;
};

export type GetChargingHistoryParams = {
  endTime?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
  startTime?: string;
  vin?: string;
};
