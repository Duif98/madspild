"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Masthead from "./Masthead";
import Tabs from "./Tabs";
import Offers from "./Offers";
import Cart from "./Cart";
import Prisbog from "./Prisbog";
import SettingsDialog from "./SettingsDialog";
import { fetchOffers, DEFAULT_KEY } from "../lib/salling";
import { kr } from "../lib/format";
import { LS, read, readRaw, writeRaw, write, remove } from "../lib/storage";

const FRESH_MS = 30 * 60 * 1000;

export default function App() {
  const [offers, setOffers] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusState] = useState(null);
  const [tab, setTab] = useState("tilbud");

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("pct");
  const [activeBrands, setActiveBrands] = useState(new Set());
  const [animKey, setAnimKey] = useState(0);

  const [cart, setCart] = useState([]);
  const [prisbog, setPrisbog] = useState([]);
  const [apiKey, setApiKey] = useState("");

  const [showZip, setShowZip] = useState(false);
  const [zip, setZip] = useState("6700, 6705, 6710, 6715");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("auto");

  const lastQueries = useRef(null);
  const statusTimer = useRef(null);
  const getKey = () => apiKey || DEFAULT_KEY;

  const status = useCallback((msg, kind) => {
    clearTimeout(statusTimer.current);
    setStatusState({ msg, kind });
    if (kind === "ok") statusTimer.current = setTimeout(() => setStatusState(null), 6000);
  }, []);

  /* -------- Mount: hydrate from localStorage -------- */
  useEffect(() => {
    setCart(read(LS.cart, []));
    setPrisbog(read(LS.pb, []));
    setApiKey(readRaw(LS.key) || "");
    setZip(readRaw(LS.zip) || "6700, 6705, 6710, 6715");
    setTheme(readRaw(LS.theme) || "auto");

    let cacheFresh = false;
    const c = read(LS.cache, null);
    if (c && c.v === 2 && Date.now() - c.t < FRESH_MS) {
      setOffers(c.offers);
      setFetchedAt(c.t);
      setActiveBrands(new Set([...new Set(c.offers.map((o) => o.brand))].filter(Boolean)));
      setAnimKey((k) => k + 1);
      cacheFresh = true;
      status(`Viser gemte tilbud fra ${new Date(c.t).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })} – tryk Opdatér for friske tal.`, "ok");
    }

    if (navigator.permissions && navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((p) => {
        if (p.state === "granted" && !cacheFresh) findNearMe();
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- Apply theme -------- */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "auto") { root.removeAttribute("data-theme"); root.style.colorScheme = "light dark"; }
    else { root.setAttribute("data-theme", theme); root.style.colorScheme = theme; }
    writeRaw(LS.theme, theme);
  }, [theme]);

  const cycleTheme = () => setTheme((t) => ({ auto: "light", light: "dark", dark: "auto" }[t]));

  /* -------- Fetch -------- */
  async function doFetch(queries) {
    lastQueries.current = queries;
    setLoading(true);
    status("Henter nedsatte varer…", "ok");
    try {
      const list = await fetchOffers(queries, getKey());
      setOffers(list);
      setFetchedAt(Date.now());
      setActiveBrands(new Set([...new Set(list.map((o) => o.brand))].filter(Boolean)));
      setAnimKey((k) => k + 1);
      write(LS.cache, { t: Date.now(), v: 2, offers: list });
      status(list.length ? `${list.length} nedsatte varer fundet. God jagt.` : "Ingen nedsatte varer i området lige nu – prøv et andet postnummer eller senere på dagen.", list.length ? "ok" : "err");
    } catch (e) {
      if (e && e.code === "auth") status(`API-nøglen blev afvist (fejl ${e.status}). Tjek nøglen under Indstillinger (tandhjulet øverst).`, "err");
      else if (e && e.code === "quota") status(`Kvoten er brugt op lige nu. Prøv igen om ${e.retry ? e.retry + " sek." : "lidt"}.`, "err");
      else if (e && e.code === "http") status(`Serveren svarede med fejl ${e.status}.`, "err");
      else status("Kaldet blev blokeret. Er dit domæne tilføjet under Origins i Salling-portalen? Lokalt skal siden køre via en webserver, ikke åbnes som fil.", "err");
    } finally {
      setLoading(false);
    }
  }

  function findNearMe() {
    if (!navigator.geolocation) { status("Din browser understøtter ikke lokation – søg med postnummer i stedet.", "err"); setShowZip(true); return; }
    status("Finder din position…", "ok");
    navigator.geolocation.getCurrentPosition(
      (p) => doFetch([`?geo=${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}&radius=15`]),
      () => { status("Kunne ikke få adgang til din position. Tillad lokation for siden, eller søg med postnummer herunder.", "err"); setShowZip(true); },
      { maximumAge: 10 * 60 * 1000, timeout: 12000 }
    );
  }

  function zipSearch() {
    const raw = zip.trim();
    const zips = [...new Set(raw.split(/[,;\s]+/).filter(Boolean))];
    if (!zips.length || zips.some((z) => !/^\d{4}$/.test(z)))
      return status("Indtast ét eller flere 4-cifrede postnumre, adskilt med komma – fx 6700, 6715.", "err");
    writeRaw(LS.zip, raw);
    doFetch(zips.map((z) => `?zip=${z}`));
  }

  function refresh() {
    if (lastQueries.current) doFetch(lastQueries.current);
    else findNearMe();
  }

  /* -------- Filters -------- */
  const toggleBrand = (b) =>
    setActiveBrands((prev) => {
      const next = new Set(prev);
      next.has(b) ? next.delete(b) : next.add(b);
      return next;
    });

  /* -------- Cart (functional updates so rapid clicks don't clobber) -------- */
  const toggleCart = (o) =>
    setCart((prev) => {
      const next = prev.some((c) => c.id === o.id)
        ? prev.filter((c) => c.id !== o.id)
        : [...prev, { id: o.id, name: o.name, price: o.newPrice, storeId: o.storeId, storeName: o.storeName, addr: o.addr, endTime: o.endTime, done: false }];
      write(LS.cart, next);
      return next;
    });
  const setDone = (id, done) =>
    setCart((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, done } : c));
      write(LS.cart, next);
      return next;
    });
  const emptyCart = () => {
    if (confirm("Tøm hele kurven?")) setCart(() => { write(LS.cart, []); return []; });
  };
  const shareCart = () => {
    const groups = new Map();
    cart.forEach((c) => { if (!groups.has(c.storeName)) groups.set(c.storeName, []); groups.get(c.storeName).push(c); });
    let txt = "Indkøbsliste – Madspild-jægeren\n";
    groups.forEach((items, store) => { txt += `\n${store}\n`; items.forEach((i) => (txt += `  - ${i.name} – ${kr(i.price)}\n`)); });
    txt += `\nSamlet: ${kr(cart.reduce((s, i) => s + i.price, 0))}`;
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else navigator.clipboard.writeText(txt).then(() => status("Liste kopieret til udklipsholderen.", "ok"));
  };

  /* -------- Prisbog -------- */
  const addPrisbog = (entry) =>
    setPrisbog((prev) => { const next = [...prev, entry]; write(LS.pb, next); return next; });
  const deletePrisbog = (id) =>
    setPrisbog((prev) => { const next = prev.filter((e) => e.id !== id); write(LS.pb, next); return next; });

  /* -------- Settings -------- */
  const saveKey = (v) => { if (!v) return; setApiKey(v); writeRaw(LS.key, v); setSettingsOpen(false); status("Nøgle gemt. Klar til jagt.", "ok"); };
  const clearCache = () => { remove(LS.cache); status("Cache ryddet.", "ok"); };

  return (
    <>
      <Masthead
        offers={offers} fetchedAt={fetchedAt} loading={loading}
        theme={theme} onCycleTheme={cycleTheme} onOpenSettings={() => setSettingsOpen(true)}
        onFindNearMe={findNearMe} onRefresh={refresh}
        showZip={showZip} zip={zip} setZip={setZip} onZipSearch={zipSearch}
      />
      <Tabs active={tab} setActive={setTab} cartCount={cart.length} />

      <main>
        <div className="wrap">
          {statusMsg && <div className={`status ${statusMsg.kind}`}>{statusMsg.msg}</div>}

          {tab === "tilbud" && (
            <div className="tabpane">
              <Offers
                offers={offers} loading={loading} hasFetched={fetchedAt != null}
                cart={cart} prisbog={prisbog}
                query={query} setQuery={setQuery} sort={sort} setSort={setSort}
                activeBrands={activeBrands} toggleBrand={toggleBrand}
                onToggleCart={toggleCart} animKey={animKey}
              />
            </div>
          )}

          {tab === "kurv" && (
            <div className="tabpane">
              <Cart cart={cart} onToggle={toggleCart} onSetDone={setDone} onShare={shareCart} onEmpty={emptyCart} />
            </div>
          )}

          {tab === "prisbog" && (
            <div className="tabpane">
              <Prisbog prisbog={prisbog} onAdd={addPrisbog} onDelete={deletePrisbog} />
            </div>
          )}
        </div>
      </main>

      <SettingsDialog
        open={settingsOpen} onClose={() => setSettingsOpen(false)}
        savedKey={apiKey} onSaveKey={saveKey} onClearCache={clearCache}
      />
    </>
  );
}
