const paths = {
  login: "/login",
  loginCallback: "/login/callback",
  error: "/error",
};

const errorMessage = (errorMessage: string) => `${paths.error}?error=${encodeURIComponent(errorMessage)}`;
const errorCode = (errorCode: string) => `${paths.error}?code=${encodeURIComponent(errorCode)}`;

const PATHS = { ...paths, errorMessage, errorCode };
export default PATHS;
