"use client";

import { useState } from "react";
import { kr } from "../lib/format";
import { expiry } from "../lib/format";
import { prisbogHint } from "../lib/salling";

export default function OfferCard({ offer, inCart, prisbog, onToggle, index, animate }) {
  const [imgOk, setImgOk] = useState(true);
  const exp = expiry(offer.endTime);
  const hint = prisbogHint(offer, prisbog);
  const showImg = offer.image && imgOk;

  return (
    <div
      className={`offer${animate ? " reveal" : ""}`}
      style={animate ? { "--i": Math.min(index, 12) } : undefined}
    >
      <div className="sticker-badge">−{offer.pct}%</div>
      <div className={`thumb${showImg ? "" : " ph"}`}>
        {showImg && (
          <img src={offer.image} alt="" loading="lazy" onError={() => setImgOk(false)} />
        )}
      </div>
      <div className="name">{offer.name}</div>
      <div className="prices">
        <span className="new">{kr(offer.newPrice)}</span>
        <span className="old">{kr(offer.originalPrice)}</span>
      </div>
      <div className="sub">
        <span>{offer.stock != null ? `${offer.stock} ${offer.stockUnit || "stk."} tilbage` : ""}</span>
        <span className={exp?.soon ? "soon" : ""}>{exp?.text || ""}</span>
      </div>
      {hint && (
        <div className={`prisbog-hint${hint.god ? " god" : ""}`}>
          Prisbog: normalt {kr(hint.price)} ({hint.store}) →{" "}
          {hint.god ? `du sparer ${kr(hint.diff)}` : "IKKE billigere end normalt"}
        </div>
      )}
      <button className={`add${inCart ? " inCart" : ""}`} onClick={() => onToggle(offer)}>
        {inCart ? "✓ I kurven" : "+ Læg i kurv"}
      </button>
    </div>
  );
}
