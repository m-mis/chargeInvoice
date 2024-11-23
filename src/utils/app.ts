const getAppUrl = () => {
  if (!process.env.APP_URL) throw new Error("App URL is not set");
  return process.env.APP_URL;
};
export const appUrl = getAppUrl();
