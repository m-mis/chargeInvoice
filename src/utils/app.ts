const getAppUrl = () => {
  if (!process.env.app_url) throw new Error("App URL is not set");
  return process.env.app_url;
};
export const appUrl = getAppUrl();
