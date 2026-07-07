"use client";

import { useEffect, useRef, useState } from "react";
import { Close } from "./icons";

export default function SettingsDialog({ open, onClose, savedKey, onSaveKey, onClearCache }) {
  const ref = useRef();
  const [val, setVal] = useState(savedKey || "");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => setVal(savedKey || ""), [savedKey]);

  return (
    <dialog ref={ref} onClose={onClose} onCancel={onClose}>
      <div className="dlg-head">
        Indstillinger
        <button className="dlg-close" onClick={onClose} aria-label="Luk"><Close /></button>
      </div>
      <div className="dlg-body">
        <label htmlFor="apiKey">Salling Group API-nøgle</label>
        <p className="small">Appen har allerede en indbygget nøgle. Udfyld kun feltet hvis du vil bruge en anden (fx efter rotation af nøglen).</p>
        <input id="apiKey" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Valgfrit: overskriv den indbyggede nøgle" autoComplete="off" />
        <button className="btn btn-accent" onClick={() => onSaveKey(val.trim())}>Gem nøgle</button>
        <hr className="hr" />
        <b style={{ fontSize: 13 }}>Sådan får du en nøgle (gratis, ca. 2 min.)</b>
        <ol>
          <li>Opret en konto på <a href="https://developer.sallinggroup.com" target="_blank" rel="noopener">developer.sallinggroup.com</a></li>
          <li>Opret et projekt og vælg <b>Anti Food Waste API</b></li>
          <li>Vælg <b>Bearer token</b> som autentificering og kopiér din nøgle herind</li>
          <li>Under projektets <b>Origin whitelist</b>: tilføj dit GitHub Pages-domæne (fx <span className="mono">https://duif98.github.io</span>) — ellers blokerer browseren kaldet (CORS)</li>
        </ol>
        <p className="small">Nøglen gemmes kun lokalt i din browser (localStorage) og sendes udelukkende til api.sallinggroup.com.</p>
        <hr className="hr" />
        <button className="btn btn-line" onClick={onClearCache}>Ryd cache (hentede tilbud)</button>
      </div>
    </dialog>
  );
}
