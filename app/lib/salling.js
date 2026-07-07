// Salling Group Anti Food Waste API — data fetching + normalisation.
// Pure functions; the React layer handles geolocation, caching and UI.

export const SALLING_URL = "https://api.sallinggroup.com/v1/food-waste/";
export const DEFAULT_KEY =
  "SG_APIM_ZFCB81B4G5ZGY2H9N7GD6QNSE5HF9SJ0FCAE2CTNVXW64QAH8YR0";

export const BRANDS = { netto: "Netto", foetex: "Føtex", bilka: "Bilka", basalt: "Basalt" };

export function flatten(data) {
  const out = [];
  (data || []).forEach((entry) => {
    const s = entry.store || {};
    (entry.clearances || []).forEach((c) => {
      const o = c.offer || {},
        p = c.product || {};
      out.push({
        id: (o.ean || p.ean || "") + "@" + (s.id || ""),
        storeId: s.id,
        storeName: s.name || "Ukendt butik",
        brand: (s.brand || "").toLowerCase(),
        addr: s.address
          ? `${s.address.street || ""}, ${s.address.zip || ""} ${s.address.city || ""}`
          : "",
        name: p.description || "Uden navn",
        image: p.image || "",
        dist: s.distance_km ?? null,
        ean: p.ean || o.ean || "",
        newPrice: o.newPrice ?? 0,
        originalPrice: o.originalPrice ?? 0,
        pct: Math.round(
          o.percentDiscount ??
            (o.originalPrice ? (1 - o.newPrice / o.originalPrice) * 100 : 0)
        ),
        endTime: o.endTime || null,
        stock: o.stock ?? null,
        stockUnit: o.stockUnit || "",
      });
    });
  });
  return out;
}

// Throws { code, status?, retry? } on failure so the UI can render a message.
export async function fetchOffers(queries, key) {
  let all = [];
  for (const query of queries) {
    const res = await fetch(SALLING_URL + query, {
      headers: { Authorization: "Bearer " + key },
    });
    if (res.status === 401 || res.status === 403)
      throw { code: "auth", status: res.status };
    if (res.status === 429)
      throw { code: "quota", retry: res.headers.get("Retry-After") };
    if (!res.ok) throw { code: "http", status: res.status };
    all = all.concat(flatten(await res.json()));
  }
  const seen = new Set();
  return all.filter((o) => !seen.has(o.id) && seen.add(o.id));
}

// Fuzzy match an offer against saved price-book entries.
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-zæøå0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

export function prisbogHint(offer, prisbog) {
  const oT = norm(offer.name);
  let best = null,
    bestScore = 0;
  prisbog.forEach((e) => {
    const eT = norm(e.name);
    const hits = eT.filter((w) => oT.some((x) => x.includes(w) || w.includes(x))).length;
    const score = hits / Math.max(1, eT.length);
    if (hits >= 2 && score > bestScore) {
      best = e;
      bestScore = score;
    }
  });
  if (!best) return null;
  const diff = best.price - offer.newPrice;
  return { store: best.store, price: best.price, diff, god: diff > 0 };
}
