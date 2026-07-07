"use client";

import { kr } from "../lib/format";
import { Basket } from "./icons";

export default function Cart({ cart, onToggle, onSetDone, onShare, onEmpty }) {
  if (!cart.length)
    return (
      <div className="empty">
        <div className="ill"><Basket width={64} height={64} /></div>
        <b>Kurven er tom.</b>
        <p>Læg tilbud i kurven, så samler appen en indkøbsliste per butik.</p>
      </div>
    );

  const groups = new Map();
  cart.forEach((c) => {
    if (!groups.has(c.storeId)) groups.set(c.storeId, { name: c.storeName, addr: c.addr, items: [] });
    groups.get(c.storeId).items.push(c);
  });
  const grand = cart.reduce((s, i) => s + i.price, 0);

  return (
    <>
      {[...groups.values()].map((g) => {
        const total = g.items.reduce((s, i) => s + i.price, 0);
        return (
          <div className="cart-store" key={g.name + g.addr}>
            <h3>{g.name}</h3>
            <p className="small addr">{g.addr}</p>
            {g.items.map((it) => (
              <div className="cart-row" key={it.id}>
                <input
                  type="checkbox"
                  checked={!!it.done}
                  onChange={(e) => onSetDone(it.id, e.target.checked)}
                  aria-label="Købt"
                />
                <span className={`nm${it.done ? " done" : ""}`}>{it.name}</span>
                <span className="pr">{kr(it.price)}</span>
                <button className="rm" onClick={() => onToggle(it)} aria-label="Fjern">×</button>
              </div>
            ))}
            <div className="cart-total">I alt: {kr(total)}</div>
          </div>
        );
      })}
      <div className="cart-actions">
        <div className="cart-total" style={{ flex: 1, textAlign: "left" }}>Samlet: {kr(grand)}</div>
        <button className="btn btn-ink" onClick={onShare}>Del liste</button>
        <button className="btn btn-line" onClick={onEmpty}>Tøm kurv</button>
      </div>
    </>
  );
}
