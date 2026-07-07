// Inline stroke icons — one consistent family (1.8 stroke, round joins).
const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export const Tag = (p) => (
  <svg viewBox="0 0 24 24" width="23" height="23" {...s} {...p}>
    <path d="M3 11.5V4.9A1.9 1.9 0 0 1 4.9 3h6.6l8.9 8.9a1.6 1.6 0 0 1 0 2.3l-6.2 6.2a1.6 1.6 0 0 1-2.3 0L3 11.5z" />
    <circle cx="8" cy="8" r="1.5" />
  </svg>
);
export const Pin = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...s} {...p}>
    <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
export const Gear = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...s} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
  </svg>
);
export const Refresh = (p) => (
  <svg viewBox="0 0 24 24" width="15" height="15" {...s} {...p}>
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
    <path d="M21 4v4h-4" />
    <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
    <path d="M3 20v-4h4" />
  </svg>
);
export const Close = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...s} strokeWidth={2} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const Basket = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...s} strokeWidth={1.4} {...p}>
    <path d="M5 7h15l-1.4 11.2A2 2 0 0 1 16.6 20H8.4a2 2 0 0 1-2-1.8L5 7z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);
export const Book = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...s} strokeWidth={1.4} {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5.5z" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);
export const ThemeAuto = (p) => (
  <svg viewBox="0 0 24 24" width="19" height="19" {...s} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
  </svg>
);
export const ThemeLight = (p) => (
  <svg viewBox="0 0 24 24" width="19" height="19" {...s} {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2M12 19.5v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.5 12h2M19.5 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4" />
  </svg>
);
export const ThemeDark = (p) => (
  <svg viewBox="0 0 24 24" width="19" height="19" {...s} {...p}>
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
  </svg>
);
export const Instagram = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...s} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
