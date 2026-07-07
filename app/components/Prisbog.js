"use client";

import { useState } from "react";
import { kr } from "../lib/format";
import { Book } from "./icons";

const STORES = ["Netto", "Føtex", "Bilka", "Rema 1000", "Lidl", "Coop365", "Meny", "Løvbjerg", "ABC Lavpris", "Anden"];

export default function Prisbog({ prisbog, onAdd, onDelete }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("Netto");

  const submit = (e) => {
    e.preventDefault();
    const p = parseFloat(price);
    if (!name.trim() || isNaN(p)) return;
    onAdd({ id: Date.now(), name: name.trim(), price: p, store, date: new Date().toISOString().slice(0, 10) });
    setName(""); setPrice(""); setStore("Netto");
  };

  const rows = [...prisbog].sort((a, b) => a.name.localeCompare(b.name, "da"));

  return (
    <>
      <p className="intro-note">
        Log normalpriser på varer du køber ofte. Når en vare dukker op i tilbuddene,
        sammenligner appen automatisk og fortæller dig om nedsættelsen faktisk er billig.
      </p>
      <form className="pb-form" onSubmit={submit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vare, fx Karolines madlavningsfløde" required aria-label="Varenavn" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.25" min="0" placeholder="Normalpris kr." required aria-label="Normalpris" />
        <select value={store} onChange={(e) => setStore(e.target.value)} aria-label="Butik">
          {STORES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-ink" type="submit">Gem pris</button>
      </form>

      {rows.length === 0 ? (
        <div className="empty">
          <div className="ill"><Book width={64} height={64} /></div>
          <b>Prisbogen er tom.</b>
          <p>Gem normalpriser her — fx hvad madlavningsfløden plejer at koste — så får du automatisk besked når et tilbud faktisk er en besparelse.</p>
        </div>
      ) : (
        <table className="pb">
          <thead>
            <tr><th>Vare</th><th>Normalpris</th><th>Butik</th><th>Dato</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td className="num">{kr(e.price)}</td>
                <td>{e.store}</td>
                <td className="num">{e.date}</td>
                <td><button className="rm" onClick={() => onDelete(e.id)} aria-label="Slet">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
