"use client";

import { useMemo } from "react";
import CountUp from "./CountUp";
import { krShort, time } from "../lib/format";
import { Tag, Pin, Gear, Refresh, ThemeAuto, ThemeLight, ThemeDark } from "./icons";

const THEME_ICON = { auto: ThemeAuto, light: ThemeLight, dark: ThemeDark };
const THEME_LABEL = { auto: "auto", light: "lyst", dark: "mørkt" };

export default function Masthead({
  offers, fetchedAt, loading, theme, onCycleTheme, onOpenSettings,
  onFindNearMe, onRefresh, showZip, zip, setZip, onZipSearch,
}) {
  const stats = useMemo(() => {
    if (!offers.length) return null;
    const savings = offers.reduce((s, o) => s + Math.max(0, o.originalPrice - o.newPrice), 0);
    const maxPct = offers.reduce((m, o) => Math.max(m, o.pct), 0);
    const dists = offers.map((o) => o.dist).filter((d) => d != null);
    const nearest = dists.length ? Math.min(...dists) : null;
    return { savings, maxPct, count: offers.length, nearest };
  }, [offers]);

  const ThemeIcon = THEME_ICON[theme];

  return (
    <header className="masthead">
      <div className="mh-inner wrap">
        <div className="mh-top">
          <span className="brand">
            <Tag className="mark" />
            Madspild<span className="accent">-jægeren</span>
          </span>
          <div className="mh-actions">
            <button className="icon-btn" onClick={onCycleTheme} aria-label={`Tema: ${THEME_LABEL[theme]} — tryk for at skifte`}>
              <ThemeIcon />
            </button>
            <button className="icon-btn" onClick={onOpenSettings} aria-label="Indstillinger">
              <Gear />
            </button>
          </div>
        </div>

        {stats ? (
          <div className="mh-stats">
            <p className="eyebrow"><span className="live" /> Dagens fund</p>
            <div className="stat-grid">
              <div className="stat lead">
                <div className="k">Du kan spare op til</div>
                <div className="v"><small>i alt på tværs af butikkerne</small>
                  <CountUp value={stats.savings} format={(n) => krShort(n)} />
                </div>
              </div>
              <div className="stat">
                <div className="k">Varer fundet</div>
                <div className="v mid"><CountUp value={stats.count} /></div>
              </div>
              <div className="stat">
                <div className="k">Største rabat</div>
                <div className="v mid"><CountUp value={stats.maxPct} format={(n) => `−${Math.round(n)}%`} /></div>
              </div>
            </div>
            <div className="mh-metaline">
              <span>
                {fetchedAt ? `Hentet ${time(fetchedAt)}` : ""}
                {stats.nearest != null ? ` · nærmeste butik ${stats.nearest.toFixed(1).replace(".", ",")} km` : ""}
              </span>
              <button className="mh-refresh" onClick={onRefresh} disabled={loading}>
                <Refresh /> Opdatér
              </button>
            </div>
          </div>
        ) : (
          <div className="mh-hero">
            <p className="eyebrow"><span className="live" /> Live · Salling Group</p>
            <h1>Fang maden før den bliver til <em>spild</em>.</h1>
            <p className="lede">
              Nedsatte udløbsvarer i Netto, Føtex og Bilka — hentet live, lige nu, nær dig.
              Saml en indkøbsliste og spar penge på mad der ellers blev smidt ud.
            </p>
            <div className="mh-cta">
              <button className="btn btn-primary" onClick={onFindNearMe} disabled={loading}>
                <Pin /> {loading ? "Henter…" : "Find tilbud nær mig"}
              </button>
            </div>
            {showZip && (
              <div className="zip-row">
                <div className="zip-field">
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    inputMode="numeric"
                    placeholder="Postnr. – flere med komma"
                    aria-label="Postnumre, adskilt med komma"
                    onKeyDown={(e) => e.key === "Enter" && onZipSearch()}
                  />
                </div>
                <button className="btn btn-outline" onClick={onZipSearch}>Søg</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
