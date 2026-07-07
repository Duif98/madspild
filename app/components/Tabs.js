"use client";

const TABS = [
  { id: "tilbud", label: "Tilbud" },
  { id: "kurv", label: "Kurv" },
  { id: "prisbog", label: "Prisbog" },
];

export default function Tabs({ active, setActive, cartCount }) {
  return (
    <nav className="tabs" aria-label="Sektioner">
      <div className="tabs-inner wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={active === t.id ? "active" : ""}
            onClick={() => setActive(t.id)}
            aria-current={active === t.id}
          >
            {t.label}
            {t.id === "kurv" && cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}
