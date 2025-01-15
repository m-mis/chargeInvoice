const paths = {
  home: "/",
  login: "/login",
  loginCallback: "/login/callback",
  error: "/error",
  dashboard: "/account",
  newUser: "/account/new-user",
  invoice: "/account/invoice",
  invoices: "/account/invoices",
  emails: "/account/emails",
} as const;

const errorMessage = (errorMessage: string) => `${paths.error}?error=${encodeURIComponent(errorMessage)}`;
const errorCode = (errorCode: string) => `${paths.error}?code=${encodeURIComponent(errorCode)}`;

const PATHS = { ...paths, errorMessage, errorCode };
export default PATHS;
