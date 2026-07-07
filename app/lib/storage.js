// localStorage keys — kept identical to the original app so returning
// users keep their cart, price book, saved key and theme.
export const LS = {
  key: "mj_apikey",
  zip: "mj_zip",
  cart: "mj_cart",
  pb: "mj_prisbog",
  cache: "mj_cache",
  theme: "mj_theme",
};

export const read = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v == null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
};

export const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export const readRaw = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};

export const writeRaw = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

export const remove = (k) => {
  try {
    localStorage.removeItem(k);
  } catch {}
};
