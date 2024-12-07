export const dateUTCFormat = (date: string) => {
  return new Date(date).toLocaleString("en-US", { timeZone: "UTC" }) + " (UTC)";
};
