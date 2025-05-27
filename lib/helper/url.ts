export function getAppUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not defined");
  }
  return `${baseUrl}${path}`;
}