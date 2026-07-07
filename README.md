# Madspild-jægeren

Find nedsatte udløbsvarer nær dig — live fra Salling Groups Anti Food Waste API.
Bygget i Next.js (statisk eksport → GitHub Pages) med en cinematisk mørk masthead,
et lyst funktionelt værktøj og live-data som blikfang.

**Live:** https://duif98.github.io/madspild/

## Funktioner

- **Tilbud** — henter nedsatte varer via lokation eller postnummer, grupperet per butik,
  med søgning, sortering og brand-filtre. Live "du kan spare op til …"-statistik i mastheaden.
- **Kurv** — indkøbsliste per butik, afkrydsning, totaler og del-funktion.
- **Prisbog** — gem normalpriser; appen matcher automatisk mod tilbud og fortæller om
  nedsættelsen faktisk er billig.
- Auto lyst/mørkt tema (masthead altid mørk), skeleton-loaders, alt gemt i `localStorage`.

## Kom i gang

Kræver [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statisk build → ./out
```

> API-kaldene til Salling virker kun på et **whitelistet domæne** (dit GitHub Pages-domæne),
> ikke på `localhost` — CORS blokerer ellers kaldet. Test derfor tilbudshentningen på den live side.

## API-nøgle

Appen har en indbygget nøgle. Vil du bruge din egen: åbn **Indstillinger** (tandhjulet),
og følg vejledningen. Husk at tilføje dit Pages-domæne under **Origin whitelist** i
[Salling-portalen](https://developer.sallinggroup.com). Nøglen gemmes kun lokalt i browseren.

## Deploy

Push til `main` — den medfølgende GitHub Actions-workflow bygger og udgiver automatisk.
Sæt **Settings → Pages → Source: GitHub Actions** første gang. Sti-præfikset (`/madspild`)
sættes automatisk ud fra repo-navnet.

## Teknik

Next.js 14 (App Router, `output: "export"`) · self-hostede Google Fonts (Fraunces / Space
Grotesk / Inter) · vanilla React, ingen runtime-afhængigheder ud over React. Al app-logik
ligger i `app/components/App.js`; API-laget i `app/lib/salling.js`.
