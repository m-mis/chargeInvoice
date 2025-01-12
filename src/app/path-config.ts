const paths = {
  home: "/",
  login: "/login",
  loginCallback: "/login/callback",
  error: "/error",
  dashboard: "/dashboard",
  newUser: "/dashboard/new-user",
  invoice: "/dashboard/invoice",
} as const;

const errorMessage = (errorMessage: string) => `${paths.error}?error=${encodeURIComponent(errorMessage)}`;
const errorCode = (errorCode: string) => `${paths.error}?code=${encodeURIComponent(errorCode)}`;

const PATHS = { ...paths, errorMessage, errorCode };
export default PATHS;
