export const kr = (n) =>
  n.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kr.";

export const krShort = (n) =>
  Math.round(n).toLocaleString("da-DK") + " kr.";

export const time = (t) =>
  new Date(t).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });

// Expiry label for an offer end time.
export function expiry(endTime) {
  if (!endTime) return null;
  const end = new Date(endTime);
  const hrs = Math.round((end - Date.now()) / 36e5);
  if (hrs <= 24)
    return {
      soon: true,
      text: "Udløber " + end.toLocaleString("da-DK", { weekday: "short", hour: "2-digit", minute: "2-digit" }),
    };
  return { soon: false, text: "Til " + end.toLocaleDateString("da-DK", { day: "numeric", month: "short" }) };
}
