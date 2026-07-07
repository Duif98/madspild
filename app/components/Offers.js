"use client";

import { useMemo, useRef } from "react";
import OfferCard from "./OfferCard";
import Skeletons from "./Skeletons";
import { BRANDS } from "../lib/salling";
import { Pin } from "./icons";

export default function Offers({
  offers, loading, hasFetched, cart, prisbog,
  query, setQuery, sort, setSort, activeBrands, toggleBrand,
  onToggleCart, animKey,
}) {
  const lastAnim = useRef(-1);
  const animate = animKey !== lastAnim.current;
  lastAnim.current = animKey;

  const brandsPresent = useMemo(
    () => [...new Set(offers.map((o) => o.brand))].filter(Boolean),
    [offers]
  );

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = offers.filter(
      (o) => (!o.brand || activeBrands.has(o.brand)) && (!q || o.name.toLowerCase().includes(q))
    );
    if (sort === "pct") list.sort((a, b) => b.pct - a.pct);
    if (sort === "price") list.sort((a, b) => a.newPrice - b.newPrice);
    if (sort === "exp") list.sort((a, b) => new Date(a.endTime || 8e15) - new Date(b.endTime || 8e15));
    const map = new Map();
    list.forEach((o) => {
      if (!map.has(o.storeId)) map.set(o.storeId, { name: o.storeName, addr: o.addr, dist: o.dist, items: [] });
      map.get(o.storeId).items.push(o);
    });
    return [...map.values()];
  }, [offers, query, sort, activeBrands]);

  if (loading) return <Skeletons />;

  if (!hasFetched && offers.length === 0)
    return (
      <div className="empty">
        <div className="ill"><Pin width={64} height={64} /></div>
        <b>Klar til jagt?</b>
        <p>Tryk <b>Find tilbud nær mig</b> øverst — så henter appen alle nedsatte udløbsvarer i nærheden, live fra Salling Groups officielle API.</p>
      </div>
    );

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  let idx = -1;
  return (
    <>
      {offers.length > 0 && (
        <>
          <div className="filterbar">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg vare, fx fløde…"
              aria-label="Søg i tilbud"
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sortering">
              <option value="pct">Størst rabat %</option>
              <option value="price">Laveste pris</option>
              <option value="exp">Udløber snarest</option>
            </select>
          </div>
          {brandsPresent.length >= 2 && (
            <div className="filterbar chips">
              {brandsPresent.map((b) => (
                <button
                  key={b}
                  className={`chip${activeBrands.has(b) ? " on" : ""}`}
                  onClick={() => toggleBrand(b)}
                >
                  {BRANDS[b] || b}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {total === 0 ? (
        <div className="empty">Ingen varer matcher din søgning.</div>
      ) : (
        groups.map((g) => (
          <div className="store" key={g.name + g.addr}>
            <div className="store-head">
              <h2>{g.name}</h2>
              <span className="addr">
                {g.addr}
                {g.dist != null ? ` · ${g.dist.toFixed(1).replace(".", ",")} km` : ""}
              </span>
            </div>
            <div className="grid">
              {g.items.map((o) => {
                idx++;
                return (
                  <OfferCard
                    key={o.id}
                    offer={o}
                    inCart={cart.some((c) => c.id === o.id)}
                    prisbog={prisbog}
                    onToggle={onToggleCart}
                    index={idx}
                    animate={animate}
                  />
                );
              })}
            </div>
          </div>
        ))
      )}
    </>
  );
}
