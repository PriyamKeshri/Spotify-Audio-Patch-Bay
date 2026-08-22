<div align="center">

# Signal/Chain

**A Spotify Web API client, framed as an audio patch bay.**

Playback, discovery, and library management — routed through one console.

[![License: MIT](https://img.shields.io/badge/License-MIT-1ed760.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933?logo=node.js&logoColor=white)](https://nodejs.org)

</div>

---

Most Spotify web clients embed the Web Playback SDK and turn the browser
itself into a speaker. This one doesn't — every command routes through the
**REST API** instead, so it drives whatever Spotify Connect device is already
active: your phone, a smart speaker, the desktop app. No in-browser audio, no
Web Audio API — just a console that controls the signal chain from outside it.

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Scopes requested](#scopes-requested)
- [Architecture](#architecture)
- [Known limitations](#known-limitations)
- [License](#license)

## Features

| | |
|---|---|
| **Auth** | OAuth 2.0 Authorization Code + PKCE — no client secret, no backend, automatic token refresh, cross-tab session sync |
| **Playback control** | Play / pause / skip / seek, volume, shuffle, repeat, queueing, device transfer — all via Spotify Connect |
| **Discovery** | Debounced multi-type search across tracks, artists, albums, and playlists |
| **Library** | Saved tracks, saved albums, followed artists, playlist creation, editing, and drag-to-reorder |
| **Live state** | Playback polled every 3s, with a smooth client-side ticker between polls so the progress bar never visibly jumps |
| **Signal Monitor** | An in-app debug panel — live auth status, poll state, and a request log — toggled from the header |

## Requirements

- **Node 18+**
- **A Spotify account.** Playback control (play/pause/seek/volume/etc.) requires
  **Spotify Premium** — a Spotify Web API restriction, not something this app
  can work around. Free accounts can still authenticate, search, browse, and
  manage their library.
- **A Spotify Developer app** — free, instant setup, covered below.

## Setup

### 1 · Create a Spotify app

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in.
2. Click **Create app** and fill in any name/description.
3. Under **Redirect URIs**, add exactly:

   ```
   http://127.0.0.1:5173/callback
   ```

   This must match `VITE_SPOTIFY_REDIRECT_URI` exactly, port included. Spotify
   no longer allows plain `localhost` — use `127.0.0.1`.
4. Check **Web API** under "Which API/SDKs are you planning to use?"
5. Save, then copy the **Client ID** from the app's settings. The Client
   Secret is never needed — this app doesn't use it.

### 2 · Configure

```bash
cp .env.example .env
```

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

### 3 · Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints (`http://127.0.0.1:5173`) and click **Connect with
Spotify**.

## Scopes requested

Only the scopes the app actually uses, grouped by feature: playback
state/control, recently played, library read/modify, playlist read/modify
(public and private), follow read/modify, top items, and basic profile info.
See [`src/auth/config.ts`](src/auth/config.ts) for the exact list — Spotify
shows every one of these on the consent screen, so it's kept minimal.

## Architecture

```
src/
├── auth/           PKCE flow, token storage, config
├── api/            Typed axios wrappers per feature area (playback, discovery, library, playlists)
├── hooks/          React Query hooks that call the api/ layer and sync Zustand stores
├── store/          Zustand: auth state, player/UI state
├── components/
│   ├── layout/     Shell, sidebar, top bar, debug panel
│   ├── player/     Now-playing bar, transport controls, volume, device picker
│   ├── discovery/  Media cards/rails, track rows
│   ├── playlist/   Create-playlist modal
│   ├── visualizer/ VU meter, seeded waveform (decorative — see note below)
│   └── ui/         Buttons, modal, loading states, toasts, error boundary
├── pages/          Route-level screens
└── types/          Spotify API response types
```

<details>
<summary><strong>Why polling instead of the Web Playback SDK?</strong></summary>
<br>

This app controls playback on *any* Spotify Connect device via the REST API,
rather than turning the browser itself into a playback device. That's a
deliberate trade-off — it means no in-browser audio and no `Web Audio API`
access, so the waveform/VU meter visuals are stylized and deterministic
(seeded from track ID) rather than real-time frequency analysis. Swapping in
the Web Playback SDK for in-browser playback would be a natural extension if
that's the priority instead of controlling existing devices.

</details>

<details>
<summary><strong>How does token refresh work?</strong></summary>
<br>

The axios response interceptor catches `401`s, refreshes the token once —
de-duped across concurrent requests, so five simultaneous `401`s trigger one
refresh, not five — retries the original request, and only forces a re-login
if the refresh itself fails.

</details>

## Known limitations

- Spotify's `/recommendations` and several endpoints are subject to rate
  limits; the client surfaces `429` responses with a `Retry-After` value
  rather than silently retrying.
- No offline/PWA support.

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

Built by **[Priyam Keshri](https://github.com/PriyamKeshri)**

</div>
